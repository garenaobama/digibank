"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { app } from "../utils/FirebaseApp";
import {
  ClientType,
  ClientModel,
  YearlyFinancials,
} from "../models/ClientModel";
import { UserModel } from "../models/UserModel";

const PAGE_SIZE = 10;

// Mock: Replace with Firestore fetch if you have staff in Firestore
const staffList: UserModel[] = [
  {
    id: "1",
    name: "Bach Tran",
    username: "bach_tran_01",
    password: "12345678",
  },
];

function getStaffName(staffId: string) {
  const staff = staffList.find((s) => s.id === staffId);
  return staff ? staff.name : staffId;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

// Helper function to get the latest net revenue
function getLatestNetRevenue(
  financials: YearlyFinancials[] | undefined
): number {
  if (!financials || financials.length === 0) {
    return 0;
  }
  // Ensure financials array is not empty before accessing index 0
  const latestFinancial = financials.reduce((latest, current) => {
    return current.year > latest.year ? current : latest;
  }, financials[0]);
  return latestFinancial?.netRevenue ?? 0;
}

// Renamed screen component
export default function CurrentClientScreen() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch total count for pagination - Filter by Available
  useEffect(() => {
    async function fetchTotal() {
      const db = getFirestore(app);
      const q = query(
        collection(db, "clients"),
        where("type", "==", ClientType.Available) // Filter by Available
      );
      const snapshot = await getDocs(q);
      setTotal(snapshot.size);
    }
    fetchTotal();
  }, []);

  // Fetch clients - Filter by Available
  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      const db = getFirestore(app);
      let q = query(
        collection(db, "clients"),
        where("type", "==", ClientType.Available), // Filter by Available
        orderBy("id"),
        limit(PAGE_SIZE)
      );

      if (search) {
        // Adjust search logic if needed for Available clients
        const allQ = query(
          collection(db, "clients"),
          where("type", "==", ClientType.Available)
        );
        const allSnap = await getDocs(allQ);
        const filtered = allSnap.docs
          .map((doc) => doc.data() as ClientModel)
          .filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.taxCode.toLowerCase().includes(search.toLowerCase())
          );
        setClients(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
        setTotal(filtered.length); // Update total based on search results
        setLastDoc(null); // Reset pagination for search
        setLoading(false);
        return;
      }

      // Reset total when search is cleared
      if (!search && total !== clients.length) {
        // Basic check, might need refinement
        async function fetchTotal() {
          const db = getFirestore(app);
          const q = query(
            collection(db, "clients"),
            where("type", "==", ClientType.Available)
          );
          const snapshot = await getDocs(q);
          setTotal(snapshot.size);
        }
        fetchTotal();
      }

      if (page > 1 && lastDoc && !search) {
        q = query(
          collection(db, "clients"),
          where("type", "==", ClientType.Available),
          orderBy("id"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      } else if (page === 1 && !search) {
        // Ensure first page query doesn't use startAfter
        q = query(
          collection(db, "clients"),
          where("type", "==", ClientType.Available),
          orderBy("id"),
          limit(PAGE_SIZE)
        );
      }

      // Don't run query again if searching (already handled above)
      if (!search) {
        const snapshot = await getDocs(q);
        setClients(snapshot.docs.map((doc) => doc.data() as ClientModel));
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      }

      setLoading(false);
    }
    fetchClients();
    // eslint-disable-next-line
  }, [page, search]); // Removed lastDoc dependency to avoid loops with search

  return (
    <div className="p-6 bg-white min-h-full">
      {/* Title can be updated if needed */}
      <h1 className="text-xl font-semibold mb-4">
        Danh mục khách hàng hiện hữu
      </h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Mã số thuế/ Tên KH/ Số CIF"
            className="border px-4 py-2 rounded-lg w-80 mr-2 text-black placeholder-gray-500"
            value={search}
            onChange={(e) => {
              const newSearch = e.target.value;
              setSearch(newSearch);
              setPage(1); // Reset to page 1 on search
              setLastDoc(null);
            }}
          />
          {/* Search button might not be needed if filtering on change */}
          {/* <button className="bg-[#ff6a00] text-white px-4 py-2 rounded-lg">Tìm kiếm</button> */}
        </div>
        <div>
          {/* Add client button might navigate to a different route or be removed */}
          <button
            className="bg-[#ff6a00] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
            onClick={() => router.push("/them-khach-hang")} // Or a different add route?
          >
            Thêm khách hàng
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-black">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="px-4 py-2 text-left text-black">Tên khách hàng</th>
              <th className="px-4 py-2 text-left text-black">MST</th>
              <th className="px-4 py-2 text-left text-black">Phân khúc</th>
              <th className="px-4 py-2 text-left text-black">
                Doanh thu (VND)
              </th>
              <th className="px-4 py-2 text-left text-black">
                Cán bộ tiếp cận
              </th>
              <th className="px-4 py-2 text-left text-black">Ngày thêm</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-black">
                  Đang tải...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-black">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b hover:bg-gray-50 cursor-pointer text-black"
                  // Navigate to a detail screen specific to available clients?
                  onClick={() =>
                    router.push(`/chi-tiet-khach-hang?id=${client.id}`)
                  }
                >
                  <td className="px-4 py-2 font-medium text-black">
                    {client.name}
                  </td>
                  <td className="px-4 py-2 text-black">{client.taxCode}</td>
                  <td className="px-4 py-2 text-black">{client.segment}</td>
                  <td className="px-4 py-2 text-black">
                    {getLatestNetRevenue(client.financials).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {getStaffName(client.staffId)}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {formatDate(client.addDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-black">
          {/* Show total count based on search or full list */}
          Hiển thị {clients.length} / {total} mục
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &lt;
          </button>
          <span>Trang {page}</span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            // Disable next based on total and current page/page size
            onClick={() => setPage((p) => p + 1)}
            disabled={page * PAGE_SIZE >= total}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
