export enum TaskType {
    CallClient = "Gọi điện khách hàng",
    MeetClient = "Gặp khách hàng",
    CollectDocs = "Thu hồ sơ",
    AppraiseDocs = "Định giá hồ sơ",
    SubmitDocs = "Trình hồ sơ",
    ApproveDocs = "Duyệt hồ sơ",
}

export enum TaskState {
    InProgress = "Đang làm",
    Completed = "Đã hoàn thành",
    Overdue = "Quá hạn",
}

export type TaskPriority = 1 | 2 | 3;

export interface TaskModel {
    id: string; // Unique identifier for the task
    type: TaskType;
    staffId: string; // ID of the assigned staff member
    deadline: string; // ISO Date string (e.g., "YYYY-MM-DD")
    state: TaskState;
    priority: TaskPriority; // 1 (High), 2 (Medium), 3 (Low) - assuming lower number is higher priority
    // Optional: Add related entity IDs if needed
    // clientId?: string;
    productId?: string; // Link to the product/opportunity
    createdDate?: string; // ISO Date string for when the task was created
} 