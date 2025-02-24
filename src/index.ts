import { handler } from './handler';
import express from 'express';
import { initializeDatabase } from './lib/server/db-init';

const app = express();
const port = process.env.PORT || 3000;

// Initialize database before starting the server
initializeDatabase()
    .then(() => {
        // Handle SvelteKit routes
        app.use(handler);

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    }); 