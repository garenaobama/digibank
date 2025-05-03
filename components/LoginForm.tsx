"use client";
import React from "react";

export default function LoginForm() {
  // TODO: Re-enable reCAPTCHA v3 here when ready
  return (
    <div className="w-[350px] p-8 rounded-2xl shadow-lg bg-white">
      <div className="flex items-center mb-8">
        <img src="/images/logo.svg" alt="Digi.Sale" className="h-10 mr-3" />
        <span className="font-bold text-2xl text-[#222]">Digi.Sale</span>
      </div>
      <h2 className="font-semibold text-xl mb-6 text-[#222]">
        Đăng nhập hệ thống
      </h2>
      <form>
        <div className="mb-5">
          <label className="font-medium text-[#444] text-[15px]">
            Tài khoản *
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg mt-2 overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Nhập tài khoản"
              className="flex-1 px-3 py-2 text-[15px] text-black outline-none border-none bg-transparent"
              style={{ minWidth: 0 }}
            />
            <span className="bg-gray-100 px-3 py-2 text-[#888] text-[15px] whitespace-nowrap">
              @msb.com.vn
            </span>
          </div>
        </div>
        <div className="mb-5">
          <label className="font-medium text-[#444] text-[15px]">
            Mật khẩu *
          </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-black mt-2 outline-none bg-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ff6a00] text-white font-bold text-lg rounded-lg py-3 mt-2 cursor-pointer shadow-md hover:bg-[#ff7f32] transition-colors"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
