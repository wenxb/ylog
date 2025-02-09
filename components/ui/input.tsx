import * as React from "react"

import {cn} from "@/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({className, type, ...props}, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export {Input}
