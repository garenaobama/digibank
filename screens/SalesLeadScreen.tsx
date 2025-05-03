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
import { ClientType, ClientModel } from "../models/ClientModel";
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

export default function SalesLeadScreen() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch total count for pagination
  useEffect(() => {
    async function fetchTotal() {
      const db = getFirestore(app);
      const q = query(
        collection(db, "clients"),
        where("type", "==", ClientType.SaleLead)
      );
      const snapshot = await getDocs(q);
      setTotal(snapshot.size);
    }
    fetchTotal();
  }, []);

  // Fetch clients
  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      const db = getFirestore(app);
      let q = query(
        collection(db, "clients"),
        where("type", "==", ClientType.SaleLead),
        orderBy("id"),
        limit(PAGE_SIZE)
      );
      if (search) {
        // Search by name or taxCode (case-insensitive)
        // Firestore doesn't support OR, so filter after fetch
        const allQ = query(
          collection(db, "clients"),
          where("type", "==", ClientType.SaleLead)
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
        setLoading(false);
        return;
      }
      if (page > 1 && lastDoc) {
        q = query(
          collection(db, "clients"),
          where("type", "==", ClientType.SaleLead),
          orderBy("id"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }
      const snapshot = await getDocs(q);
      setClients(snapshot.docs.map((doc) => doc.data() as ClientModel));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
    }
    fetchClients();
    // eslint-disable-next-line
  }, [page, search]);

  return (
    <div className="p-6 bg-white min-h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Mã số thuế/ Tên KH/ Số CIF"
            className="border px-4 py-2 rounded-lg w-80 mr-2 text-black placeholder-black"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button className="bg-[#ff6a00] text-white px-4 py-2 rounded-lg">
            Tìm kiếm
          </button>
        </div>
        <div>
          <button
            className="bg-[#ff6a00] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
            onClick={() => router.push("/them-khach-hang")}
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
              <th className="px-4 py-2 text-left text-black">Ngày phân bổ</th>
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
                  className="border-b hover:bg-gray-50 text-black"
                >
                  <td className="px-4 py-2 font-medium text-black">
                    {client.name}
                  </td>
                  <td className="px-4 py-2 text-black">{client.taxCode}</td>
                  <td className="px-4 py-2 text-black">{client.segment}</td>
                  <td className="px-4 py-2 text-black">
                    {client.netRevenue.toLocaleString()}
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
            onClick={() => setPage((p) => p + 1)}
            disabled={clients.length < PAGE_SIZE}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
