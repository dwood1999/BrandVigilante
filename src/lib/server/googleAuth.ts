import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { logger } from "$lib/logger";

// IMPORTANT: Make sure your redirect URI matches EXACTLY what you configured in Google Cloud Console
// Always use HTTPS for OAuth redirects
const redirectURI = "https://dwood.janusipm.com/login/google/callback";

// Log configuration for debugging
logger.debug('Google OAuth Configuration:', {
    clientId: GOOGLE_CLIENT_ID ? 'Set' : 'Not Set',
    clientSecret: GOOGLE_CLIENT_SECRET ? 'Set' : 'Not Set',
    redirectURI
});

// Create Google OAuth instance with error handling
let google: Google;
try {
    google = new Google(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        redirectURI
    );
    logger.debug('Google OAuth instance created successfully');
} catch (error) {
    logger.error('Failed to create Google OAuth instance:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
}

export { google }; 