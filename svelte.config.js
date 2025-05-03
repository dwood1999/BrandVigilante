import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Set NODE_ENV for the build process
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const dev = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({ out: "build"}),
			//precompress: true }),
		csrf: {
			checkOrigin: false // Disable CSRF checks completely for development
		},
		alias: {
			$lib: './src/lib',
			'$lib/*': './src/lib/*'
		}
	}
};

export default config;
