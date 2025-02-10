"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {signOut, useSession} from "next-auth/react"
import {usePathname, useRouter} from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useState} from "react"
import {LogOutIcon, SettingsIcon} from "lucide-react"
import Auth from "@/utils/Auth"
import {LOGIN_URL} from "@/lib/constant"
import {useAppStore} from "@/stores/app"

const SideTop = () => {
    const [show, setShow] = useState(false)
    const {data: session, status} = useSession()
    const router = useRouter()
    const user = session?.user
    const pathname = usePathname()
    const app = useAppStore()

    const handleLogin = () => {
        if (status === "loading") return

        if (!user) {
            router.push(`${LOGIN_URL}?callbackUrl=` + pathname)
            app.setShowMobileSide(false)
        } else {
            setShow(true)
        }
    }

    const handleItemClick = async (key) => {
        switch (key) {
            case "logout":
                await signOut({redirectTo: "/"})
                break
        }
    }

    return (
        <div className={"my-2 flex items-center py-2 max-xl:justify-center max-sm:justify-start max-sm:px-6 max-sm:ml-0.5"}>
            <DropdownMenu open={show} onOpenChange={(v) => !v && setShow(false)}>
                <DropdownMenuTrigger asChild>
                    <Button onClick={handleLogin} variant="ghost" size="icon">
                        <Avatar className="border">
                            <AvatarImage src={user?.image || "/img/default-avatar.jpg"} alt={user?.name || ""} />
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-56 z-[1201]">
                    {Auth.isAdmin() && (
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push("/settings")
                                    setShow(false)
                                }}
                            >
                                <SettingsIcon />
                                网站设置
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem
                        onClick={() => handleItemClick("logout")}
                        className="text-red-500 focus:text-red-500"
                    >
                        <LogOutIcon />
                        退出登录
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Link className="max-xl:hidden" href="/">
                <div className={"ml-3 text-lg font-bold"}>{user?.name || "欢迎光临"}</div>
            </Link>
        </div>
    )
}

export default SideTop
