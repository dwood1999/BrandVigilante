export interface DashboardUser {
    id: number;
    email: string;
    phone: string;
    role: string;
    created_at: string;
    initials: string;
    lastLogin: string;
}

export interface PageData {
    user: DashboardUser;
} 