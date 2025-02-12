import {withProps} from "@udecode/cn"
import {ParagraphPlugin, PlateElement, PlateLeaf, usePlateEditor} from "@udecode/plate/react"
import {BlockquotePlugin} from "@udecode/plate-block-quote/react"
import {CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin} from "@udecode/plate-code-block/react"
import {HorizontalRulePlugin} from "@udecode/plate-horizontal-rule/react"
import {LinkPlugin} from "@udecode/plate-link/react"
import {ImagePlugin, MediaEmbedPlugin, PlaceholderPlugin} from "@udecode/plate-media/react"
import {TogglePlugin} from "@udecode/plate-toggle/react"
import {ColumnItemPlugin, ColumnPlugin} from "@udecode/plate-layout/react"
import {BulletedListPlugin, ListItemPlugin, NumberedListPlugin, TodoListPlugin} from "@udecode/plate-list/react"
import {MentionInputPlugin, MentionPlugin} from "@udecode/plate-mention/react"
import {TableCellHeaderPlugin, TableCellPlugin, TablePlugin, TableRowPlugin} from "@udecode/plate-table/react"
import {DatePlugin} from "@udecode/plate-date/react"
import {
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    UnderlinePlugin,
} from "@udecode/plate-basic-marks/react"
import {HighlightPlugin} from "@udecode/plate-highlight/react"
import {KbdPlugin} from "@udecode/plate-kbd/react"
import {HEADING_KEYS} from "@udecode/plate-heading"

import {BlockquoteElement} from "@/components/plate-ui/blockquote-element"
import {CodeBlockElement} from "@/components/plate-ui/code-block-element"
import {CodeLineElement} from "@/components/plate-ui/code-line-element"
import {CodeSyntaxLeaf} from "@/components/plate-ui/code-syntax-leaf"
import {HrElement} from "@/components/plate-ui/hr-element"
import {ImageElement} from "@/components/plate-ui/image-element"
import {LinkElement} from "@/components/plate-ui/link-element"
import {ToggleElement} from "@/components/plate-ui/toggle-element"
import {ColumnGroupElement} from "@/components/plate-ui/column-group-element"
import {ColumnElement} from "@/components/plate-ui/column-element"
import {HeadingElement} from "@/components/plate-ui/heading-element"
import {ListElement} from "@/components/plate-ui/list-element"
import {MediaEmbedElement} from "@/components/plate-ui/media-embed-element"
import {MentionElement} from "@/components/plate-ui/mention-element"
import {MentionInputElement} from "@/components/plate-ui/mention-input-element"
import {ParagraphElement} from "@/components/plate-ui/paragraph-element"
import {TableElement} from "@/components/plate-ui/table-element"
import {TableRowElement} from "@/components/plate-ui/table-row-element"
import {TableCellElement, TableCellHeaderElement} from "@/components/plate-ui/table-cell-element"
import {TodoListElement} from "@/components/plate-ui/todo-list-element"
import {DateElement} from "@/components/plate-ui/date-element"
import {CodeLeaf} from "@/components/plate-ui/code-leaf"
import {HighlightLeaf} from "@/components/plate-ui/highlight-leaf"
import {KbdLeaf} from "@/components/plate-ui/kbd-leaf"
import {withPlaceholders} from "@/components/plate-ui/placeholder"
import {editorPlugins, viewPlugins} from "@/components/module/editor/plugins/editor-plugins"
import {SlashInputPlugin} from "@udecode/plate-slash-command/react"
import {SlashInputElement} from "@/components/plate-ui/slash-input-element"
import {EquationElement} from "@/components/plate-ui/equation-element"
import {EquationPlugin} from "@udecode/plate-math/react"
import {EmojiInputPlugin} from "@udecode/plate-emoji/react"
import {EmojiInputElement} from "@/components/plate-ui/emoji-input-element"
import {ExcalidrawPlugin} from "@udecode/plate-excalidraw/react"
import {ExcalidrawElement} from "@/components/plate-ui/excalidraw-element"
import {MediaPlaceholderElement} from "@/components/plate-ui/media-placeholder-element"

export const viewComponents = {
    [BlockquotePlugin.key]: BlockquoteElement,
    [CodeBlockPlugin.key]: CodeBlockElement,
    [CodeLinePlugin.key]: CodeLineElement,
    [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
    [EquationPlugin.key]: EquationElement,
    [HorizontalRulePlugin.key]: HrElement,
    [ImagePlugin.key]: ImageElement,
    [LinkPlugin.key]: LinkElement,
    [TogglePlugin.key]: ToggleElement,
    [ColumnPlugin.key]: ColumnGroupElement,
    [ColumnItemPlugin.key]: ColumnElement,
    [ExcalidrawPlugin.key]: ExcalidrawElement,
    [HEADING_KEYS.h1]: withProps(HeadingElement, {variant: "h1"}),
    [HEADING_KEYS.h2]: withProps(HeadingElement, {variant: "h2"}),
    [HEADING_KEYS.h3]: withProps(HeadingElement, {variant: "h3"}),
    [HEADING_KEYS.h4]: withProps(HeadingElement, {variant: "h4"}),
    [HEADING_KEYS.h5]: withProps(HeadingElement, {variant: "h5"}),
    [HEADING_KEYS.h6]: withProps(HeadingElement, {variant: "h6"}),
    [BulletedListPlugin.key]: withProps(ListElement, {variant: "ul"}),
    [NumberedListPlugin.key]: withProps(ListElement, {variant: "ol"}),
    [ListItemPlugin.key]: withProps(PlateElement, {as: "li"}),
    [MediaEmbedPlugin.key]: MediaEmbedElement,
    [MentionPlugin.key]: MentionElement,
    [ParagraphPlugin.key]: ParagraphElement,
    [TablePlugin.key]: TableElement,
    [TableRowPlugin.key]: TableRowElement,
    [TableCellPlugin.key]: TableCellElement,
    [TableCellHeaderPlugin.key]: TableCellHeaderElement,
    [TodoListPlugin.key]: TodoListElement,
    [DatePlugin.key]: DateElement,
    [BoldPlugin.key]: withProps(PlateLeaf, {as: "strong"}),
    [CodePlugin.key]: CodeLeaf,
    [HighlightPlugin.key]: HighlightLeaf,
    [ItalicPlugin.key]: withProps(PlateLeaf, {as: "em"}),
    [KbdPlugin.key]: KbdLeaf,
    [PlaceholderPlugin.key]: MediaPlaceholderElement,
    [StrikethroughPlugin.key]: withProps(PlateLeaf, {as: "s"}),
    [SubscriptPlugin.key]: withProps(PlateLeaf, {as: "sub"}),
    [SuperscriptPlugin.key]: withProps(PlateLeaf, {as: "sup"}),
    [UnderlinePlugin.key]: withProps(PlateLeaf, {as: "u"}),
}

export const editorComponents = {
    ...viewComponents,
    [EmojiInputPlugin.key]: EmojiInputElement,
    [MentionInputPlugin.key]: MentionInputElement,
    [SlashInputPlugin.key]: SlashInputElement,
}

export const useCreateEditor = (value) => {
    const components = withPlaceholders(editorComponents)

    return usePlateEditor({
        plugins: [...viewPlugins, ...editorPlugins],
        override: {
            components: components,
        },
        value,
    })
}
