// ClientModel.ts

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../utils/FirebaseApp";

// Loại hình doanh nghiệp
export enum BusinessType {
    JointStock = "Công ty cổ phần",
    Limited = "Công ty TNHH",
    JointVenture = "Công ty liên danh",
    Affiliate = "Công ty liên kết",
}

// Phân khúc khách hàng
export enum CustomerSegment {
    SME_Manufacturing = "SME Sản xuất",
    Trading = "Thương Mại",
    Construction = "Xây dựng",
    Other = "Khác",
}

// Loại khách hàng
export enum ClientType {
    SaleLead = "sale_lead", // Khách hàng tiềm năng
    Available = "available", // Khách hàng hiện hữu
}

export interface YearlyFinancials {
    year: number;
    netRevenue: number; // Doanh thu thuần
    netProfit: number; // Lợi nhuận sau thuế
    financialRevenue: number; // Doanh thu tài chính
    financialCost: number; // Chi phí tài chính
    shortTermDebt: number; // Vay và nợ ngắn hạn
    longTermDebt: number; // Vay và nợ dài hạn
}

export interface ClientModel {
    id: string; // Tax Code
    type: ClientType;

    // Thông tin định danh
    name: string;
    taxCode: string;
    companyPhone: string;
    companyEmail: string;
    province: string;
    district: string;
    address: string;
    businessType: BusinessType;

    // Thông tin liên hệ (Consider making this an array for multiple contacts)
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    contactTitle: string;

    // Thông tin tài chính
    segment: CustomerSegment;
    financials: YearlyFinancials[]; // Array for up to 3 years

    // Only for available clients
    productId?: string;

    // Meta fields
    staffId: string;
    addDate: string; // ISO string
}

// Factory function (Update financials)
export function clientFactory(type: ClientType = ClientType.SaleLead): ClientModel {
    const currentYear = new Date().getFullYear();
    const base = {
        id: "0101234567",
        type,
        name: "Công ty TNHH ABC Việt Nam",
        taxCode: "0101234567",
        companyPhone: "024-1234-5678",
        companyEmail: "contact@abc.com.vn",
        province: "Hà Nội",
        district: "Quận Cầu Giấy",
        address: "Tầng 5, Tòa nhà Gold Measuring, 223 Đường Trần Duy Hưng",
        businessType: BusinessType.Limited,
        contactName: "Nguyễn Văn An",
        contactPhone: "0901234567",
        contactEmail: "nvan598@outlook.com",
        contactTitle: "Giám đốc",
        segment: CustomerSegment.SME_Manufacturing,
        financials: [
            { // Mock data for one year
                year: currentYear - 1,
                netRevenue: 50000000000,
                netProfit: 3500000000,
                financialRevenue: 200000000,
                financialCost: 150000000,
                shortTermDebt: 1000000000,
                longTermDebt: 2000000000,
            },
        ],
        staffId: "1",
        addDate: new Date().toISOString(),
    };
    if (type === ClientType.Available) {
        return {
            ...base,
            productId: "product-001",
        };
    }
    return base;
}

// Add a client to Firestore using taxCode as the document id
export async function addClientToFirestore(client: ClientModel): Promise<{ success: boolean; error?: string }> {
    const db = getFirestore(app);
    const clientRef = doc(db, "clients", client.id);
    const existing = await getDoc(clientRef);
    if (existing.exists()) {
        return { success: false, error: "Duplicate tax number (id)" };
    }
    await setDoc(clientRef, client);
    return { success: true };
}

// Add a mock client to Firestore using clientFactory
export async function addMockClientToFirestore(type: ClientType = ClientType.SaleLead) {
    const client = clientFactory(type);
    return await addClientToFirestore(client);
} 