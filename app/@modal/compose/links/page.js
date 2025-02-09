"use client"
import {useRouter} from "next/navigation"
import {useState} from "react"

const Page = () => {
    const router = useRouter()
    const [open, setOpen] = useState(true)

    const handleClose = (v) => {
        if (!v) setOpen(false)
        router.back()
    }

    return <div></div>
}

export default Page
