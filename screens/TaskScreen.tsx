"use client";

import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query, // Import query
  orderBy, // Import orderBy
  doc, // Import doc
  updateDoc, // Import updateDoc
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { app } from "@/utils/FirebaseApp";
import {
  TaskModel,
  TaskState,
  TaskPriority,
  TaskType,
} from "@/models/TaskModel";
import { FaPlus } from "react-icons/fa";
import { LuUpload } from "react-icons/lu"; // Import upload icon
import toast, { Toaster } from "react-hot-toast"; // Import toast
import ChangeTaskStatusModal from "@/components/modals/ChangeTaskStatusModal"; // Import the new modal component

// Helper function to format deadline (adjust as needed)
const formatDeadline = (isoString: string) => {
  try {
    const date = new Date(isoString);
    // Example: 19/02/2025 - 10:00 (Customize format as required)
    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} - ${formattedTime}`;
  } catch (e) {
    return isoString; // Fallback to original string if date is invalid
  }
};

// Helper function to get TaskState color
const getStateColor = (state: TaskState) => {
  switch (state) {
    case TaskState.Completed:
      return "bg-green-100 text-green-700";
    case TaskState.Overdue:
      return "bg-red-100 text-red-700";
    case TaskState.InProgress:
    default:
      return "bg-blue-100 text-blue-700";
  }
};

// Helper function to display priority
const displayPriority = (priority: TaskPriority) => {
  // Simple visualization - replace with icons or bars if needed
  if (priority === 1)
    return <span className="text-red-500 font-bold">!!!</span>;
  if (priority === 2)
    return <span className="text-yellow-500 font-bold">!!</span>;
  return <span className="text-gray-500 font-bold">!</span>;
};

const TaskScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Change Status Modal
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);
  const [newStatus, setNewStatus] = useState<TaskState | null>(null);
  const [isUpdatingTaskStatus, setIsUpdatingTaskStatus] = useState(false);
  const [updateTaskError, setUpdateTaskError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore(app);
      // Query tasks, order by deadline for example
      const tasksQuery = query(collection(db, "tasks"), orderBy("deadline"));

      try {
        const taskSnapshot: QuerySnapshot<DocumentData> = await getDocs(
          tasksQuery
        );
        const taskList: TaskModel[] = taskSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as TaskModel)
        );
        setTasks(taskList);
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // --- Update Task Status --- (New Function)
  const handleUpdateTaskStatus = async () => {
    if (!selectedTask || !newStatus) {
      setUpdateTaskError("Task or new status is missing.");
      return;
    }

    setIsUpdatingTaskStatus(true);
    setUpdateTaskError(null);
    const db = getFirestore(app);
    const taskRef = doc(db, "tasks", selectedTask.id);

    try {
      await updateDoc(taskRef, {
        state: newStatus,
      });
      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, state: newStatus } : task
        )
      );
      toast.success("Trạng thái công việc đã được cập nhật!");
      setIsChangeStatusModalOpen(false);
      setSelectedTask(null);
      setNewStatus(null);
    } catch (err: any) {
      console.error("Error updating task status:", err);
      const message = err.message || "Failed to update task status.";
      setUpdateTaskError(message);
      toast.error(message);
    } finally {
      setIsUpdatingTaskStatus(false);
    }
  };

  // --- Open Change Status Modal --- (New Function)
  const openChangeStatusModal = (task: TaskModel) => {
    setSelectedTask(task);
    setNewStatus(task.state); // Pre-fill modal with current status
    setIsChangeStatusModalOpen(true);
    setUpdateTaskError(null); // Clear previous errors
  };

  // --- UI Rendering ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Ensure Toaster is present */}
      {/* Header & Top Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Công việc</h1>
        <div className="space-x-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded inline-flex items-center text-sm">
            <FaPlus className="mr-2" />
            Thêm Công việc
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow inline-flex items-center text-sm">
            <LuUpload className="mr-2" />
            Nhập từ file
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            href="#"
            className="border-orange-500 text-orange-600 whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm"
          >
            Tất cả
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm"
          >
            Sắp tới
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm"
          >
            Quá hạn
          </a>
        </nav>
      </div>
      {/* Task Table Area */}
      <div className="bg-white shadow rounded-md overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading tasks...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">Error: {error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">
                  Danh sách
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng/CHB
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người được giao
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời hạn hoàn thành
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ưu tiên
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openChangeStatusModal(task)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* Add icon based on type? */}
                      📞 {task.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Placeholder - Needs related Client/Product data */}
                      {task.productId ? `${task.productId}` : "N/A"}{" "}
                      {/* Show product ID if available */}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.staffId}{" "}
                      {/* Placeholder - Needs staff name mapping */}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDeadline(task.deadline)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(
                          task.state
                        )}`}
                      >
                        {task.state}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {displayPriority(task.priority)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination Placeholder */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          <select className="border border-gray-300 rounded p-1 mr-2">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          bản ghi/trang
        </div>
        <div>
          Hiển thị {tasks.length}/{tasks.length} mục
        </div>{" "}
        {/* Update with actual pagination logic later */}
      </div>
      {/* Render Change Status Modal */}
      <ChangeTaskStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        onSubmit={handleUpdateTaskStatus}
        task={selectedTask}
        currentNewStatus={newStatus}
        setNewStatusHandler={setNewStatus}
        isLoading={isUpdatingTaskStatus}
        errorMsg={updateTaskError}
      />
    </div>
  );
};

export default TaskScreen;
