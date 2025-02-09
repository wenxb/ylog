import {getToken} from "next-auth/jwt"
import {COOKIE_NAME} from "@/lib/constant"

export const getLoginUser = async (req) => {
    const token = await getToken({req, secret: process.env.AUTH_SECRET, cookieName: COOKIE_NAME})
    return token?.data ? token.data : null
}
