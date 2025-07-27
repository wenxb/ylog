"use client"
import {Button} from "@/components/ui/button"
import {ArrowLeftIcon} from "lucide-react"
import {useRouter} from "next/navigation"
import {cn} from "@/utils"

const PageHeader = ({title, hideBack, secondary, action, children, noPadding = false, isSticky = true}) => {
    const router = useRouter()

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
                    <div className="text-xl font-semibold">{title}</div>
                    {secondary && <div className="text-sm text-muted-foreground">{secondary}</div>}
                </div>
            )}
            {children}
            {action}
        </div>
    )
}

export default PageHeader
