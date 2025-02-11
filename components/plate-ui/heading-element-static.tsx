import * as React from "react"

import type {SlateElementProps} from "@udecode/plate"
import {SlateElement} from "@udecode/plate"

import {cn} from "@udecode/cn"
import {cva} from "class-variance-authority"

interface HeadingElementViewProps extends SlateElementProps {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export const HeadingElementStatic = ({children, className, variant = "h1", ...props}: HeadingElementViewProps) => {
    return (
        <SlateElement as={variant} className={cn(className)} {...props}>
            {children}
        </SlateElement>
    )
}
