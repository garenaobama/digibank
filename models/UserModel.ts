export interface UserModel {
    id: string;
    name: string;
    username: string;
    password: string;
    email?: string;
}

// Simple user repository (MVP, hardcoded)
const users: UserModel[] = [
    {
        id: "1",
        name: "Bach Tran",
        username: "bach_tran_01",
        password: "12345678",
    },
];

// Login function: returns user if credentials match, else null
export function login(username: string, password: string): UserModel | null {
    return users.find(
        (u) => u.username === username && u.password === password
    ) || null;
} 