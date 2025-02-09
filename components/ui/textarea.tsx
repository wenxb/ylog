import * as React from "react"
import {useEffect, useRef} from "react"

import {cn} from "@/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea"> & {autoSize?: boolean}>(
    ({className, autoSize = false, onChange, ...props}, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement | null>(null)

        // 处理输入变化
        const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (autoSize && textareaRef.current) {
                adjustHeight()
            }

            if (onChange) onChange(e)
        }

        // 调整 textarea 高度
        const adjustHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // 设置为内容的高度
            }
        }

        // 如果启用 autoSize，在初始渲染后调整高度
        useEffect(() => {
            if (autoSize && textareaRef.current) {
                adjustHeight()
            }
        }, [autoSize])

        return (
            <textarea
                className={cn(
                    "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                    autoSize && "resize-none overflow-hidden break-words"
                )}
                ref={(el) => {
                    textareaRef.current = el
                    if (typeof ref === "function") ref(el)
                    else if (ref) ref.current = el
                }}
                onChange={handleInputChange}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export {Textarea}
