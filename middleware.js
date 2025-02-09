import {getToken} from "next-auth/jwt"
import {NextResponse} from "next/server"
import {LOGIN_URL} from "@/lib/constant"

const ROLE_PERMISSIONS = {
    admin: ["*"],
    user: [],
    guest: [],
}

export async function middleware(req) {
    const token = await getToken({req, secret: process.env.AUTH_SECRET, cookieName: "ylog-session-token"})
    const {pathname} = req.nextUrl

    const userRole = token?.data?.role || "guest"
    const allowedRoutes = ROLE_PERMISSIONS[userRole] || []

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route) || route === "*")
    if (!isAllowed) {
        if (pathname.startsWith("/api")) {
            return Response.json({error: "Unauthorized"}, {status: 401})
        }
        return NextResponse.redirect(new URL(userRole === "guest" ? LOGIN_URL : "/403", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/compose/:path*", "/settings/:path*", "/api/admin/:path*", "/api/upload/:path*"],
}
