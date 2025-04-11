export interface Feature {
    title: string;
    description: string;
}

export interface PageData {
    features: Feature[];
    meta: {
        title: string;
        description: string;
    };
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