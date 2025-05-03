import React from "react";
import { TaskModel, TaskState } from "@/models/TaskModel";

interface ChangeTaskStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task: TaskModel | null;
  currentNewStatus: TaskState | null;
  setNewStatusHandler: (status: TaskState) => void;
  isLoading: boolean;
  errorMsg: string | null;
}

const ChangeTaskStatusModal: React.FC<ChangeTaskStatusModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  currentNewStatus,
  setNewStatusHandler,
  isLoading,
  errorMsg,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-gray-900">
        <h3 className="text-lg font-medium mb-4">
          Thay đổi trạng thái công việc
        </h3>
        <p className="mb-2 text-sm">
          Công việc: <span className="font-medium">{task.type}</span>
        </p>
        <div className="mb-4">
          <label
            htmlFor="taskStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Trạng thái mới
          </label>
          <select
            id="taskStatus"
            name="taskStatus"
            value={currentNewStatus || ""}
            onChange={(e) => setNewStatusHandler(e.target.value as TaskState)}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {Object.values(TaskState).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {errorMsg && (
          <p className="mb-4 text-sm text-red-600">Error: {errorMsg}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || currentNewStatus === task.state}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang cập nhật..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeTaskStatusModal;
