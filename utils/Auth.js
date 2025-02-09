import {useSession} from "next-auth/react"

export default {
    isAdmin() {
        const {data: session} = useSession()
        return session && session.user?.role === "admin"
    },
    isLogin() {
        const {data: session} = useSession()
        return session && session.user?.role === "user"
    },
}
