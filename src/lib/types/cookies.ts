export interface CookieConsent {
	necessary: boolean;
	analytics: boolean;
	marketing: boolean;
	preferences: boolean;
}

export type CookieCategory = keyof CookieConsent; 