import React from "react"
import editorjsHTML from "editorjs-html"

const EditorJsRender = ({data}) => {
    const edjsParser = editorjsHTML()
    const html = edjsParser.parse(data) // 返回 html 字符串数组
    return <div dangerouslySetInnerHTML={{__html: html}} />
}

export default EditorJsRender
