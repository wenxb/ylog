import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import GitLab from "next-auth/providers/gitlab"
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import {Accounts, Authenticators, Users, VerificationTokens} from "@/lib/db/schema"
import {db} from "@/lib/db"
import {eq} from "drizzle-orm"
import {getAdminUser} from "@/utils/server"
import {COOKIE_NAME} from "@/lib/constant"

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
        GitHub({
            allowDangerousEmailAccountLinking: true,
        }),
        GitLab({
            allowDangerousEmailAccountLinking: true,
        }),
        Google,
    ],
    events: {
        createUser: async ({user}) => {
            const adminUser = await getAdminUser()
            if (!adminUser) {
                user.role = "admin"

                try {
                    await db
                        .update(Users)
                        .set({
                            role: "admin",
                        })
                        .where(eq(Users.id, user.id))
                } catch (err) {
                    console.error("修改失败")
                }
            }
        },
    },
    cookies: {
        sessionToken: {
            name: COOKIE_NAME,
            options: {
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60,
            },
        },
        csrfToken: {
            name: "ylog-csrf-token",
        },
        callbackUrl: {
            name: "ylog-callback-url",
        },
        pkceCodeVerifier: {
            name: "ylog-pkce-code-verifier",
        },
    },
    adapter: DrizzleAdapter(db, {
        usersTable: Users,
        accountsTable: Accounts,
        verificationTokensTable: VerificationTokens,
        authenticatorsTable: Authenticators,
    }),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
        authorized: async ({auth}) => {
            // Logged-in users are authenticated, otherwise redirect to login page
            return !!auth
        },
        async jwt({token, user}) {
            if (user) {
                token.data = {
                    id: user.id,
                    role: user?.role || "guest",
                }
            }
            return token
        },
        async session({session, token}) {
            if (token) {
                const userId = token?.data.id
                const user = await db
                    .select()
                    .from(Users)
                    .where(eq(Users.id, userId))
                    .then((res) => res[0])

                if (user) {
                    session.user = {
                        id: user.id,
                        email: user.email,
                        role: user?.role || "guest",
                        name: user.name,
                        image: user.image,
                    }
                }
            }

            return session
        },
    },
})
