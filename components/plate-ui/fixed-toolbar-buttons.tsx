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
import {FontBackgroundColorPlugin, FontColorPlugin} from "@udecode/plate-font/react"
import {ImagePlugin} from "@udecode/plate-media/react"
import {
    BaselineIcon,
    BoldIcon,
    Code2Icon,
    ItalicIcon,
    PaintBucketIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from "lucide-react"

import {MoreDropdownMenu} from "@/components/plate-ui/more-dropdown-menu"

import {AlignDropdownMenu} from "./align-dropdown-menu"
import {ColorDropdownMenu} from "./color-dropdown-menu"
import {EmojiDropdownMenu} from "./emoji-dropdown-menu"
import {BulletedIndentListToolbarButton, NumberedIndentListToolbarButton} from "./indent-list-toolbar-button"
import {IndentTodoToolbarButton} from "./indent-todo-toolbar-button"
import {InsertDropdownMenu} from "./insert-dropdown-menu"
import {MarkToolbarButton} from "./mark-toolbar-button"
import {MediaToolbarButton} from "./media-toolbar-button"
import {ToolbarGroup} from "./toolbar"

export function FixedToolbarButtons() {
    const readOnly = useEditorReadOnly()

    return (
        <div className="flex w-full">
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <InsertDropdownMenu />
                    </ToolbarGroup>

                    <ToolbarGroup>
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

                        <ColorDropdownMenu nodeType={FontColorPlugin.key} tooltip="文字颜色">
                            <BaselineIcon />
                        </ColorDropdownMenu>

                        <ColorDropdownMenu nodeType={FontBackgroundColorPlugin.key} tooltip="背景色">
                            <PaintBucketIcon />
                        </ColorDropdownMenu>
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <AlignDropdownMenu />

                        <NumberedIndentListToolbarButton />
                        <BulletedIndentListToolbarButton />
                        <IndentTodoToolbarButton />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <MediaToolbarButton nodeType={ImagePlugin.key} />
                        <EmojiDropdownMenu />
                    </ToolbarGroup>
                </>
            )}
            <div className="grow" />
            <ToolbarGroup>
                <MoreDropdownMenu />
            </ToolbarGroup>
        </div>
    )
}
