"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select"; // Import react-select
import { UserContext } from "../app/layout";
import { ClientModel, ClientType } from "../models/ClientModel"; // Import ClientType
import {
  ProductModel,
  SalesProcess,
  ProductName,
  SaleStatus,
  addProductToFirestore, // Import the function
} from "../models/ProductModel";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Import Firestore functions
import { app } from "../utils/FirebaseApp"; // Import Firebase app instance

// Mock data - Remove mockClients
// const mockClients = [
//   { id: "12345", name: "Công ty A (12345)" },
//   { id: "67890", name: "Công ty B (67890)" },
// ];
// Remove mockContacts and related state/handler
// const mockContacts = [
//   { id: "c1", name: "Nguyễn Văn A - Giám đốc" },
//   { id: "c2", name: "Trần Thị B - Kế toán" },
// ];

export default function AddProductScreen() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ProductModel>>({
    salesProcess: SalesProcess.Normal, // Default value
    productName: ProductName.SMEHook, // Default value
    dealValue: 0,
    expectedCloseDate: "",
    clientId: "",
    // status will be set on creation, likely Allocated
  });
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  // const [selectedContactId, setSelectedContactId] = useState<string>(""); // Remove contact state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allClients, setAllClients] = useState<ClientModel[]>([]); // State for all fetched clients
  // const [filteredClients, setFilteredClients] = useState<ClientModel[]>([]); // Remove filtered state
  // const [clientSearch, setClientSearch] = useState<string>(""); // Remove search state
  const [fetchingClients, setFetchingClients] = useState(true);

  // Fetch SaleLead clients on mount
  useEffect(() => {
    async function fetchSaleLeads() {
      setFetchingClients(true);
      setError(null);
      try {
        const db = getFirestore(app);
        const q = query(
          collection(db, "clients"),
          where("type", "==", ClientType.SaleLead)
        );
        const snapshot = await getDocs(q);
        const leads = snapshot.docs.map((doc) => doc.data() as ClientModel);
        setAllClients(leads);
        // setFilteredClients(leads); // Remove this line
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Không thể tải danh sách khách hàng.");
        setAllClients([]);
        // setFilteredClients([]); // Remove this line
      } finally {
        setFetchingClients(false);
      }
    }
    fetchSaleLeads();
  }, []);

  // Remove the useEffect for filtering clients
  // useEffect(() => {
  //   if (!clientSearch) {
  //     setFilteredClients(allClients);
  //   } else {
  //     const lowerCaseSearch = clientSearch.toLowerCase();
  //     setFilteredClients(
  //       allClients.filter(
  //         (client) =>
  //           client.name.toLowerCase().includes(lowerCaseSearch) ||
  //           client.taxCode.toLowerCase().includes(lowerCaseSearch)
  //       )
  //     );
  //   }
  // }, [clientSearch, allClients]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dealValue" ? Number(value) || 0 : value,
    }));
  };

  // Modified handleClientChange for react-select
  const handleClientSelectChange = (selectedOption: any) => {
    const clientId = selectedOption ? selectedOption.value : "";
    setSelectedClientId(clientId);
    setFormData((prev) => ({
      ...prev,
      clientId: clientId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("User not found. Please login again.");
      return;
    }
    if (
      !formData.clientId ||
      !formData.expectedCloseDate ||
      !formData.dealValue
    ) {
      setError(
        "Vui lòng điền đầy đủ thông tin khách hàng, sản phẩm, ngày dự kiến và giá trị."
      );
      return;
    }

    setLoading(true);

    const productToAdd: ProductModel = {
      id: `${formData.clientId}-${Date.now()}`, // Generate a simple unique ID for now
      clientId: formData.clientId,
      salesProcess: formData.salesProcess || SalesProcess.Normal,
      productName: formData.productName || ProductName.SMEHook,
      expectedCloseDate: formData.expectedCloseDate,
      dealValue: formData.dealValue || 0,
      status: SaleStatus.Allocated, // Initial status
      assignedStaffId: user.id,
      createdDate: new Date().toISOString(),
    };

    console.log("Product to Add:", productToAdd);

    // --- Replace Mock Submission with Firestore Call ---
    try {
      const result = await addProductToFirestore(productToAdd);
      setLoading(false);

      if (result.success) {
        alert("Cơ hội bán đã được thêm thành công!");
        // TODO: Decide where to navigate after successful addition
        // Example: Navigate to a list of sales chances or back to client detail
        router.push("/home"); // Redirect home for now
      } else {
        setError(result.error || "Failed to add product chance.");
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        error.message || "An unexpected error occurred during submission."
      );
      console.error("Error in handleSubmit:", error);
    }
    // --- End Firestore Call ---

    // Remove Mock success logic
    // setTimeout(() => {
    //   setLoading(false);
    //   alert("Mock: Cơ hội bán đã được thêm!");
    //   router.push("/home"); // Redirect home for now
    // }, 1000);
  };

  return (
    <div className="p-6 bg-white min-h-full text-black">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Thêm cơ hội bán lần lượt
          </h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Điền đầy đủ trường thông tin bắt buộc để thêm mới cơ hội bán
        </p>

        {/* Thông tin khách hàng */}
        <section className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-md font-semibold text-blue-600 mb-4">
            Thông tin khách hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khách hàng *
              </label>
              {/* Remove Search Input */}
              {/* <input ... /> */}

              {/* Replace HTML Select with react-select */}
              <Select
                instanceId="client-select" // Important for SSR/hydration
                options={allClients.map((client) => ({
                  value: client.id,
                  label: `${client.name} (${client.taxCode})`,
                }))}
                value={allClients
                  .map((client) => ({
                    value: client.id,
                    label: `${client.name} (${client.taxCode})`,
                  }))
                  .find((option) => option.value === selectedClientId)}
                onChange={handleClientSelectChange}
                placeholder={
                  fetchingClients
                    ? "Đang tải..."
                    : "Chọn hoặc tìm khách hàng..."
                }
                isLoading={fetchingClients}
                isClearable
                isSearchable
                required // Note: 'required' prop might not work directly, validation in handleSubmit is key
                className="w-full text-black"
                classNamePrefix="react-select" // For potential custom styling
                styles={{
                  // Basic styling to match theme roughly
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "#ff6a00"
                      : "rgb(209 213 219)", // gray-300
                    boxShadow: state.isFocused
                      ? "0 0 0 1px #ff6a00"
                      : baseStyles.boxShadow,
                    "&:hover": {
                      borderColor: state.isFocused
                        ? "#ff6a00"
                        : "rgb(156 163 175)", // gray-400
                    },
                    minHeight: "42px", // Match input height
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isSelected
                      ? "#ff6a00"
                      : state.isFocused
                      ? "#fed7aa"
                      : baseStyles.backgroundColor, // orange-200 on focus
                    color: state.isSelected ? "white" : "black",
                    ":active": {
                      ...baseStyles[":active"],
                      backgroundColor: state.isSelected ? "#ff6a00" : "#fed7aa",
                    },
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "#6b7280", // gray-500
                  }),
                  input: (baseStyles) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                  singleValue: (baseStyles) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
              />
            </div>
          </div>
        </section>

        {/* Thông tin sản phẩm */}
        {/* TODO: Make this section repeatable if needed */}
        <section className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-md font-semibold text-blue-600 mb-4">
            Thông tin sản phẩm
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Mỗi dòng tương đương với 1 cơ hội bán. Mỗi lần tạo được tối đa 05 cơ
            hội
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Quy trình bán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quy trình bán *
              </label>
              <select
                name="salesProcess"
                value={formData.salesProcess}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
              >
                <option value="">Chọn</option>
                {Object.values(SalesProcess).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            {/* Sản phẩm chi tiết */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sản phẩm chi tiết *
              </label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
              >
                <option value="">Chọn</option>
                {Object.values(ProductName).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            {/* Thời gian dự kiến đóng CHB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian dự kiến đóng CHB *
              </label>
              <input
                type="date"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white"
              />
            </div>
            {/* Giá trị deal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị deal *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="dealValue"
                  value={formData.dealValue || ""}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-black bg-white pr-12" // Add padding for VND
                  placeholder="Nhập"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  VND
                </span>
              </div>
            </div>
            {/* Thao tác */}
            <div className="text-center">
              {/* Placeholder for action button if needed */}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 p-2"
              >
                {/* Add refresh icon here, e.g., using an SVG or icon library */}
                &#x21bb; {/* Simple refresh symbol */}
              </button>
            </div>
          </div>
        </section>

        {/* Add another product button */}
        {/* TODO: Implement logic to add multiple product rows */}
        <div className="mb-8">
          <button
            type="button"
            className="text-orange-600 hover:text-orange-800 text-sm font-semibold flex items-center gap-1"
          >
            <span className="text-lg">+</span> Thêm một cơ hội bán khác
          </button>
        </div>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        {/* Action Buttons */}
        <div className="flex justify-end mt-8 gap-3">
          <button
            type="button"
            onClick={() => router.back()} // Or a specific cancel route
            className="bg-white text-[#ff6a00] border border-[#ff6a00] px-6 py-2 rounded-md font-semibold hover:bg-orange-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff6a00] text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50 hover:bg-orange-700"
          >
            {loading ? "Đang thêm..." : "Thêm mới"}
          </button>
        </div>
      </form>
    </div>
  );
}
