"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/utils/FirebaseApp";
import { ProductModel, SaleStatus } from "@/models/ProductModel";
import { ClientModel } from "@/models/ClientModel";
import { FaStar, FaPencilAlt } from "react-icons/fa";

// Helper to get the order of statuses
const statusOrder = Object.values(SaleStatus);

const ProductDetailScreen: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [clientData, setClientData] = useState<ClientModel | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingClient, setLoadingClient] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<SaleStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Fetch Product Data ---
  useEffect(() => {
    if (!id) {
      setError("Product ID is missing");
      setLoadingProduct(false);
      setLoadingClient(false);
      return;
    }
    const fetchProduct = async () => {
      setLoadingProduct(true);
      setError(null);
      try {
        const db = getFirestore(app);
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as ProductModel);
        } else {
          setError("Product not found");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Error fetching product");
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- Fetch Client Data (dependent on product) ---
  useEffect(() => {
    if (!product?.clientId) {
      setLoadingClient(false);
      return;
    }

    const fetchClient = async () => {
      setLoadingClient(true);
      try {
        const db = getFirestore(app);
        const clientRef = doc(db, "clients", product.clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          setClientData(clientSnap.data() as ClientModel);
        } else {
          console.warn(`Client not found for ID: ${product.clientId}`);
        }
      } catch (err: any) {
        console.error("Error fetching client:", err);
      } finally {
        setLoadingClient(false);
      }
    };

    fetchClient();
  }, [product?.clientId]);

  // --- Update Product Status ---
  const updateProductStatus = async (newStatus: SaleStatus) => {
    if (!product) return;
    setIsUpdating(true);
    setError(null);
    const db = getFirestore(app);
    const productRef = doc(db, "products", product.id);

    try {
      await updateDoc(productRef, {
        status: newStatus,
      });
      // Update local state to reflect the change immediately
      setProduct((prevProduct) =>
        prevProduct ? { ...prevProduct, status: newStatus } : null
      );
      setIsModalOpen(false); // Close modal on success
      setTargetStatus(null);
    } catch (err: any) {
      console.error("Error updating product status:", err);
      setError(err.message || "Failed to update status.");
      // Keep modal open on error to show feedback or allow retry?
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Open Confirmation Modal ---
  const handleStatusClick = (status: SaleStatus) => {
    if (status === product?.status) return; // Don't open modal if clicking the current status
    setTargetStatus(status);
    setIsModalOpen(true);
  };

  // --- Render Logic ---
  if (loadingProduct || loadingClient)
    return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!product)
    return <div className="p-6 text-center">Product data not available.</div>;

  const currentStatusIndex = statusOrder.indexOf(product.status);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      {/* Top Header Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 text-xl hover:text-orange-600"
            aria-label="Go back"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">Chi tiết cơ hội bán</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium">
            Thêm hoạt động
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
            Thêm công việc
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
            Chuyển tiếp
          </button>
        </div>
      </div>

      {/* Product ID / Status Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-orange-600 text-base font-bold mb-1">
              {/* Placeholder for the long descriptive name - needs client data */}
              {product.id}_{clientData?.name || "[Client Name]"}_
              {product.productName}_cb0
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Khách hàng:</span>{" "}
              {product.clientId} - {clientData?.name || "[Client Name]"}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Sản phẩm:</span>{" "}
              {product.productName}
              <FaPencilAlt className="inline-block ml-1 text-orange-500 cursor-pointer" />
              <span className="ml-4 font-medium">Cán bộ tiếp cận:</span>{" "}
              {product.assignedStaffId}
              {/* Placeholder needs staff name/unit */}
              <span className="ml-4 font-medium">Nguồn tiếp cận:</span> ĐVĐR
              {/* Placeholder */}
              <span className="ml-4 font-medium">Quy trình bán:</span>{" "}
              {product.salesProcess}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
              Kênh thường {/* Placeholder? */}
            </span>
            <button className="border px-3 py-1 rounded text-orange-600 border-orange-400 text-sm hover:bg-orange-50 flex items-center">
              <FaStar className="mr-1.5" />
              Theo dõi
            </button>
          </div>
        </div>
      </div>

      {/* Status Stepper Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200 overflow-x-auto">
        <div className="flex items-center" style={{ minWidth: "800px" }}>
          {statusOrder.map((step, idx) => {
            const isActive = step === product?.status;
            const currentProductStatusIndex = statusOrder.indexOf(
              product.status
            );
            const isCompleted = idx < currentProductStatusIndex;

            return (
              <React.Fragment key={step}>
                {idx > 0 && <div className="flex-1 h-0.5 bg-gray-300"></div>}
                <button
                  onClick={() => handleStatusClick(step)}
                  disabled={isActive}
                  className={`px-4 py-2 rounded text-center text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white cursor-default"
                      : isCompleted
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  } ${!isActive ? "cursor-pointer" : ""}`}
                >
                  {step}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Details Columns Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Thông tin khách hàng */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="font-semibold mb-3 text-base">Thông tin khách hàng</h3>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Tên khách hàng:</dt>
              <dd className="text-right font-medium">
                {clientData?.name || "[Client Name]"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Mã số thuế:</dt>
              <dd className="text-right font-medium">{product.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Số CIF:</dt>
              <dd className="text-right font-medium">-</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Doanh thu năm gần nhất (VNĐ):</dt>
              <dd className="text-right font-medium">
                {product.dealValue?.toLocaleString("vi-VN") || "-"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Phân khúc:</dt>
              <dd className="text-right font-medium">SME Sản xuất</dd>{" "}
              {/* Placeholder */}
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Hạng dự kiến:</dt>
              <dd className="text-right font-medium">B</dd> {/* Placeholder */}
            </div>
          </dl>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="font-semibold mb-3 text-base">Thông tin sản phẩm</h3>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">Giá trị deal (VNĐ):</dt>
              <dd className="text-right font-medium flex items-center">
                {product.dealValue?.toLocaleString("vi-VN") || "-"}
                <FaPencilAlt className="ml-2 text-orange-500 cursor-pointer" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Nhu cầu vay:</dt>
              <dd className="text-right font-medium">-</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Mục đích vay:</dt>
              <dd className="text-right font-medium">-</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">Thời gian dự kiến đóng CHB:</dt>
              <dd className="text-right font-medium flex items-center">
                {new Date(product.expectedCloseDate).toLocaleDateString(
                  "vi-VN"
                )}
                <FaPencilAlt className="ml-2 text-orange-500 cursor-pointer" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Hình thức sử dụng:</dt>
              <dd className="text-right font-medium">-</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Chi dẫn bán:</dt>
              <dd className="text-right font-medium">-</dd>
            </div>
          </dl>
        </div>

        {/* Liên hệ quản lý hồ sơ */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="font-semibold mb-3 text-base">
            Liên hệ quản lý hồ sơ
          </h3>
          {/* Use fetched client contact info */}
          {clientData ? (
            <div className="mb-3">
              <div className="font-medium text-sm">
                {clientData.contactName}
              </div>
              <div className="text-xs text-gray-500">
                {clientData.contactTitle}
              </div>
              <div className="text-xs text-gray-500">
                📞 {clientData.contactPhone || "-"}
              </div>
              <div className="text-xs text-gray-500">
                ✉️ {clientData.contactEmail || "-"}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No contact information available.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal Render */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null); // Clear previous update errors when closing manually
        }}
        onConfirm={() => targetStatus && updateProductStatus(targetStatus)}
        statusName={targetStatus || ""}
        isLoading={isUpdating}
        errorMessage={error}
      />
    </div>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  statusName,
  isLoading,
  errorMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  statusName: string;
  isLoading: boolean;
  errorMessage: string | null;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-medium mb-4">Xác nhận thay đổi</h3>
        <p className="mb-6 text-sm text-gray-700">
          Bạn có chắc chắn muốn thay đổi trạng thái thành "{statusName}"?
        </p>
        {errorMessage && (
          <p className="mb-4 text-sm text-red-600">Error: {errorMessage}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang cập nhật..." : "Đồng ý"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
