"use client"

import React from "react"

import type {DropdownMenuProps} from "@radix-ui/react-dropdown-menu"

import {useEditorRef} from "@udecode/plate/react"
import {SubscriptPlugin, SuperscriptPlugin} from "@udecode/plate-basic-marks/react"
import {KbdPlugin} from "@udecode/plate-kbd/react"
import {ImportIcon, KeyboardIcon, MoreHorizontalIcon, SubscriptIcon, SuperscriptIcon} from "lucide-react"
import {MarkdownPlugin} from "@udecode/plate-markdown"
import {useFilePicker} from "use-file-picker"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    useOpenState,
} from "./dropdown-menu"
import {ToolbarButton} from "./toolbar"

type ImportType = "markdown"

export function MoreDropdownMenu(props: DropdownMenuProps) {
    const editor = useEditorRef()
    const openState = useOpenState()

    const [type, setType] = React.useState<ImportType>("markdown")
    const accept = [".md"]

    const getFileNodes = (text: string, type: ImportType) => {
        return editor.getApi(MarkdownPlugin).markdown.deserialize(text)
    }

    const {openFilePicker} = useFilePicker({
        accept,
        multiple: false,
        onFilesSelected: async ({plainFiles}) => {
            const text = await plainFiles[0].text()

            const nodes = getFileNodes(text, type)

            editor.tf.insertNodes(nodes)
        },
    })

    return (
        <DropdownMenu modal={false} {...openState} {...props}>
            <DropdownMenuTrigger asChild>
                <ToolbarButton pressed={openState.open} tooltip="更多">
                    <MoreHorizontalIcon />
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col overflow-y-auto"
                align="start"
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onSelect={() => {
                            editor.tf.toggleMark(KbdPlugin.key)
                            editor.tf.collapse({edge: "end"})
                            editor.tf.focus()
                        }}
                    >
                        <KeyboardIcon />
                        键盘输入
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={() => {
                            editor.tf.toggleMark(SuperscriptPlugin.key, {
                                remove: SubscriptPlugin.key,
                            })
                            editor.tf.focus()
                        }}
                    >
                        <SuperscriptIcon />
                        上标 (⌘+,)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            editor.tf.toggleMark(SubscriptPlugin.key, {
                                remove: SuperscriptPlugin.key,
                            })
                            editor.tf.focus()
                        }}
                    >
                        <SubscriptIcon />
                        下标 (⌘+.)
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={() => {
                            setType("markdown")
                            openFilePicker()
                        }}
                    >
                        <ImportIcon />从 Markdown 导入
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
