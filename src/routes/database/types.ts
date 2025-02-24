export interface User {
    id: number;
    email: string;
    phone: string;
    role: string;
    created_at: string;
}

export interface PageData {
    users: User[];
    userMessage: string;
    databaseStatus: 'working' | 'failed';
} 