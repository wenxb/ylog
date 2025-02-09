"use client"
import {Button} from "@/components/ui/button"
import {MusicIcon, SquarePenIcon} from "lucide-react"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import Link from "next/link"
import {ModeToggle} from "@/components/module/common/ModeToggle"
import Auth from "@/utils/Auth"

const SideBottom = () => {
    return (
        <div className="flex gap-3 pb-6 max-xl:mt-3 max-xl:flex-col max-xl:items-center max-sm:flex-row max-sm:items-start max-sm:pb-4 max-sm:px-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon">
                        <Link href={"/music"}>
                            <MusicIcon />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>音乐</TooltipContent>
            </Tooltip>
            <ModeToggle />
            {Auth.isAdmin() && (
                <>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon">
                                <Link href="/compose/write">
                                    <SquarePenIcon />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>新文章</TooltipContent>
                    </Tooltip>
                </>
            )}
        </div>
    )
}

export default SideBottom
