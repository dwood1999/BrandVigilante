import type { Brand } from '$lib/models/brand';
import type { TrademarkTerm } from '$lib/models/trademarkTerm';

export interface UserRow {
    id: number;
    email: string;
    phone: string | null;
    role: 'admin' | 'user';
    first_name: string;
    last_name: string;
    created_at: string | Date;
    email_verified: boolean;
}

export interface Marketplace {
    marketplace_id: number;
    name: string;
    url: string;
    status: 'active' | 'inactive';
}

export interface BrandMarketplace {
    id: number;
    name: string;
    url: string;
    status: string;
    created_at: string;
}

export interface PageData {
    brand: Brand;
    terms: TrademarkTerm[];
    users: UserRow[];
    availableUsers: UserRow[];
    brandMarketplaces: BrandMarketplace[];
    allMarketplaces: Marketplace[];
} 