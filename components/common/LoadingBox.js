import React from "react"
import {ProgressActivity} from "@/components/common/icons"
import {cn} from "@/utils"

const LoadingBox = ({className, children, loading = true, childClass = "", backdropClass = "", noBg = true}) => {
    return (
        <div className={cn("min-h-28 w-full flex-1", className)}>
            <div
                className={cn(
                    "absolute top-0 left-0 z-2 flex h-full w-full items-center justify-center bg-white/70 dark:bg-gray-700/30",
                    backdropClass,
                    noBg && "bg-transparent!",
                    !loading && "hidden opacity-0"
                )}
            >
                <ProgressActivity className={"text-3xl"} isActive={loading} />
            </div>
            <div
                className={cn(
                    "relative z-1 flex w-full flex-col",
                    childClass,
                    loading && "pointer-events-none opacity-50 select-none"
                )}
            >
                {children}
            </div>
        </div>
    )
}

export default LoadingBox
