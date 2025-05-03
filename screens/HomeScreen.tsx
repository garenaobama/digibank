import React from "react";
import type { UserModel } from "../models/UserModel";

export default function HomeScreen({ user }: { user: UserModel }) {
  return (
    <main className="p-8 text-black">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] rounded-xl p-6 text-white shadow-lg">
          <div className="text-xl font-semibold mb-1 text-white">
            Xin chào, {user.name}
          </div>
          <div className="text-sm text-white">
            Chúc bạn có một ngày làm việc hiệu quả và ngập tiếng cười
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between text-black">
          <div className="font-semibold text-black mb-2">
            KPI thu thuần tháng
          </div>
          <div className="text-sm text-gray-500 mb-1">
            Thực tế/Kế hoạch:{" "}
            <span className="font-bold text-black">9.27/-</span> triệu VND
          </div>
          <div className="text-sm text-green-600 mb-2">Kết quả: Đạt</div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-black font-bold">
              0%
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between text-black">
          <div className="font-semibold text-black mb-2">
            KPI khách hàng tín dụng tháng
          </div>
          <div className="text-sm text-gray-500 mb-1">
            Thực tế/Kế hoạch: <span className="font-bold text-black">0/-</span>{" "}
            khách hàng
          </div>
          <div className="text-sm text-green-600 mb-2">Kết quả: Đạt</div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-black font-bold">
              0%
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between text-black">
          <div className="font-semibold text-black mb-2">
            KPI khách hàng phi tín dụng tháng
          </div>
          <div className="text-sm text-gray-500 mb-1">
            Thực tế/Kế hoạch: <span className="font-bold text-black">0/-</span>{" "}
            khách hàng
          </div>
          <div className="text-sm text-green-600 mb-2">Kết quả: Đạt</div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-black font-bold">
              0%
            </div>
          </div>
        </div>
      </div>
      {/* Report Section */}
      <div className="bg-white rounded-xl p-6 shadow text-black">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-black">
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
              <div className="text-2xl font-bold text-black">0</div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
