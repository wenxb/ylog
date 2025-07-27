import {createReactEditorJS} from "react-editor-js"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Embed from "@editorjs/embed"
import ImageTool from "@editorjs/image"
import Paragraph from "@editorjs/paragraph"
import Table from "@editorjs/table"
import Quote from "@editorjs/quote"
import DragDrop from "editorjs-drag-drop"
import Undo from "editorjs-undo"
import {useCallback, useRef} from "react"
import InlineCode from "@editorjs/inline-code"
import {editorI18n} from "@/lib/editor_i18n"

const ReactEditorJS = createReactEditorJS()

export default function EditorBlock({initialData, onReady, onChange}) {
    const editorCore = useRef(null)

    const tools = {
        paragraph: Paragraph,
        header: Header,
        image: {
            class: ImageTool,
            config: {
                uploader: {
                    uploadByFile(file) {
                        return new Promise((resolve) => {
                            const url = URL.createObjectURL(file) // TODO: 替换为上传 API
                            resolve({success: 1, file: {url}})
                        })
                    },
                    uploadByUrl(url) {
                        return Promise.resolve({success: 1, file: {url}})
                    },
                },
            },
        },
        list: List,
        embed: Embed,
        table: Table,
        quote: Quote,
        inlineCode: InlineCode,
    }

    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance
    }, [])

    const handleReady = () => {
        const editor = editorCore.current._editorJS
        new Undo({editor})
        new DragDrop(editor)
        if (onReady) onReady(editor)
    }

    return (
        <>
            <ReactEditorJS
                defaultValue={initialData}
                tools={tools}
                onInitialize={handleInitialize}
                onReady={handleReady}
                onChange={onChange}
                placeholder="输入正文..."
                i18n={editorI18n}
            />
        </>
    )
}
