"use client"
import {useEffect, useState} from "react"
import tocbot from "tocbot"
import "./PostToc.scss"
import {generateUniqueString} from "@/lib/db/util"

const contentSelector = "#article-content"
const PostToc = () => {
    const [hasHeadings, setHasHeadings] = useState(true)

    useEffect(() => {
        function init() {
            tocbot.init({
                tocSelector: "#side-toc",
                contentSelector,
                headingSelector: "h1, h2, h3, h4, h5, h6",
                collapseDepth: 2,
                scrollSmoothOffset: -54,
                headingsOffset: 54,
                activeLinkClass: "bg-accent",
            })
        }

        const checkHeadings = () => {
            const content = document.querySelector(contentSelector)
            const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6")
            const headingMap = {}

            Array.prototype.forEach.call(headings, function (heading) {
                const id = heading.id ? heading.id : generateUniqueString(6)
                headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0
                if (headingMap[id]) {
                    heading.id = id + "-" + headingMap[id]
                } else {
                    heading.id = id
                }
            })

            setHasHeadings(headings.length > 0)
        }

        checkHeadings()
        init()
        return () => tocbot.destroy()
    }, [])

    return (
        hasHeadings && (
            <div className={"relative overflow-hidden rounded-xl border"}>
                <div className={"px-3 pt-3 pb-2 text-xl font-bold"}>目录</div>
                <div className={"relative max-h-[400px] w-full overflow-y-auto"} id="side-toc"></div>
            </div>
        )
    )
}

export default PostToc
