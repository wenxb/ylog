import React from "react"

import type {SlateElementProps} from "@udecode/plate"
import {SlateElement} from "@udecode/plate"

import {cn} from "@udecode/cn"

export const LinkElementStatic = ({children, className, ...props}: SlateElementProps) => {
    return (
        <SlateElement
            as="a"
            className={cn(className, "text-primary underline decoration-primary underline-offset-4")}
            {...props}
            // @ts-ignore
            target="_blank"
        >
            {children}
        </SlateElement>
    )
}
