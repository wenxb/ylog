"use client"
import {cn} from "@/utils"
import {useRouter} from "next/navigation"
import {useWindowScroll} from "react-use"
import PageTitle from "@/components/module/PageTitle"
import {useEffect, useState} from "react"
import {Button} from "@arco-design/web-react"
import {IconArrowLeft} from "@arco-design/web-react/icon"

const PageHeaderWrap = ({
    title,
    action,
    footer,
    barSlot,
    scrollShowBarSlot = false,
    secondary,
    children,
    hideBar,
    hideBack,
    className,
    noPadding = false,
}) => {
    const router = useRouter()
    const [scrollY, setScrollY] = useState(0)
    const {y} = useWindowScroll()

    useEffect(() => {
        setScrollY(y)
    }, [y])

    const scrollToTop = () => {
        window?.scrollTo({
            top: 0,
        })
    }

    return (
        <>
            {!hideBar && (
                <div
                    className={cn(
                        "sticky top-0 z-[20] flex h-[54px] w-full items-center justify-between bg-background px-4 supports-backdrop-filter:bg-white/80 supports-backdrop-filter:backdrop-blur-2xl max-sm:bg-background dark:bg-background/80",
                        className
                    )}
                >
                    <div className="flex items-center">
                        {!hideBack && (
                            <div className={"min-w-12"}>
                                <Button
                                    type={"text"}
                                    icon={<IconArrowLeft fontSize={18} />}
                                    onClick={router.back}
                                    shape={"circle"}
                                    className={"-ml-1!"}
                                ></Button>
                            </div>
                        )}
                        {!scrollShowBarSlot ? (
                            barSlot
                        ) : (
                            <div
                                onClick={scrollToTop}
                                className={cn(
                                    "pointer-events-none line-clamp-1 flex cursor-pointer flex-col items-center justify-center opacity-0 transition-opacity select-none",
                                    scrollY >= 60 && "pointer-events-auto opacity-100 select-auto"
                                )}
                            >
                                {barSlot}
                            </div>
                        )}
                    </div>
                    {action && <div className="-mr-1 flex flex-col items-start justify-center">{action}</div>}
                </div>
            )}

            <div className={"relative flex min-h-[130px] flex-col border-b"}>
                {(title || children) && (
                    <>
                        <div className={cn("relative flex flex-col px-4 pb-4", hideBar && "pt-4", noPadding && "p-0")}>
                            {title && <PageTitle>{title}</PageTitle>}
                            {secondary && <div className={"text-muted-foreground"}>{secondary}</div>}
                            {children}
                        </div>
                        {footer}
                    </>
                )}
            </div>
        </>
    )
}

export default PageHeaderWrap
