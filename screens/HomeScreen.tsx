import React from "react";

const navItems = ["Khách hàng", "Cơ hội bán", "Công việc", "Báo cáo"];

export default function HomeScreen() {
  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <div className="flex items-center">
          <img src="/images/logo.svg" alt="Digi.Sale" className="h-8 mr-6" />
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li
                key={item}
                className="font-semibold text-[#222] hover:text-[#ff6a00] cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Mã số thuế/ Tên KH/ Số CIF"
            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
          />
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img src="/images/user.jpg" alt="User" className="w-8 h-8" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] rounded-xl p-6 text-white shadow-lg">
            <div className="text-xl font-semibold mb-1">Xin chào, bachlt2</div>
            <div className="text-sm">
              Chúc bạn có một ngày làm việc hiệu quả và ngập tiếng cười
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* KPI Cards */}
          <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
            <div className="font-semibold text-[#222] mb-2">
              KPI thu thuần tháng
            </div>
            <div className="text-sm text-gray-500 mb-1">
              Thực tế/Kế hoạch:{" "}
              <span className="font-bold text-[#222]">9.27/-</span> triệu VND
            </div>
            <div className="text-sm text-green-600 mb-2">Kết quả: Đạt</div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-[#222] font-bold">
                0%
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
            <div className="font-semibold text-[#222] mb-2">
              KPI khách hàng tín dụng tháng
            </div>
            <div className="text-sm text-gray-500 mb-1">
              Thực tế/Kế hoạch:{" "}
              <span className="font-bold text-[#222]">0/-</span> khách hàng
            </div>
            <div className="text-sm text-green-600 mb-2">Kết quả: Đạt</div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-[#222] font-bold">
                0%
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
            <div className="font-semibold text-[#222] mb-2">
              KPI khách hàng phi tín dụng tháng
            </div>
            <div className="text-sm text-gray-500 mb-1">
              Thực tế/Kế hoạch:{" "}
              <span className="font-bold text-[#222]">0/-</span> khách hàng
            </div>
            <div className="text-sm text-green-600 mb-2">Kết quả: Đạt</div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-[#222] font-bold">
                0%
              </div>
            </div>
          </div>
        </div>
        {/* Report Section */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-[#222]">
              Báo cáo hoạt động bán hàng luỹ kế tháng
            </div>
            <a href="#" className="text-[#ff6a00] text-sm font-medium">
              Xem chi tiết
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
            {[
              "Gọi",
              "Gặp",
              "Thu hồ sơ",
              "Định giá",
              "Trình",
              "Phê duyệt TD",
              "Active TD",
              "Ký HĐ PTD",
              "Active PTD",
            ].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div className="text-2xl font-bold text-[#222]">0</div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
