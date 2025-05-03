export interface Feature {
    title: string;
    description: string;
    icon?: string;
}

export interface PageData {
    features: Feature[];
    meta: {
        title: string;
        description: string;
        severity?: number;
    };
    databaseStatus: 'working' | 'failed';
    users: Array<{
        id: string;
        email: string;
        role: string;
    }>;
    userMessage: string;
    user?: {
        id: number;
        email: string;
        role: string;
        first_name: string;
        last_name: string;
        email_verified: boolean;
    } | null;
}

export interface Brand {
    id: number;
    name: string;
    display_name: string;
    url: string | null;
    description: string | null;
    status: 'active' | 'inactive';
    trademarked_terms?: {
        id: number;
        term: string;
    }[];
    users?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    }[];
    marketplaces?: {
        id: number;
        name: string;
        url: string;
    }[];
}

export interface User {
    id: number;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'admin';
    first_name: string;
    last_name: string;
    email_verified: boolean;
} 