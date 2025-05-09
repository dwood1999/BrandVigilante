import { redirect } from "@sveltejs/kit";
import { google } from "$lib/server/googleAuth";
import { auth } from "$lib/server/lucia";
import { UserModel } from "$lib/models/user";
import { dev } from "$app/environment";
import { generateId } from "lucia";
import { logger } from "$lib/logger";
import { pool } from "$lib/db";
import type { RowDataPacket } from "mysql2";

// Create a direct debug log for the console
function debugLog(message: string, data?: any) {
    console.log(`DEBUG [${new Date().toISOString()}]: ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

export const GET = async ({ url, cookies, request }) => {
    debugLog("GOOGLE CALLBACK: Starting function");
    
    // Log request headers
    const requestHeaders = Object.fromEntries(request.headers.entries());
    debugLog("REQUEST HEADERS:", requestHeaders);
    
    // Log all cookies
    const allCookies = cookies.getAll();
    debugLog("ALL COOKIES:", allCookies);
    
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const codeVerifier = cookies.get("google_code_verifier");
    const storedState = cookies.get("google_oauth_state");

    logger.debug("=== GOOGLE OAUTH CALLBACK START ===", {
        hasCode: !!code,
        hasState: !!state,
        hasCodeVerifier: !!codeVerifier,
        hasStoredState: !!storedState
    });
    
    debugLog("OAUTH PARAMETERS", {
        code: code ? code.substring(0, 10) + "..." : null,
        state,
        codeVerifier: codeVerifier ? codeVerifier.substring(0, 10) + "..." : null,
        storedState
    });

    if (!code || !state || !codeVerifier) {
        debugLog("MISSING PARAMS: Redirecting to login");
        return redirect(303, "/login?error=missing_params");
    }

    if (state !== storedState) {
        debugLog("STATE MISMATCH: Redirecting to login");
        return redirect(303, "/login?error=invalid_state");
    }

    try {
        debugLog("VALIDATING AUTHORIZATION CODE");
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);
        debugLog("AUTHORIZATION CODE VALIDATED");
        
        debugLog("GETTING ACCESS TOKEN");
        const accessToken = await tokens.accessToken();
        debugLog("ACCESS TOKEN RECEIVED", { tokenLength: accessToken.length });
        
        debugLog("FETCHING USER INFO FROM GOOGLE");
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        debugLog("USER INFO RESPONSE", { status: response.status });
        
        if (!response.ok) {
            debugLog("GOOGLE API ERROR", { status: response.status });
            return redirect(303, "/login?error=google_api_error");
        }
        
        const googleUser = await response.json();
        debugLog("GOOGLE USER INFO", { 
            email: googleUser.email,
            sub: googleUser.sub,
            hasName: !!googleUser.name
        });
        
        // Check if user exists
        logger.debug("=== CHECKING IF USER EXISTS ===", { 
            googleId: googleUser.sub,
            email: googleUser.email
        });
        
        debugLog("CHECKING FOR EXISTING USER BY GOOGLE ID");
        let user = await UserModel.findByGoogleId(googleUser.sub)
            .catch((err) => {
                debugLog("ERROR FINDING USER BY GOOGLE ID", { error: String(err) });
                return null;
            });
            
        if (!user) {
            debugLog("USER NOT FOUND BY GOOGLE ID, CHECKING EMAIL");
            try {
                user = await UserModel.findByEmail(googleUser.email);
                
                if (user) {
                    debugLog("USER FOUND BY EMAIL, UPDATING GOOGLE ID");
                    // Update existing user with Google ID
                    if (user.id) {
                        await UserModel.update(user.id, {
                            google_user_id: googleUser.sub,
                            email_verified: true // Since they verified with Google
                        });
                        debugLog("UPDATED USER WITH GOOGLE ID", { userId: user.id });
                    } else {
                        debugLog("USER ID IS UNDEFINED, CANNOT UPDATE");
                        return redirect(303, "/login?error=invalid_user");
                    }
                } else {
                    debugLog("NO USER FOUND, CREATING NEW USER");
                    // Create new user
                    user = await UserModel.create({
                        email: googleUser.email,
                        first_name: googleUser.given_name || "",
                        last_name: googleUser.family_name || "",
                        role: "user",
                        email_verified: true, // Since they verified with Google
                        google_user_id: googleUser.sub,
                        password: ""
                    });
                    debugLog("NEW USER CREATED", { userId: user.id });
                }
            } catch (error) {
                debugLog("ERROR IN USER LOOKUP/CREATION", { error: String(error) });
                return redirect(303, "/login?error=user_creation_failed");
            }
        } else {
            debugLog("USER FOUND BY GOOGLE ID", { userId: user.id });
        }
        
        if (!user?.id) {
            debugLog("NO USER ID, REDIRECTING TO LOGIN");
            return redirect(303, "/login?error=user_creation_failed");
        }
        
        // Convert user ID to string
        const userId = String(user.id);
        logger.debug("=== CREATING SESSION ===", { userId });
        debugLog("CREATING SESSION", { userId });
        
        try {
            debugLog("CALLING auth.createSession");
            // Simple session creation with only the user ID
            const session = await auth.createSession(userId, {}, {});
            logger.debug("=== SESSION CREATED ===", { 
                sessionId: session.id,
                userId: session.userId
            });
            debugLog("SESSION CREATED", { 
                sessionId: session.id,
                userId: session.userId,
                expiresAt: session.expiresAt,
                sessionObject: JSON.stringify(session)
            });
            
            // Verify session in database
            debugLog("VERIFYING SESSION IN DATABASE");
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM user_session WHERE id = ?',
                [session.id]
            );
            
            logger.debug("=== SESSION IN DATABASE ===", {
                found: rows.length > 0,
                rowData: rows[0]
            });
            debugLog("SESSION IN DATABASE", {
                found: rows.length > 0,
                sessionData: rows.length > 0 ? rows[0] : null
            });
            
            // Set session cookie
            debugLog("CREATING SESSION COOKIE");
            const sessionCookie = auth.createSessionCookie(session.id);
            debugLog("SESSION COOKIE CREATED", { 
                name: sessionCookie.name,
                valueLength: sessionCookie.value.length,
                attributes: sessionCookie.attributes
            });
            
            debugLog("SETTING SESSION COOKIE");
            cookies.set(sessionCookie.name, sessionCookie.value, {
                path: "/",
                ...sessionCookie.attributes
            });
            debugLog("SESSION COOKIE SET");
            
            // Check if cookie was set
            const cookieCheck = cookies.get(sessionCookie.name);
            debugLog("SESSION COOKIE CHECK", { 
                name: sessionCookie.name,
                exists: !!cookieCheck,
                valueLength: cookieCheck?.length
            });
            
            // Delete OAuth cookies
            debugLog("DELETING OAUTH COOKIES");
            cookies.delete("google_code_verifier", { path: "/" });
            cookies.delete("google_oauth_state", { path: "/" });
            debugLog("OAUTH COOKIES DELETED");
            
            // Prepare redirect response
            debugLog("CREATING AND RETURNING REDIRECT RESPONSE");
            
            // Just create and return the redirect response
            // No try/catch needed - this won't throw
            return redirect(303, "/dashboard");
        } catch (error) {
            // Log detailed error info for session creation errors
            const errorObj = error as any;
            
            debugLog("INNER CATCH BLOCK - ERROR OBJECT INSPECTION", {
                error: String(errorObj),
                type: typeof errorObj,
                constructorName: errorObj?.constructor?.name,
                isErrorInstance: errorObj instanceof Error,
                isSvelteKitRedirect: errorObj?.constructor?.name === 'Redirect',
                status: errorObj?.status,
                location: errorObj?.location, // Check for location directly
                message: errorObj?.message,
                stack: errorObj?.stack,
                headers: errorObj?.headers ? Object.fromEntries(errorObj.headers.entries()) : null,
                keys: Object.keys(errorObj || {}),
                fullErrorString: JSON.stringify(errorObj, Object.getOwnPropertyNames(errorObj || {}), 2)
            });

            // Check for SvelteKit redirect object structure
            if (errorObj?.constructor?.name === 'Redirect' && errorObj.status === 303 && errorObj.location) {
                debugLog("INNER CATCH - SVELTEKIT REDIRECT OBJECT DETECTED (NOT AN ERROR) - CREATING NEW RESPONSE", {
                    status: errorObj.status,
                    location: errorObj.location
                });
                // MUST return a new Response object from a catch block
                return new Response(null, {
                    status: errorObj.status,
                    headers: { Location: errorObj.location }
                });
            }
            
            logger.error("=== SESSION CREATION ERROR ===", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            
            // Log detailed error info
            debugLog("INNER CATCH - SESSION CREATION ERROR (ACTUAL ERROR)", { 
                error: error instanceof Error ? error.message : String(error),
                errorType: error instanceof Error ? error.constructor.name : typeof error,
                stack: error instanceof Error ? error.stack : undefined
            });
            
            // Redirect to login with error
            debugLog("INNER CATCH - REDIRECTING TO LOGIN DUE TO SESSION CREATION ERROR");
            return redirect(303, "/login?error=session_creation_failed");
        }
    } catch (error) {
        // Only handle actual errors here, not redirects
        const errorObj = error as any;

        debugLog("OUTER CATCH BLOCK - ERROR OBJECT INSPECTION", {
            error: String(errorObj),
            type: typeof errorObj,
            constructorName: errorObj?.constructor?.name,
            isErrorInstance: errorObj instanceof Error,
            isSvelteKitRedirect: errorObj?.constructor?.name === 'Redirect',
            status: errorObj?.status,
            location: errorObj?.location, // Check for location directly
            message: errorObj?.message,
            stack: errorObj?.stack,
            headers: errorObj?.headers ? Object.fromEntries(errorObj.headers.entries()) : null,
            keys: Object.keys(errorObj || {}),
            fullErrorString: JSON.stringify(errorObj, Object.getOwnPropertyNames(errorObj || {}), 2)
        });

        // Check for SvelteKit redirect object structure
        if (errorObj?.constructor?.name === 'Redirect' && errorObj.status === 303 && errorObj.location) {
            debugLog("OUTER CATCH - SVELTEKIT REDIRECT OBJECT DETECTED - CREATING NEW RESPONSE", {
                status: errorObj.status,
                location: errorObj.location
            });
            // MUST return a new Response object from a catch block
            return new Response(null, {
                status: errorObj.status,
                headers: { Location: errorObj.location }
            });
        }
        
        // Log the actual error
        logger.error("=== OAUTH FLOW ERROR ===", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        
        debugLog("OUTER CATCH - OAUTH FLOW ERROR (ACTUAL ERROR)", {
            error: error instanceof Error ? error.message : String(error),
            errorType: error instanceof Error ? error.constructor.name : typeof error,
            stack: error instanceof Error ? error.stack : undefined
        });
        
        // Redirect to login with error
        debugLog("OUTER CATCH - REDIRECTING TO LOGIN DUE TO OAUTH FLOW ERROR");
        return redirect(303, "/login?error=oauth_flow_failed");
    }
}; 