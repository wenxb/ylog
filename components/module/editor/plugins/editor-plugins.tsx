"use client"

import emojiMartData from "@emoji-mart/data"
import {CalloutPlugin} from "@udecode/plate-callout/react"
import {DatePlugin} from "@udecode/plate-date/react"
import {DocxPlugin} from "@udecode/plate-docx"
import {EmojiPlugin} from "@udecode/plate-emoji/react"
import {FontBackgroundColorPlugin, FontColorPlugin} from "@udecode/plate-font/react"
import {HighlightPlugin} from "@udecode/plate-highlight/react"
import {HorizontalRulePlugin} from "@udecode/plate-horizontal-rule/react"
import {JuicePlugin} from "@udecode/plate-juice"
import {KbdPlugin} from "@udecode/plate-kbd/react"
import {ColumnPlugin} from "@udecode/plate-layout/react"
import {MarkdownPlugin} from "@udecode/plate-markdown"
import {SlashPlugin} from "@udecode/plate-slash-command/react"
import {TogglePlugin} from "@udecode/plate-toggle/react"
import {TrailingBlockPlugin} from "@udecode/plate-trailing-block"

import {FixedToolbarPlugin} from "@/components/module/editor/plugins/fixed-toolbar-plugin"
import {FloatingToolbarPlugin} from "@/components/module/editor/plugins/floating-toolbar-plugin"

import {alignPlugin} from "./align-plugin"
import {autoformatPlugin} from "./autoformat-plugin"
import {blockMenuPlugins} from "./block-menu-plugins"
import {cursorOverlayPlugin} from "./cursor-overlay-plugin"
import {deletePlugins} from "./delete-plugins"
import {dndPlugins} from "./dnd-plugins"
import {equationPlugins} from "./equation-plugins"
import {exitBreakPlugin} from "./exit-break-plugin"
import {indentListPlugins} from "./indent-list-plugins"
import {lineHeightPlugin} from "./line-height-plugin"
import {linkPlugin} from "./link-plugin"
import {mediaPlugins} from "./media-plugins"
import {mentionPlugin} from "./mention-plugin"
import {resetBlockTypePlugin} from "./reset-block-type-plugin"
import {softBreakPlugin} from "./soft-break-plugin"
import {tablePlugin} from "./table-plugin"
import {tocPlugin} from "./toc-plugin"
import {HeadingPlugin} from "@udecode/plate-heading/react"
import {BlockquotePlugin} from "@udecode/plate-block-quote/react"
import {CodeBlockPlugin} from "@udecode/plate-code-block/react"
import Prism from "prismjs"
import {
    BasicMarksPlugin,
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    UnderlinePlugin,
} from "@udecode/plate-basic-marks/react"
import {ParagraphPlugin} from "@udecode/plate/react"
import {ListPlugin, TodoListPlugin} from "@udecode/plate-list/react"
import {TabbablePlugin} from "@udecode/plate-tabbable/react"
import {CsvPlugin} from "@udecode/plate-csv"
import {ExcalidrawPlugin} from "@udecode/plate-excalidraw/react"

export const viewPlugins = [
    // Nodes
    HeadingPlugin.configure({options: {levels: 5}}),
    BlockquotePlugin,
    CodeBlockPlugin.configure({options: {prism: Prism}}),
    BasicMarksPlugin,
    HorizontalRulePlugin,
    linkPlugin,
    mentionPlugin,
    tablePlugin,
    TogglePlugin,
    ParagraphPlugin,
    ListPlugin,
    TodoListPlugin,
    DatePlugin,
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    StrikethroughPlugin,
    CodePlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    tocPlugin,
    ...mediaPlugins,
    ...equationPlugins,
    CalloutPlugin,
    ColumnPlugin,
    // Marks
    FontColorPlugin,
    FontBackgroundColorPlugin,
    HighlightPlugin,
    KbdPlugin,
    // Block Style
    alignPlugin,
    ...indentListPlugins,
    lineHeightPlugin,
] as const

export const editorPlugins = [
    TrailingBlockPlugin.configure({
        options: {type: "p"},
    }),
    TabbablePlugin,
    SlashPlugin,
    CsvPlugin,
    JuicePlugin,

    // Functionality
    autoformatPlugin,
    cursorOverlayPlugin,
    ...blockMenuPlugins,
    ...dndPlugins,
    EmojiPlugin.configure({options: {data: emojiMartData as any}}),
    exitBreakPlugin,
    resetBlockTypePlugin,
    ExcalidrawPlugin,
    ...deletePlugins,
    softBreakPlugin,

    // Deserialization
    DocxPlugin,
    MarkdownPlugin.configure({options: {indentList: true}}),

    // UI
    FixedToolbarPlugin,
    FloatingToolbarPlugin,
]
