"use client"
import {useEffect} from "react"

const DynamicScript = ({src}) => {
    useEffect(() => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [src])

    return null
}

export default DynamicScript
