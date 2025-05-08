import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/server/googleAuth"; // Adjusted path
import { dev } from "$app/environment";
import { logger } from "$lib/logger";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    
    // Ensure scopes are properly formatted and passed
    const scopes = ["openid", "email", "profile"];
    const url = await google.createAuthorizationURL(state, codeVerifier, scopes);

    logger.debug("Starting Google OAuth flow:", {
        state,
        hasCodeVerifier: !!codeVerifier,
        authorizationUrl: url.toString()
    });

    // Set cookies with consistent names
    event.cookies.set("google_oauth_state", state, {
        path: "/",
        secure: !dev, // use secure cookies in production
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax"
    });
    event.cookies.set("google_code_verifier", codeVerifier, {
        path: "/",
        secure: !dev, // use secure cookies in production
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax"
    });

    logger.debug("Set OAuth cookies:", {
        cookies: event.cookies.getAll().map(c => c.name)
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString()
        }
    });
} 