import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../utils/FirebaseApp";

export enum SalesProcess {
    Normal = "Quy trình bán thường",
    Automated = "Quy trình bán tự động",
}

export enum ProductName {
    SMEHook = "SME Hook",
    SMEMain = "SME Main",
}

export enum SaleStatus {
    Allocated = "Được phân bổ",
    Called = "Đã Gọi",
    Met = "Đã Gặp",
    DocsCollected = "Thu hồ sơ",
    Valuated = "Định giá",
    Submitted = "Trình",
    Approved = "Phê Duyệt",
    Closed = "Đóng cơ hội bán",
}

export interface ProductModel {
    id: string; // Client's Tax Code / Business Registration No.
    salesProcess: SalesProcess;
    productName: ProductName;
    expectedCloseDate: string; // ISO Date string (e.g., "YYYY-MM-DD" or full ISO string)
    dealValue: number;
    clientId: string; // To explicitly link back to ClientModel.id
    status: SaleStatus; // Add status using the new enum
    assignedStaffId: string; // Add assigned staff ID
    createdDate: string; // ISO Date string for creation date
}

// Add a product (Sale Chance) to Firestore
export async function addProductToFirestore(product: ProductModel): Promise<{ success: boolean; error?: string }> {
    const db = getFirestore(app);
    // Using the pre-generated ID from AddProductScreen
    const productRef = doc(db, "products", product.id);
    try {
        // We use setDoc because the ID is generated client-side in AddProductScreen
        // If we wanted Firestore to generate the ID, we'd use addDoc with collection(db, "products")
        await setDoc(productRef, product);
        return { success: true };
    } catch (error: any) {
        console.error("Error adding product to Firestore:", error);
        return { success: false, error: error.message || "An unknown error occurred" };
    }
} 