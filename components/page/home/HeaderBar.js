"use client"
import {useSession} from "next-auth/react"
import {useAppStore} from "@/stores/app"
import {Avatar, Button} from "@arco-design/web-react"

const HeaderBar = () => {
    const {data: session} = useSession()
    const app = useAppStore()

    return (
        <div className="-ml-1.5 sm:hidden">
            <Button shape="circle" type="text" onClick={() => app.setShowMobileSide(true)}>
                <Avatar size={32} style={{border: "1px solid"}} src={session?.user?.image || "/img/default-avatar.jpg"} />
            </Button>
        </div>
    )
}

export default HeaderBar
