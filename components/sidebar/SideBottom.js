"use client"
import {MusicIcon, SquarePenIcon} from "lucide-react"
import Link from "next/link"
import {ModeToggle} from "@/components/module/ModeToggle"
import Auth from "@/utils/Auth"
import {useAppStore} from "@/stores/app"
import {Button, Tooltip} from "@arco-design/web-react"

const SideBottom = () => {
    const app = useAppStore()

    return (
        <div className="flex gap-3 pb-6 max-xl:mt-3 max-xl:flex-col max-xl:items-center max-sm:flex-row max-sm:items-start max-sm:px-4 max-sm:pb-4">
            <Tooltip content="音乐">
                <Link href="/music" onClick={() => app.setShowMobileSide(false)}>
                    <Button type="text" shape="circle">
                        <MusicIcon />
                    </Button>
                </Link>
            </Tooltip>
            <ModeToggle />
            {Auth.isAdmin() && (
                <Tooltip content="新文章">
                    <Link href="/compose/write" onClick={() => app.setShowMobileSide(false)}>
                        <Button type="text" shape="circle">
                            <SquarePenIcon />
                        </Button>
                    </Link>
                </Tooltip>
            )}
        </div>
    )
}

export default SideBottom
