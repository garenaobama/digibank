"use client";

import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { app } from "@/utils/FirebaseApp"; // Assuming Firebase is initialized here
import {
  ProductModel,
  SalesProcess,
  ProductName,
  SaleStatus,
} from "@/models/ProductModel"; // Adjust path if needed
import { FaSearch, FaPlus, FaSyncAlt, FaFileExport } from "react-icons/fa"; // Example icons
import { FiFilter } from "react-icons/fi"; // Example filter icon
import { useRouter } from "next/navigation";

const SellingChanceScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSalesProcess, setSelectedSalesProcess] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore(app);
      const productsCollection = collection(db, "products");

      try {
        const productSnapshot: QuerySnapshot<DocumentData> = await getDocs(
          productsCollection
        );
        const productList: ProductModel[] = productSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as ProductModel)
        );
        setProducts(productList);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(
          err.message || "Failed to fetch products. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    return (
      (!selectedSalesProcess ||
        product.salesProcess === selectedSalesProcess) &&
      (!selectedProductName || product.productName === selectedProductName) &&
      (!selectedStatus || product.status === selectedStatus)
    );
  });

  // --- UI Rendering ---

  if (loading) {
    return <div className="p-4 text-center">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header and Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Cơ hội bán</h1>
        <div className="space-x-2">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={() => router.push("/add-product")}
          >
            <FaPlus className="mr-2" />
            Thêm cơ hội
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow inline-flex items-center">
            <FaFileExport className="mr-2" />
            Xuất file
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            href="#"
            className="border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Tất cả
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Đang theo dõi
          </a>
        </nav>
      </div>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-white rounded shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm ID CHB, Tên KH, MST..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          {/* SalesProcess Dropdown */}
          <select
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            value={selectedSalesProcess}
            onChange={(e) => setSelectedSalesProcess(e.target.value)}
          >
            <option value="">Quy trình bán</option>
            {Object.values(SalesProcess).map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
          {/* Status Dropdown */}
          <select
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Trạng Thái</option>
            {Object.values(SaleStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {/* ProductName Dropdown */}
          <select
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            value={selectedProductName}
            onChange={(e) => setSelectedProductName(e.target.value)}
          >
            <option value="">Sản Phẩm Chi Tiết</option>
            {Object.values(ProductName).map((pn) => (
              <option key={pn} value={pn}>
                {pn}
              </option>
            ))}
          </select>
          {/* Placeholder for Kênh tiếp cận, always N/A */}
          <div className="w-full py-2 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-400 flex items-center justify-center">
            N/A
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <button className="text-orange-600 hover:text-orange-800 font-medium text-sm inline-flex items-center">
            <FiFilter className="mr-1" />
            Thêm Bộ Lọc
          </button>
          <span className="text-gray-300">|</span>
          <button
            className="text-orange-600 hover:text-orange-800 font-medium text-sm"
            onClick={() => {
              setSelectedSalesProcess("");
              setSelectedProductName("");
              setSelectedStatus("");
            }}
          >
            Xóa Lọc
          </button>
          <span className="text-gray-300">|</span>
          <button
            className="text-orange-600 hover:text-orange-800 font-medium text-sm inline-flex items-center"
            onClick={() => {
              setSelectedSalesProcess("");
              setSelectedProductName("");
              setSelectedStatus("");
            }}
          >
            Đặt lại
            <FaSyncAlt className="ml-1" />
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Add appropriate padding/text alignment classes */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kênh tiếp cận {/* Corresponds to productName? */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm chi tiết {/* Not in model? Maybe productName again? */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạng dự kiến {/* Not in model? */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phân khúc {/* Not in model? */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu (VNĐ) {/* Corresponds to dealValue */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá trị deal (VNĐ) {/* Corresponds to dealValue? Duplicate? */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn vị KD {/* Corresponds to assignedStaffId? Needs mapping */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No opportunities found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/product-detail?id=${product.id}`)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {/* Placeholder for Client Name - Needs fetching based on clientId */}
                    {`Client ID: ${product.clientId}`}
                    <div className="text-xs text-gray-500">
                      MST: {product.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Placeholder - Data not in ProductModel */}
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Placeholder - Data not in ProductModel */}
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Format currency */}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.dealValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Placeholder - Assuming same as Doanh thu or needs clarification */}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.dealValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Placeholder for Staff Name/Unit - Needs mapping from assignedStaffId */}
                    {`Staff ID: ${product.assignedStaffId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {/* Add actual icon buttons and handlers */}
                    <button className="text-indigo-600 hover:text-indigo-900">
                      ✏️ {/* Placeholder Edit */}
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      📄 {/* Placeholder Copy */}
                    </button>
                    <button className="text-yellow-500 hover:text-yellow-700">
                      ⭐ {/* Placeholder Favorite */}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellingChanceScreen;
