"use client";

import React, { useState } from "react";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa"; // Example icons
import { FiChevronDown } from "react-icons/fi"; // Dropdown icon

// Placeholder data for summary cards
const summaryData = [
  { label: "Gọi", count: 0, color: "orange" },
  { label: "Gặp", count: 0 },
  { label: "Thu hồ sơ", count: 0, dotColor: "green" },
  { label: "Định giá", count: 0, dotColor: "green" },
  { label: "Trình", count: 0 },
  { label: "Phê duyệt TD", count: 0, dotColor: "green" },
  { label: "Active TD", count: 0 },
  { label: "Ký HĐ PTD", count: 0, dotColor: "orange" },
  { label: "Active PTD", count: 0, dotColor: "orange" },
];

const ReportScreen: React.FC = () => {
  // State for active tabs, dropdowns etc. (optional for static layout)
  const [activeCallReportTab, setActiveCallReportTab] = useState("new");
  const [isSalesDetailsOpen, setIsSalesDetailsOpen] = useState(true);
  const [isCareDetailsOpen, setIsCareDetailsOpen] = useState(true);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      {/* Summary Cards Section */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-6">
        {summaryData.map((item) => (
          <div
            key={item.label}
            className={`bg-white p-3 rounded-lg shadow border ${
              item.color === "orange" ? "border-orange-500" : "border-gray-200"
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
            <div className="text-2xl font-bold text-gray-900">{item.count}</div>
          </div>
        ))}
      </div>

      {/* Call Report Section */}
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
                    <span>Đặt hẹn được:</span>{" "}
                    <span className="text-green-600">0</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Không đặt hẹn được:</span>{" "}
                    <span className="text-red-600">0</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Không liên lạc được:</span>{" "}
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

      {/* Called Customers Table Section */}
      <div className="bg-white shadow rounded-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-base font-semibold">
            Danh sách Khách hàng Đã gọi
          </h3>
          <button className="relative border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50">
            Kết quả
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              +4
            </span>
            <FiChevronDown className="inline-block ml-1 mb-px" />
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên công ty
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu năm gần nhất (VNĐ)
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày gọi
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mục đích gọi
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kết quả gọi
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung trao đổi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Placeholder Row - Add real data fetching/mapping later */}
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                No call data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportScreen;
