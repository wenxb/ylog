import React from "react"

import type {VariantProps} from "class-variance-authority"
import {cva} from "class-variance-authority"

import {cn} from "@udecode/cn"
import {PlateStatic, type PlateStaticProps} from "@udecode/plate"


export function EditorStatic({
    children,
    className,
    ...props
}: PlateStaticProps) {
    return <PlateStatic className={cn("relative w-full", className)} {...props} />
}
