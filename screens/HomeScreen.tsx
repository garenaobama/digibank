import React, { useState, useEffect, useMemo } from "react";
import type { UserModel } from "../models/UserModel";
import {
  getFirestore,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { app } from "@/utils/FirebaseApp";
import { ProductModel, SaleStatus } from "@/models/ProductModel";

// Define the structure and order for the home screen report
const homeScreenReportItems: { label: string; status: SaleStatus | null }[] = [
  { label: "Gọi", status: SaleStatus.Called },
  { label: "Gặp", status: SaleStatus.Met },
  { label: "Thu hồ sơ", status: SaleStatus.DocsCollected },
  { label: "Định giá", status: SaleStatus.Valuated },
  { label: "Trình", status: SaleStatus.Submitted },
  { label: "Phê duyệt TD", status: SaleStatus.Approved },
  // Items without direct status mapping - will show count 0
  { label: "Active TD", status: null },
  { label: "Ký HĐ PTD", status: null },
  { label: "Active PTD", status: null },
];

export default function HomeScreen({ user }: { user: UserModel }) {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  // Fetch all products
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
        setProducts(productList);
      } catch (err: any) {
        console.error("Error fetching products for home screen:", err);
        setProductError(err.message || "Failed to fetch products.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = new Map<SaleStatus, number>();
    Object.values(SaleStatus).forEach((status) => counts.set(status, 0));
    products.forEach((product) => {
      if (product.status && counts.has(product.status)) {
        counts.set(product.status, (counts.get(product.status) || 0) + 1);
      }
    });
    return counts;
  }, [products]);

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
      {/* Report Section - Updated */}
      <div className="bg-white rounded-xl p-6 shadow text-black">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-black">
            Báo cáo hoạt động bán hàng luỹ kế tháng
          </div>
          <a href="/bao-cao" className="text-[#ff6a00] text-sm font-medium">
            Xem chi tiết
          </a>
        </div>
        {loadingProducts ? (
          <div className="text-center text-gray-500 py-4">
            Đang tải báo cáo...
          </div>
        ) : productError ? (
          <div className="text-center text-red-600 py-4">
            Lỗi tải báo cáo: {productError}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
            {homeScreenReportItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                {/* Get count from map if status exists, otherwise 0 */}
                <div className="text-2xl font-bold text-black">
                  {item.status ? statusCounts.get(item.status) ?? 0 : 0}
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
