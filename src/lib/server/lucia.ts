import { Lucia, TimeSpan } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import { pool } from "$lib/db";
import { dev } from "$app/environment";

interface DatabaseUserAttributes {
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    email_verified: boolean;
}

export const auth = new Lucia(
    new Mysql2Adapter(pool, {
        user: "users",
        session: "user_session"
    }),
    {
        sessionExpiresIn: new TimeSpan(30, "d"),
        sessionCookie: {
            expires: false
        },
        getUserAttributes: (attributes) => {
            return {
                email: attributes.email,
                role: attributes.role,
                first_name: attributes.first_name,
                last_name: attributes.last_name,
                email_verified: attributes.email_verified
            };
        }
    }
);

declare module "lucia" {
    interface Register {
        Lucia: typeof auth;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

export type Auth = typeof auth; 