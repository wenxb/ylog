"use client"

import React from "react"

import {withRef} from "@udecode/cn"
import {ParagraphPlugin, type PlateEditor} from "@udecode/plate/react"
import {BlockquotePlugin} from "@udecode/plate-block-quote/react"
import {CodeBlockPlugin} from "@udecode/plate-code-block/react"
import {DatePlugin} from "@udecode/plate-date/react"
import {HEADING_KEYS} from "@udecode/plate-heading"
import {TocPlugin} from "@udecode/plate-heading/react"
import {INDENT_LIST_KEYS, ListStyleType} from "@udecode/plate-indent-list"
import {EquationPlugin, InlineEquationPlugin} from "@udecode/plate-math/react"
import {TablePlugin} from "@udecode/plate-table/react"
import {TogglePlugin} from "@udecode/plate-toggle/react"
import {
    CalendarIcon,
    ChevronRightIcon,
    Code2,
    Columns3Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    ListIcon,
    ListOrdered,
    PilcrowIcon,
    Quote,
    RadicalIcon,
    Square,
    Table,
    TableOfContentsIcon,
} from "lucide-react"

import {insertBlock, insertInlineElement} from "@/components/module/editor/transforms"

import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxGroupLabel,
    InlineComboboxInput,
    InlineComboboxItem,
} from "./inline-combobox"
import {PlateElement} from "./plate-element"

type Group = {
    group: string
    items: Item[]
}

interface Item {
    icon: React.ReactNode

    onSelect: (editor: PlateEditor, value: string) => void

    value: string
    className?: string
    focusEditor?: boolean
    keywords?: string[]
    label?: string
}

const groups: Group[] = [
    {
        group: "基础",
        items: [
            {
                icon: <PilcrowIcon />,
                keywords: ["paragraph"],
                label: "段落",
                value: ParagraphPlugin.key,
            },
            {
                icon: <Heading2Icon />,
                keywords: ["title", "h2"],
                label: "大标题",
                value: HEADING_KEYS.h2,
            },
            {
                icon: <Heading3Icon />,
                keywords: ["subtitle", "h3"],
                label: "中标题",
                value: HEADING_KEYS.h3,
            },
            {
                icon: <Heading4Icon />,
                keywords: ["subtitle", "h4"],
                label: "小标题",
                value: HEADING_KEYS.h4,
            },
            {
                icon: <ListIcon />,
                keywords: ["unordered", "ul", "-"],
                label: "无序列表",
                value: ListStyleType.Disc,
            },
            {
                icon: <ListOrdered />,
                keywords: ["ordered", "ol", "1"],
                label: "有序列表",
                value: ListStyleType.Decimal,
            },
            {
                icon: <Square />,
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
                icon: <Code2 />,
                keywords: ["```"],
                label: "代码块",
                value: CodeBlockPlugin.key,
            },
            {
                icon: <Table />,
                label: "表格",
                value: TablePlugin.key,
            },
            {
                icon: <Quote />,
                keywords: ["citation", "blockquote", "quote", ">"],
                label: "引用",
                value: BlockquotePlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value)
            },
        })),
    },
    {
        group: "高级",
        items: [
            {
                icon: <TableOfContentsIcon />,
                keywords: ["toc"],
                label: "目录",
                value: TocPlugin.key,
            },
            {
                icon: <Columns3Icon />,
                label: "多列",
                value: "action_three_columns",
            },
            {
                focusEditor: false,
                icon: <RadicalIcon />,
                label: "公式",
                value: EquationPlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value)
            },
        })),
    },
    {
        group: "行内",
        items: [
            {
                focusEditor: true,
                icon: <CalendarIcon />,
                keywords: ["time"],
                label: "日期",
                value: DatePlugin.key,
            },
            {
                focusEditor: false,
                icon: <RadicalIcon />,
                label: "行内公式",
                value: InlineEquationPlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertInlineElement(editor, value)
            },
        })),
    },
]

export const SlashInputElement = withRef<typeof PlateElement>(({className, ...props}, ref) => {
    const {children, editor, element} = props

    return (
        <PlateElement ref={ref} as="span" className={className} data-slate-value={element.value} {...props}>
            <InlineCombobox element={element} trigger="/">
                <InlineComboboxInput />

                <InlineComboboxContent>
                    <InlineComboboxEmpty>No results</InlineComboboxEmpty>

                    {groups.map(({group, items}) => (
                        <InlineComboboxGroup key={group}>
                            <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

                            {items.map(({focusEditor, icon, keywords, label, value, onSelect}) => (
                                <InlineComboboxItem
                                    key={value}
                                    value={value}
                                    onClick={() => onSelect(editor, value)}
                                    label={label}
                                    focusEditor={focusEditor}
                                    group={group}
                                    keywords={keywords}
                                >
                                    <div className="mr-2 text-muted-foreground">{icon}</div>
                                    {label ?? value}
                                </InlineComboboxItem>
                            ))}
                        </InlineComboboxGroup>
                    ))}
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    )
})
