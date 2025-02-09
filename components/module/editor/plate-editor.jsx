"use client"
import {DndProvider} from "react-dnd"
import {useCreateEditor} from "@/components/module/editor/use-create-editor"
import {Plate} from "@udecode/plate/react"
import {Editor, EditorContainer} from "@/components/plate-ui/editor"
import {HTML5Backend} from "react-dnd-html5-backend"
import {forwardRef, useImperativeHandle} from "react"

export const PlateEditor = forwardRef(({value = []}, ref) => {
    const editor = useCreateEditor(value)

    useImperativeHandle(ref, () => ({
        getValue: () => {
            return editor.children
        },
        setValue: (value) => {
            editor.children = value
        },
    }))

    return (
        <DndProvider backend={HTML5Backend}>
            <Plate editor={editor}>
                <EditorContainer>
                    <Editor />
                </EditorContainer>
            </Plate>
        </DndProvider>
    )
})
