"use client"

import React from "react"

import type {DropdownMenuProps} from "@radix-ui/react-dropdown-menu"

import {ParagraphPlugin, useEditorRef, useSelectionFragmentProp} from "@udecode/plate/react"
import {BlockquotePlugin} from "@udecode/plate-block-quote/react"
import {CodeBlockPlugin} from "@udecode/plate-code-block/react"
import {HEADING_KEYS} from "@udecode/plate-heading"
import {INDENT_LIST_KEYS, ListStyleType} from "@udecode/plate-indent-list"
import {TogglePlugin} from "@udecode/plate-toggle/react"
import {
    ChevronRightIcon,
    Columns3Icon,
    FileCodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListIcon,
    ListOrderedIcon,
    PilcrowIcon,
    QuoteIcon,
    SquareIcon,
} from "lucide-react"

import {getBlockType, setBlockType, STRUCTURAL_TYPES} from "@/components/module/editor/transforms"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
    useOpenState,
} from "./dropdown-menu"
import {ToolbarButton} from "./toolbar"

const turnIntoItems = [
    {
        icon: <PilcrowIcon />,
        keywords: ["paragraph"],
        label: "段落",
        value: ParagraphPlugin.key,
    },
    {
        icon: <Heading1Icon />,
        keywords: ["subtitle", "h2"],
        label: "标题1",
        value: HEADING_KEYS.h2,
    },
    {
        icon: <Heading2Icon />,
        keywords: ["subtitle", "h3"],
        label: "标题2",
        value: HEADING_KEYS.h3,
    },
    {
        icon: <Heading3Icon />,
        keywords: ["subtitle", "h4"],
        label: "标题3",
        value: HEADING_KEYS.h4,
    },
    {
        icon: <ListIcon />,
        keywords: ["unordered", "ul", "-"],
        label: "无序列表",
        value: ListStyleType.Disc,
    },
    {
        icon: <ListOrderedIcon />,
        keywords: ["ordered", "ol", "1"],
        label: "有序列表",
        value: ListStyleType.Decimal,
    },
    {
        icon: <SquareIcon />,
        keywords: ["checklist", "task", "checkbox", "[]"],
        label: "待办事项",
        value: INDENT_LIST_KEYS.todo,
    },
    {
        icon: <ChevronRightIcon />,
        keywords: ["collapsible", "expandable"],
        label: "折叠列表",
        value: TogglePlugin.key,
    },
    {
        icon: <FileCodeIcon />,
        keywords: ["```"],
        label: "代码块",
        value: CodeBlockPlugin.key,
    },
    {
        icon: <QuoteIcon />,
        keywords: ["citation", "blockquote", ">"],
        label: "引用",
        value: BlockquotePlugin.key,
    },
    {
        icon: <Columns3Icon />,
        label: "多列",
        value: "action_three_columns",
    },
]

export function TurnIntoDropdownMenu(props: DropdownMenuProps) {
    const editor = useEditorRef()
    const openState = useOpenState()

    const value = useSelectionFragmentProp({
        defaultValue: ParagraphPlugin.key,
        getProp: (node) => getBlockType(node as any),
        structuralTypes: STRUCTURAL_TYPES,
    })
    const selectedItem = React.useMemo(
        () => turnIntoItems.find((item) => item.value === (value ?? ParagraphPlugin.key)) ?? turnIntoItems[0],
        [value]
    )

    return (
        <DropdownMenu modal={false} {...openState} {...props}>
            <DropdownMenuTrigger asChild>
                <ToolbarButton className="min-w-[80px]" pressed={openState.open} tooltip="转换为" isDropdown>
                    {selectedItem.label}
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="ignore-click-outside/toolbar min-w-0"
                onCloseAutoFocus={(e) => {
                    e.preventDefault()
                    editor.tf.focus()
                }}
                align="start"
            >
                <DropdownMenuRadioGroup
                    value={value}
                    onValueChange={(type) => {
                        setBlockType(editor, type)
                    }}
                    label="转换为"
                >
                    {turnIntoItems.map(({icon, label, value: itemValue}) => (
                        <DropdownMenuRadioItem key={itemValue} className="min-w-[180px]" value={itemValue}>
                            {icon}
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
