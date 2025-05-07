import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit(), tailwindcss()],
		server: {
			host: true,
			port: 5173,
			strictPort: true,
			https: process.env.NODE_ENV === 'production' ? {} : false,
			headers: {
				'X-Frame-Options': 'DENY',
				'X-Content-Type-Options': 'nosniff',
				'Referrer-Policy': 'strict-origin-when-cross-origin'
			},
			allowedHosts: [
				'dwood.janusipm.com',
				'localhost',
				'127.0.0.1',
				'.janusipm.com'
			],
			proxy: {
				// Add any proxy configurations if needed
			},
			fs: {
				allow: ['.']
			}
		},
		// Make env variables available to the app
		define: {
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.VITE_APP_URL': JSON.stringify(process.env.VITE_APP_URL),
			'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
		},
		test: {
			workspace: [
				{
					extends: './vite.config.ts',
					plugins: [svelteTesting()],

					test: {
						name: 'client',
						environment: 'jsdom',
						clearMocks: true,
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
						setupFiles: ['./vitest-setup-client.ts']
					}
				},
				{
					extends: './vite.config.ts',

					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		},
		build: {
			target: 'esnext',
			sourcemap: process.env.NODE_ENV !== 'production',
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ['svelte', '@sveltejs/kit']
					}
				}
			}
		},
		resolve: {
			alias: {
				$lib: '/src/lib'
			}
		}
	};
});
