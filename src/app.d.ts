// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: number;
				email: string;
				role: string;
				first_name: string;
				last_name: string;
				email_verified: boolean;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
