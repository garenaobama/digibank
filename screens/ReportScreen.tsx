"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  // where, // Keep if server-side filtering is desired later
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { ProductModel, SaleStatus } from "@/models/ProductModel"; // Import ProductModel
import { app } from "@/utils/FirebaseApp";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa"; // Example icons
import { FiChevronDown } from "react-icons/fi"; // Dropdown icon

// Map card labels to SaleStatus enum values
const statusMap: { [key: string]: SaleStatus } = {
  Gọi: SaleStatus.Called,
  Gặp: SaleStatus.Met,
  "Thu hồ sơ": SaleStatus.DocsCollected,
  "Định giá": SaleStatus.Valuated,
  Trình: SaleStatus.Submitted,
  "Phê duyệt TD": SaleStatus.Approved,
  "Đóng cơ hội bán": SaleStatus.Closed, // Add Closed status if needed for filtering
  // Other cards like Active TD, Ký HĐ PTD, Active PTD don't map directly to SaleStatus
};

// Initial structure for summary data - counts will be updated
const initialSummaryStructure = [
  { label: "Gọi", count: 0, status: SaleStatus.Called, color: "orange" },
  { label: "Gặp", count: 0, status: SaleStatus.Met },
  {
    label: "Thu hồ sơ",
    count: 0,
    status: SaleStatus.DocsCollected,
    dotColor: "green",
  },
  {
    label: "Định giá",
    count: 0,
    status: SaleStatus.Valuated,
    dotColor: "green",
  },
  { label: "Trình", count: 0, status: SaleStatus.Submitted },
  {
    label: "Phê duyệt TD",
    count: 0,
    status: SaleStatus.Approved,
    dotColor: "green",
  },
  // These don't map directly to SaleStatus - keep counts at 0 or implement separate logic
  { label: "Active TD", count: 0, status: null },
  { label: "Ký HĐ PTD", count: 0, status: null, dotColor: "orange" },
  { label: "Active PTD", count: 0, status: null, dotColor: "orange" },
];

