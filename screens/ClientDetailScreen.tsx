"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { app } from "@/utils/FirebaseApp";
import {
  ClientModel,
  YearlyFinancials,
  CustomerSegment,
} from "@/models/ClientModel";
import { ProductModel, ProductName, SaleStatus } from "@/models/ProductModel"; // For related products
import {
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa";
import { FiChevronDown, FiPlus } from "react-icons/fi";

// Placeholder for staff mapping
const getStaffName = (id: string) => `bachlt2 - MSB Cầu Giấy`; // Replace with actual mapping

// Helper to format currency
const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const ClientDetailScreen: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("id");

  const [client, setClient] = useState<ClientModel | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductModel[]>([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch Client Data
  useEffect(() => {
    if (!clientId) {
      setError("Client ID is missing");
      setLoadingClient(false);
      setLoadingProducts(false);
      return;
    }
    const fetchClient = async () => {
      setLoadingClient(true);
      setError(null);
      const db = getFirestore(app);
      try {
        const clientRef = doc(db, "clients", clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          setClient(clientSnap.data() as ClientModel);
        } else {
          setError("Client not found");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching client data");
        console.error("Error fetching client:", err);
      } finally {
        setLoadingClient(false);
      }
    };
    fetchClient();
  }, [clientId]);

  // Fetch Related Products/Opportunities
  useEffect(() => {
    if (!clientId) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      const db = getFirestore(app);
      const productsQuery = query(
        collection(db, "products"),
        where("clientId", "==", clientId)
      );
      try {
        const productSnapshot: QuerySnapshot<DocumentData> = await getDocs(
          productsQuery
        );
        const productList: ProductModel[] = productSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ProductModel)
        );
        setRelatedProducts(productList);
      } catch (err: any) {
        console.error("Error fetching related products:", err);
        // Handle product fetch error separately if needed
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [clientId]);

  const latestFinancials: YearlyFinancials | undefined =
    client?.financials?.reduce(
      (latest, current) => (current.year > latest.year ? current : latest),
      client.financials[0]
    );

  if (loadingClient)
    return <div className="p-6 text-center">Loading client data...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!client) return <div className="p-6 text-center">Client not found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Khách hàng tiềm năng</h1>
      </div>

      {/* Top Action Buttons */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium">
          Thêm hoạt động
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
          Thêm công việc
        </button>
        <button
          className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border border-gray-300 text-sm font-medium"
          onClick={() => router.push(`/add-product?clientId=${clientId}`)}
        >
          Thêm cơ hội bán
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
          Account Planning
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
          <svg
            className="w-4 h-4 inline mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM8.293 5.293a1 1 0 011.414 0L12 7.586l2.293-2.293a1 1 0 111.414 1.414L13.414 9l2.293 2.293a1 1 0 01-1.414 1.414L12 10.414l-2.293 2.293a1 1 0 01-1.414-1.414L10.586 9 8.293 6.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Trả lại
        </button>
      </div>

      {/* Client Info Header */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
        <div className="flex items-center mb-2">
          <FaBuilding className="text-orange-600 text-2xl mr-3" />
          <h2 className="text-lg font-bold text-orange-600 mr-4">
            {client.name}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm mb-2">
          <div>
            <span className="text-gray-500">MST/ Số ĐKKD:</span>{" "}
            {client.taxCode}
          </div>
          <div>
            <span className="text-gray-500">Khu vực:</span> {client.district},{" "}
            {client.province}
          </div>
          <div>
            <span className="text-gray-500">Năm thành lập:</span>{" "}
            {/* Add year founded if available */} 2020
          </div>
          <div>
            <span className="text-gray-500">Phân khúc:</span> {client.segment}
          </div>
          <div>
            <span className="text-gray-500">Ngành nghề:</span> Sản xuất các cấu
            kiện kim loại {/* Add industry if available */}
          </div>
          <div>
            <span className="text-gray-500">Cán bộ tiếp cận:</span>{" "}
            {getStaffName(client.staffId)}
          </div>
          <div>
            <span className="text-gray-500">Hạng khách hàng:</span> B{" "}
            {/* Add rating if available */}
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="text-gray-500">Gợi ý bán:</span>{" "}
          <span className="text-blue-600 font-medium">Chưa có thông tin</span>{" "}
          <button className="ml-2 text-orange-600 underline">
            Xem chi dẫn bán
          </button>
        </div>
        <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded">
          <FaInfoCircle className="mr-2" />
          Tính tới thời điểm hiện tại, khách hàng này không thuộc Blacklist
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contacts */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Liên hệ khả dụng (3/3)</h3>{" "}
            {/* Make count dynamic later */}
            <button className="bg-white hover:bg-gray-50 text-gray-800 px-3 py-1 rounded border border-gray-300 text-sm font-medium">
              Thêm
            </button>
          </div>
          <div className="space-y-3 text-sm mb-auto">
            {/* Contact 1 - Assuming from ClientModel */}
            <div>
              <div className="font-medium">{client.contactName}</div>
              <div className="text-xs text-gray-500 mb-1">
                {client.contactTitle}
              </div>
              <div className="flex items-center text-xs text-gray-600 mb-0.5">
                <FaPhoneAlt className="mr-1.5 text-gray-400" />{" "}
                {client.contactPhone}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <FaEnvelope className="mr-1.5 text-gray-400" />{" "}
                {client.contactEmail}
              </div>
            </div>
            {/* Placeholder Contacts - replace with actual data/loop if multiple contacts */}
            <div>
              <div className="font-medium">CHU THÀNH LONG</div>
              <div className="text-xs text-gray-500 mb-1">
                Tổng giám đốc/Giám đốc
              </div>
              <div className="flex items-center text-xs text-gray-600 mb-0.5">
                <FaPhoneAlt className="mr-1.5 text-gray-400" /> 0904132258
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <FaEnvelope className="mr-1.5 text-gray-400" /> -
              </div>
            </div>
            <div>
              <div className="font-medium">CHU VĂN THÀNH</div>
              <div className="text-xs text-gray-500 mb-1">Kế toán</div>
              <div className="flex items-center text-xs text-gray-600 mb-0.5">
                <FaPhoneAlt className="mr-1.5 text-gray-400" /> 0904132258
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <FaEnvelope className="mr-1.5 text-gray-400" />{" "}
                thepthanhlong1711@gmail.com
              </div>
            </div>
          </div>
          <button className="mt-3 text-orange-600 text-sm font-medium hover:underline">
            Xem tất cả
          </button>
        </div>

        {/* Center Column: Overview/Details/Financials Tabs */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          {/* Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                  activeTab === "overview"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                  activeTab === "details"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Thông tin chi tiết
              </button>
              <button
                onClick={() => setActiveTab("financial_report")}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                  activeTab === "financial_report"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Báo cáo tài chính
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Financial Info Snippet */}
              <div className="bg-orange-50 p-3 rounded border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">Thông tin tài chính</h4>
                  <button className="text-orange-600 text-xs font-medium hover:underline">
                    Xem chi tiết &gt;
                  </button>
                </div>
                <dl className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <dt>Doanh thu thuần {latestFinancials?.year}:</dt>
                    <dd className="font-medium">
                      {formatCurrency(latestFinancials?.netRevenue)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Lợi nhuận sau thuế:</dt>
                    <dd className="font-medium">
                      {formatCurrency(latestFinancials?.netProfit)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Vay và nợ thuê tài chính dài hạn:</dt>
                    <dd className="font-medium">
                      {formatCurrency(latestFinancials?.longTermDebt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Vay và nợ thuê tài chính ngắn hạn:</dt>
                    <dd className="font-medium">
                      {formatCurrency(latestFinancials?.shortTermDebt)}
                    </dd>
                  </div>
                </dl>
              </div>
              {/* CIC Info Snippet - Placeholder */}
              <div className="bg-orange-50 p-3 rounded border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">Thông tin CIC</h4>
                  <button className="text-orange-600 text-xs font-medium hover:underline">
                    Xem chi tiết &gt;
                  </button>
                </div>
                <dl className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <dt>Ngày cập nhật:</dt>
                    <dd className="font-medium">Invalid date</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tổng dư nợ:</dt>
                    <dd className="font-medium">{formatCurrency(0)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Nhóm nợ hiện tại:</dt>
                    <dd className="font-medium">-</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Nhóm nợ cao nhất (36 tháng):</dt>
                    <dd className="font-medium">-</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Nợ có TSBĐ:</dt>
                    <dd className="font-medium">-</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Nợ không có TSBĐ:</dt>
                    <dd className="font-medium">-</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Cam kết ngoại bảng:</dt>
                    <dd className="font-medium">-</dd>
                  </div>
                </dl>
              </div>
              {/* Add other overview sections like Xuất/Nhập khẩu if needed */}
            </div>
          )}
          {activeTab === "details" && (
            <div className="text-sm text-gray-500">
              Chi tiết thông tin khách hàng...
            </div>
          )}
          {activeTab === "financial_report" && (
            <div className="text-sm text-gray-500">
              Báo cáo tài chính chi tiết...
            </div>
          )}
        </div>

        {/* Right Column: Opportunities */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">
              Cơ hội bán ({relatedProducts.length})
            </h3>
            <button className="bg-white hover:bg-gray-50 text-gray-800 px-3 py-1 rounded border border-gray-300 text-sm font-medium">
              Thêm
            </button>
          </div>
          {loadingProducts ? (
            <div className="text-sm text-center text-gray-500 py-4">
              Loading opportunities...
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="text-sm text-center text-gray-500 py-4 mb-auto">
              Chưa có cơ hội bán nào.
            </div>
          ) : (
            <div className="space-y-3 text-sm mb-auto">
              {relatedProducts.map((product) => (
                <div key={product.id} className="border-b pb-2 last:border-b-0">
                  <div className="font-medium mb-0.5">
                    {product.productName}
                  </div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    Dự kiến đóng:{" "}
                    {product.expectedCloseDate
                      ? new Date(product.expectedCloseDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "-"}
                  </div>
                  <div className="text-xs text-orange-600 font-medium">
                    {product.status}
                  </div>
                </div>
              ))}
            </div>
          )}
          {relatedProducts.length > 0 && (
            <button className="mt-3 text-orange-600 text-sm font-medium hover:underline">
              Xem tất cả
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailScreen;
