"use client"
import {Editor, getDefaultKeyBinding, KeyBindingUtil, RichUtils} from "draft-js"
import {useRef} from "react"
import "./EaEditor.scss"
import {stateToHTML} from "draft-js-export-html"
import {cn} from "@/utils"

const DraftEditor = ({onChange, editorState, setEditorState, onSave, placeholder = "", className}) => {
    const editorRef = useRef(null)

    const handleEditorChange = (s) => {
        setEditorState(s)
        const contentState = s.getCurrentContent()
        const html = stateToHTML(contentState)
        if (onChange) onChange(html)
    }
    const keyBindingFn = (e) => {
        if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 66) {
            // Ctrl + B
            return "bold"
        }
        if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 73) {
            // Ctrl + I
            return "italic"
        }
        if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 83) {
            // Ctrl + S
            if (onSave) onSave()
            return "editor-save"
        }
        if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 85) {
            // Ctrl + U
            return "underline"
        }
        if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 49) {
            // Ctrl + 1
            return "header-one"
        }
        if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 50) {
            // Ctrl + 2
            return "header-two"
        }

        return getDefaultKeyBinding(e)
    }
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        if (["header-one", "header-two"].includes(command)) {
            const newState = RichUtils.toggleBlockType(editorState, command)
            setEditorState(newState)
            return "handled"
        }

        return "not-handled" // 没有处理的命令
    }

    return (
        <div
            onClick={() => editorRef.current?.focus()}
            className={cn("prose prose-sm w-full dark:prose-invert", className)}
        >
            <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleEditorChange}
                placeholder={placeholder}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
                className="aaaaa"
            />
        </div>
    )
}

export default DraftEditor