const ReportScreen: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductModel[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<SaleStatus | null>(null);

  // State for active tabs, dropdowns etc. (optional for static layout)
  const [activeCallReportTab, setActiveCallReportTab] = useState("new");
  const [isSalesDetailsOpen, setIsSalesDetailsOpen] = useState(true);
  const [isCareDetailsOpen, setIsCareDetailsOpen] = useState(true);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductError(null);
      const db = getFirestore(app);
      const productsCollection = collection(db, "products");
      try {
        const productSnapshot: QuerySnapshot<DocumentData> = await getDocs(
          productsCollection
        );
        const productList: ProductModel[] = productSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ProductModel)
        );
        setAllProducts(productList);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setProductError(err.message || "Failed to fetch products.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Calculate summary counts based on fetched products
  const summaryData = useMemo(() => {
    const counts = new Map<SaleStatus, number>();
    Object.values(SaleStatus).forEach((status) => counts.set(status, 0));

    allProducts.forEach((product) => {
      if (product.status && counts.has(product.status)) {
        counts.set(product.status, (counts.get(product.status) || 0) + 1);
      }
    });

    return initialSummaryStructure.map((item) => ({
      ...item,
      count: item.status ? counts.get(item.status) || 0 : 0, // Update count if status exists in map
    }));
  }, [allProducts]);

  // Filter products based on selected status
  const filteredProducts = useMemo(() => {
    if (!selectedStatusFilter) {
      return []; // Show no products in the table unless a filter is selected
      // Or return allProducts; if you want to show all by default
    }
    return allProducts.filter((p) => p.status === selectedStatusFilter);
  }, [allProducts, selectedStatusFilter]);

  // Handle clicking a summary card
  const handleFilterClick = (status: SaleStatus | null) => {
    if (!status) return; // Ignore clicks on cards without a mappable status
    setSelectedStatusFilter(
      (prevFilter) => (prevFilter === status ? null : status) // Toggle filter: set if different, clear if same
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Top Header Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            // onClick={() => router.back()} // Add router if needed
            className="mr-3 text-xl hover:text-orange-600"
            aria-label="Go back"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold flex items-center">
            Báo cáo hoạt động bán hàng
            <FaInfoCircle className="ml-2 text-gray-400 cursor-pointer" />
          </h2>
        </div>
        {/* Filters - Static for now */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
              <option>Xem theo: Tuần</option>
              <option>Xem theo: Tháng</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative flex items-center border border-gray-300 rounded px-3 py-1.5 text-sm bg-white">
            <span>28/04/2025 - 04/05/2025</span>
            <FaCalendarAlt className="ml-2 text-gray-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Summary Cards Section - Now Clickable */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-6">
        {summaryData.map((item) => (
          <button // Changed div to button
            key={item.label}
            onClick={() => handleFilterClick(item.status)} // Add onClick handler
            disabled={!item.status} // Disable button if status is not mappable
            className={`bg-white p-3 rounded-lg shadow border text-left focus:outline-none ${
              item.status
                ? "hover:shadow-md transition-shadow"
                : "cursor-default opacity-70"
            } ${
              selectedStatusFilter === item.status
                ? "border-orange-500 ring-2 ring-orange-300" // Highlight active filter
                : item.color === "orange"
                ? "border-orange-500"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              {item.dotColor && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.dotColor === "green"
                      ? "bg-green-500"
                      : item.dotColor === "orange"
                      ? "bg-orange-500"
                      : ""
                  }`}
                ></span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {/* Show loading state? */}
              {loadingProducts ? "..." : item.count}
            </div>
          </button>
        ))}
      </div>

      {/* Call Report Section - Conditionally Rendered */}
      {selectedStatusFilter === SaleStatus.Called && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-3">Báo cáo cuộc gọi</h3>
          {/* Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveCallReportTab("new")}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                  activeCallReportTab === "new"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Khách hàng mới (0)
              </button>
              <button
                onClick={() => setActiveCallReportTab("existing")}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                  activeCallReportTab === "existing"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Khách hàng hiện hữu (0)
              </button>
            </nav>
          </div>

          {/* Tab Content - Placeholder for actual data */}
          {activeCallReportTab === "new" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {/* Sales Details */}
              <div>
                <button
                  onClick={() => setIsSalesDetailsOpen(!isSalesDetailsOpen)}
                  className="flex items-center font-medium mb-1 w-full text-left focus:outline-none"
                >
                  <FiChevronDown
                    className={`mr-1 transition-transform ${
                      isSalesDetailsOpen ? "" : "-rotate-90"
                    }`}
                  />
                  Bán Hàng: <span className="ml-auto font-bold">0</span>
                </button>
                {isSalesDetailsOpen && (
                  <ul className="pl-4 text-xs space-y-1 text-gray-600">
                    <li className="flex justify-between">
                      <span>Đặt hẹn được:</span>
                      <span className="text-green-600">0</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Không đặt hẹn được:</span>
                      <span className="text-red-600">0</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Không liên lạc được:</span>
                      <span className="text-red-600">0</span>
                    </li>
                  </ul>
                )}
              </div>
              {/* Care Details */}
              <div>
                <button
                  onClick={() => setIsCareDetailsOpen(!isCareDetailsOpen)}
                  className="flex items-center font-medium mb-1 w-full text-left focus:outline-none"
                >
                  <FiChevronDown
                    className={`mr-1 transition-transform ${
                      isCareDetailsOpen ? "" : "-rotate-90"
                    }`}
                  />
                  Chăm sóc KHHH: <span className="ml-auto font-bold">0</span>
                </button>
                {isCareDetailsOpen && (
                  <ul className="pl-4 text-xs space-y-1 text-gray-600">
                    <li className="flex justify-between">
                      <span>KH đã nghe:</span>{" "}
                      <span className="text-green-600">0</span>
                    </li>
                    {/* Add other care details if applicable */}
                  </ul>
                )}
              </div>
              {/* Total */}
              <div className="font-medium">
                Tổng : <span className="ml-auto font-bold">0</span>
              </div>
            </div>
          )}
          {activeCallReportTab === "existing" && (
            <div className="text-center text-gray-500 py-4">
              Data for existing clients
            </div>
          )}
        </div>
      )}

      {/* Product List Table Section (Updated) */}
      <div
        className={`bg-white shadow rounded-md overflow-hidden ${
          !selectedStatusFilter ? "hidden" : ""
        }`}
      >
        {" "}
        {/* Hide table if no filter */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-base font-semibold">
            {selectedStatusFilter
              ? `Danh sách Cơ hội bán - ${selectedStatusFilter}`
              : "Danh sách Cơ hội bán"}
          </h3>
          {/* Optional: Add other controls if needed */}
        </div>
        {loadingProducts ? (
          <div className="p-4 text-center">Loading products...</div>
        ) : productError ? (
          <div className="p-4 text-center text-red-600">
            Error: {productError}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {/* Adjust columns for ProductModel data */}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Cơ hội (MST)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị Deal (VNĐ)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NV Assigned
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 && selectedStatusFilter ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Không có cơ hội bán nào với trạng thái "
                    {selectedStatusFilter}".
                  </td>
                </tr>
              ) : !selectedStatusFilter ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Chọn một trạng thái từ thẻ tóm tắt ở trên để xem danh sách.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.clientId}
                    </td>{" "}
                    {/* Fetch client name later */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.productName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      {product.dealValue.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === SaleStatus.Approved
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.assignedStaffId}
                    </td>{" "}
                    {/* Fetch staff name later */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportScreen;
