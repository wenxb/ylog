"use client"
import {Button} from "@/components/ui/button"
import {ArrowLeftIcon, MenuIcon} from "lucide-react"
import {useRouter} from "next/navigation"
import {cn} from "@/utils"
import {useAppStore} from "@/stores/app"

const PageHeader = ({
    title,
    hideBack,
    secondary,
    action,
    children,
    noPadding = false,
    isSticky = true,
    showMobileMenu = true,
}) => {
    const router = useRouter()
    const app = useAppStore()

    return (
        <div
            className={cn(
                "relative top-0 z-20 flex h-[54px] w-full items-center bg-white/85 backdrop-blur-2xl dark:bg-background/85",
                isSticky && "sticky",
                !noPadding && "px-4"
            )}
        >
            {!hideBack && (
                <Button onClick={router.back} variant="ghost" className={"-ml-2"} size="icon">
                    <ArrowLeftIcon className={"text-xl"} />
                </Button>
            )}
            {title && (
                <div className={cn("flex-1", hideBack ? "pr-4" : "px-4")}>
                    <div className="text-2xl font-bold">{title}</div>
                    {secondary && <div className="text-muted-foreground text-sm">{secondary}</div>}
                </div>
            )}
            {children}
            {action}
            {showMobileMenu && (
                <Button className="sm:hidden" onClick={() => app.setShowMobileSide(true)} variant="ghost" size="icon">
                    <MenuIcon className="stroke-[2.5] !size-5"/>
                </Button>
            )}
        </div>
    )
}

export default PageHeader
