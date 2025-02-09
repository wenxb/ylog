"use client"

import React from "react"

import {useEditorReadOnly} from "@udecode/plate/react"
import {
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
} from "@udecode/plate-basic-marks/react"
import {BoldIcon, Code2Icon, ItalicIcon, StrikethroughIcon, UnderlineIcon} from "lucide-react"

import {InlineEquationToolbarButton} from "./inline-equation-toolbar-button"
import {LinkToolbarButton} from "./link-toolbar-button"
import {MarkToolbarButton} from "./mark-toolbar-button"
import {MoreDropdownMenu} from "./more-dropdown-menu"
import {ToolbarGroup} from "./toolbar"
import {TurnIntoDropdownMenu} from "./turn-into-dropdown-menu"

export function FloatingToolbarButtons() {
    const readOnly = useEditorReadOnly()

    return (
        <>
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <TurnIntoDropdownMenu />

                        <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="粗体 (⌘+B)">
                            <BoldIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="斜体 (⌘+I)">
                            <ItalicIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={UnderlinePlugin.key} tooltip="下划线 (⌘+U)">
                            <UnderlineIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={StrikethroughPlugin.key} tooltip="删除线 (⌘+⇧+M)">
                            <StrikethroughIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={CodePlugin.key} tooltip="行内代码 (⌘+E)">
                            <Code2Icon />
                        </MarkToolbarButton>

                        <InlineEquationToolbarButton />

                        <LinkToolbarButton />
                    </ToolbarGroup>
                </>
            )}

            <ToolbarGroup>{!readOnly && <MoreDropdownMenu />}</ToolbarGroup>
        </>
    )
}
