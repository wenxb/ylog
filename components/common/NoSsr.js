"use client"
import {useEffect, useState} from "react"

const NoSsr = ({children, fallback = null}) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        // 在组件挂载后标记为客户端渲染
        setIsClient(true)
    }, [])

    if (!isClient) {
        // 服务端渲染时返回占位内容或空
        return fallback
    }

    return <>{children}</>
}

export default NoSsr
