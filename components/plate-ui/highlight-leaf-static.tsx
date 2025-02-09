import React from "react"

import type {SlateLeafProps} from "@udecode/plate"
import {SlateLeaf} from "@udecode/plate"

import {cn} from "@udecode/cn"

export function HighlightLeafStatic({children, className, ...props}: SlateLeafProps) {
    return (
        <SlateLeaf as="mark" className={cn(className, "bg-highlight/30 text-inherit")} {...props}>
            {children}
        </SlateLeaf>
    )
}
