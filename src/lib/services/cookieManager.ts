import { browser } from '$app/environment';
import type { CookieConsent } from '$lib/types/cookies';

// Cookie expiration times (in days)
const EXPIRATION = {
	necessary: 365,
	analytics: 30,
	marketing: 30,
	preferences: 30
};

// Cookie names by category
const COOKIES = {
	necessary: ['session', 'csrf'],
	analytics: ['_ga', '_gid', '_gat'],
	marketing: ['_fbp', '_fb'],
	preferences: ['theme', 'language']
};

/**
 * Set a cookie with the given name, value, and expiration
 */
function setCookie(name: string, value: string, days: number): void {
	if (!browser) return;

	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `expires=${date.toUTCString()}`;
	document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
	if (!browser) return null;

	const nameEQ = `${name}=`;
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
 * Delete a cookie by name
 */
function deleteCookie(name: string): void {
	if (!browser) return;

	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Apply cookie consent settings
 */
export function applyCookieConsent(consent: CookieConsent): void {
	if (!browser) return;

	// Handle necessary cookies
	COOKIES.necessary.forEach((cookie) => {
		if (getCookie(cookie)) return; // Don't overwrite existing necessary cookies
		setCookie(cookie, 'true', EXPIRATION.necessary);
	});

	// Handle analytics cookies
	COOKIES.analytics.forEach((cookie) => {
		if (consent.analytics) {
			// Initialize analytics cookies if consent is given
			if (!getCookie(cookie)) {
				setCookie(cookie, 'true', EXPIRATION.analytics);
			}
		} else {
			// Remove analytics cookies if consent is withdrawn
			deleteCookie(cookie);
		}
	});

	// Handle marketing cookies
	COOKIES.marketing.forEach((cookie) => {
		if (consent.marketing) {
			// Initialize marketing cookies if consent is given
			if (!getCookie(cookie)) {
				setCookie(cookie, 'true', EXPIRATION.marketing);
			}
		} else {
			// Remove marketing cookies if consent is withdrawn
			deleteCookie(cookie);
		}
	});

	// Handle preference cookies
	COOKIES.preferences.forEach((cookie) => {
		if (consent.preferences) {
			// Keep existing preference cookies if consent is given
			if (!getCookie(cookie)) {
				setCookie(cookie, 'true', EXPIRATION.preferences);
			}
		} else {
			// Remove preference cookies if consent is withdrawn
			deleteCookie(cookie);
		}
	});

	// Initialize analytics if consent is given
	if (consent.analytics) {
		initializeAnalytics();
	}

	// Initialize marketing if consent is given
	if (consent.marketing) {
		initializeMarketing();
	}
}

/**
 * Initialize analytics tracking
 */
function initializeAnalytics(): void {
	if (!browser) return;

	// Add Google Analytics initialization here
	// Example:
	// window.dataLayer = window.dataLayer || [];
	// function gtag(...args) {
	//     window.dataLayer.push(arguments);
	// }
	// gtag('js', new Date());
	// gtag('config', 'YOUR-GA-ID');
}

/**
 * Initialize marketing tracking
 */
function initializeMarketing(): void {
	if (!browser) return;

	// Add Facebook Pixel or other marketing tracking initialization here
	// Example:
	// !function(f,b,e,v,n,t,s)
	// {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	// n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	// if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	// n.queue=[];t=b.createElement(e);t.async=!0;
	// t.src=v;s=b.getElementsByTagName(e)[0];
	// s.parentNode.insertBefore(t,s)}(window, document,'script',
	// 'https://connect.facebook.net/en_US/fbevents.js');
	// fbq('init', 'YOUR-PIXEL-ID');
}

/**
 * Get all current cookies
 */
export function getAllCookies(): Record<string, string> {
	if (!browser) return {};

	const cookies: Record<string, string> = {};
	document.cookie.split(';').forEach((cookie) => {
		const [name, value] = cookie.trim().split('=');
		cookies[name] = value;
	});
	return cookies;
}

/**
 * Clear all non-necessary cookies
 */
export function clearNonNecessaryCookies(): void {
	if (!browser) return;

	Object.values(COOKIES)
		.flat()
		.filter((cookie) => !COOKIES.necessary.includes(cookie))
		.forEach(deleteCookie);
} 