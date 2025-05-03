"use client";
import React, { useState, useContext } from "react";
import {
  ClientModel,
  ClientType,
  BusinessType,
  CustomerSegment,
  YearlyFinancials,
  addClientToFirestore,
} from "../models/ClientModel";
import { UserContext } from "../app/layout";
import { useRouter } from "next/navigation";

// Mock data for dropdowns - replace with API calls if needed
const provinces = ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Khác"];
const districts = ["Quận Cầu Giấy", "Quận 1", "Quận Sơn Trà", "Khác"];
const contactTitles = ["Giám đốc", "Kế toán trưởng", "Người liên hệ khác"];
const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

// Vietnamese labels for financial fields
const financialFieldLabels: Record<
  keyof Omit<YearlyFinancials, "year">,
  string
> = {
  netRevenue: "Doanh thu thuần",
  netProfit: "Lợi nhuận sau thuế",
  financialRevenue: "Doanh thu tài chính",
  financialCost: "Chi phí tài chính",
  shortTermDebt: "Vay và nợ tài chính ngắn hạn",
  longTermDebt: "Vay và nợ tài chính dài hạn",
};

export default function AddClientScreen() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ClientModel>>({
    type: ClientType.SaleLead,
    province: provinces[0],
    district: districts[0],
    businessType: BusinessType.Limited,
    segment: CustomerSegment.SME_Manufacturing,
    contactTitle: contactTitles[0],
    financials: years.map((year) => ({
      year,
      netRevenue: 0,
      netProfit: 0,
      financialRevenue: 0,
      financialCost: 0,
      shortTermDebt: 0,
      longTermDebt: 0,
    })),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinancialChange = (
    year: number,
    field: keyof Omit<YearlyFinancials, "year">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      financials: (prev.financials || []).map((fin) =>
        fin.year === year ? { ...fin, [field]: Number(value) || 0 } : fin
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }
    if (!formData.taxCode || !formData.name) {
      setError("Tên khách hàng và Mã số thuế là bắt buộc.");
      setLoading(false);
      return;
    }

    const clientToAdd: ClientModel = {
      ...formData,
      id: formData.taxCode, // Use taxCode as ID
      taxCode: formData.taxCode,
      name: formData.name,
      type: ClientType.SaleLead,
      staffId: user.id,
      addDate: new Date().toISOString(),
      // Ensure default values for potentially undefined fields
      companyPhone: formData.companyPhone || "",
      companyEmail: formData.companyEmail || "",
      province: formData.province || provinces[0],
      district: formData.district || districts[0],
      address: formData.address || "",
      businessType: formData.businessType || BusinessType.Limited,
      contactName: formData.contactName || "",
      contactPhone: formData.contactPhone || "",
      contactEmail: formData.contactEmail || "",
      contactTitle: formData.contactTitle || contactTitles[0],
      segment: formData.segment || CustomerSegment.Other,
      financials: formData.financials || [],
    };

    const result = await addClientToFirestore(clientToAdd);
    setLoading(false);

    if (result.success) {
      // Optionally show a success message
      router.push("/khach-hang-tiem-nang"); // Redirect to sales lead list
    } else {
      setError(result.error || "Failed to add client.");
    }
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-1 text-blue-700">
          Thêm khách hàng lần lượt
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Điền đầy đủ trường thông tin bắt buộc để thêm mới khách hàng
        </p>

        {/* Thông tin định danh */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            Thông tin định danh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khách hàng *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập tên khách hàng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã số thuế/ Số đăng ký kinh doanh *
              </label>
              <input
                type="text"
                name="taxCode"
                value={formData.taxCode || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập mã số thuế/ Số đăng ký kinh doanh"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại công ty
              </label>
              <input
                type="text"
                name="companyPhone"
                value={formData.companyPhone || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email công ty
              </label>
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập email"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/ Thành phố *
              </label>
              <select
                name="province"
                value={formData.province || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/ Huyện *
              </label>
              <select
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
              placeholder="Nhập địa chỉ chi tiết"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại hình doanh nghiệp *
            </label>
            <select
              name="businessType"
              value={formData.businessType || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
            >
              {Object.entries(BusinessType).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Thông tin liên hệ */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            Thông tin liên hệ{" "}
            <span className="text-sm font-normal text-gray-500">
              (Vui lòng thêm ít nhất 01 liên hệ)
            </span>
          </h3>
          {/* Simple single contact for now - enhance later if needed */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black"
                placeholder="Nhập"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chức danh
              </label>
              <select
                name="contactTitle"
                value={formData.contactTitle || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
              >
                {contactTitles.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Thông tin tài chính */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            Thông tin tài chính
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-600">
                    Năm
                  </th>
                  {years.map((year) => (
                    <th
                      key={year}
                      className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-600"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  Object.keys(
                    financialFieldLabels
                  ) as (keyof typeof financialFieldLabels)[]
                ).map((field) => (
                  <tr key={field}>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                      {financialFieldLabels[field]} (VND)
                    </td>
                    {years.map((year) => (
                      <td
                        key={`${field}-${year}`}
                        className="border border-gray-300 px-3 py-2"
                      >
                        <input
                          type="number"
                          value={
                            formData.financials?.find((f) => f.year === year)?.[
                              field
                            ] || 0
                          }
                          onChange={(e) =>
                            handleFinancialChange(year, field, e.target.value)
                          }
                          className="w-full border border-gray-300 px-3 py-1 rounded-md text-black"
                          placeholder="Nhập"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md mr-3"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff6a00] text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
