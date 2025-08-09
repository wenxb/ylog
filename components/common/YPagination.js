"use client"
import {Pagination} from "@arco-design/web-react"
import {usePathname, useRouter} from "next/navigation"

const YPagination = ({page, pageSize, count}) => {
    const totalPages = Math.ceil(count / pageSize)
    if (page > totalPages) page = 1
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = (p) => {
        let url = `${pathname}?page=${p}`
        if (p === 1) {
            url = pathname
        }
        router.push(url)
    }

    return (
        <Pagination
            current={page}
            pageSize={pageSize}
            total={count}
            onChange={handleClick}
        />
    )
}

export default YPagination
