// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			status: number;
			message: string;
			stack?: string;
		}

		interface Locals {
			user: {
				id: number;
				email: string;
				role: string;
				first_name: string;
				last_name: string;
			} | null;
		}

		interface PageData {
			databaseStatus: 'working' | 'failed';
			features: Array<{
				title: string;
				description: string;
				icon?: string;
			}>;
			users: Array<{
				id: string;
				email: string;
				role: string;
			}>;
			userMessage: string;
			meta: {
				title: string;
				description: string;
			};
			user: {
				id: number;
				email: string;
				role: string;
				first_name: string;
				last_name: string;
			} | null;
		}

		interface Platform {
			env: {
				DATABASE_URL: string;
				NODE_ENV: string;
			};
		}
	}
}

export {};
