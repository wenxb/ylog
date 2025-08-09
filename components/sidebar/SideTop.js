"use client"
import Link from "next/link"
import {signOut, useSession} from "next-auth/react"
import {usePathname, useRouter} from "next/navigation"
import {useState} from "react"
import {LogOutIcon, SettingsIcon} from "lucide-react"
import Auth from "@/utils/Auth"
import {LOGIN_URL} from "@/lib/constant"
import {Avatar, Button, Dropdown, Menu} from "@arco-design/web-react"

const SideTop = () => {
    const [show, setShow] = useState(false)
    const {data: session, status} = useSession()
    const router = useRouter()
    const user = session?.user
    const pathname = usePathname()

    const handleLogin = () => {
        if (status === "loading") return

        if (!user) {
            router.push(`${LOGIN_URL}?callbackUrl=` + pathname)
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

    const droplist = (
        <Menu>
            {Auth.isAdmin() && (
                <>
                    <Menu.Item
                        onClick={() => {
                            router.push("/settings")
                            setShow(false)
                        }}
                    >
                        <SettingsIcon /> 网站设置
                    </Menu.Item>
                    <Menu.Divider />
                </>
            )}
            <Menu.Item className="text-red-500" onClick={() => handleItemClick("logout")}>
                <LogOutIcon /> 退出登录
            </Menu.Item>
        </Menu>
    )

    return (
        <div className={"my-2 flex items-center py-2 max-xl:justify-center max-sm:justify-start max-sm:px-6 max-sm:ml-0.5"}>
            <Dropdown
                droplist={droplist}
                trigger="click"
                position="br"
                popupVisible={show}
                onPopupVisibleChange={setShow}
            >
                <Button onClick={handleLogin} type="text" shape="circle">
                    <Avatar size={32} style={{border: "1px solid"}} src={user?.image || "/img/default-avatar.jpg"}>
                        {user?.name?.[0]}
                    </Avatar>
                </Button>
            </Dropdown>
            <Link className="max-xl:hidden" href="/">
                <div className={"ml-3 text-lg font-bold"}>{user?.name || "欢迎光临"}</div>
            </Link>
        </div>
    )
}

export default SideTop
