"use client"

import {useEditorRef, withRef} from "@udecode/plate/react"
import {insertInlineEquation} from "@udecode/plate-math"
import {RadicalIcon} from "lucide-react"

import {ToolbarButton} from "./toolbar"

export const InlineEquationToolbarButton = withRef<typeof ToolbarButton>((props, ref) => {
    const editor = useEditorRef()

    return (
        <ToolbarButton
            ref={ref}
            tooltip="公式"
            {...props}
            onClick={() => {
                insertInlineEquation(editor)
            }}
        >
            <RadicalIcon />
        </ToolbarButton>
    )
})
