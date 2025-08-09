"use client"
import {useSession} from "next-auth/react"
import {Avatar, AvatarImage} from "@/components/ui/avatar"
import {useAppStore} from "@/stores/app"
import {Button} from "@/components/ui/button"

const HeaderBar = () => {
    const {data: session} = useSession()
    const app = useAppStore()

    return (
        <div className="-ml-1.5 sm:hidden">
            <Button size="icon" variant="ghost" onClick={() => app.setShowMobileSide(true)}>
                <Avatar className="border size-8">
                    <AvatarImage src={session?.user?.image || "/img/default-avatar.jpg"}></AvatarImage>
                </Avatar>
            </Button>
        </div>
    )
}

export default HeaderBar
