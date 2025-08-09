import React from "react"
import MainColumn from "@/components/module/MainColumn"
import Link from "next/link"
import {Button} from "@arco-design/web-react"

const Page = () => {
    return (
        <MainColumn>
            <div className="relative top-[5%] flex w-full flex-col items-center justify-center py-10">
                <div className="text-5xl font-semibold">403</div>
                <div className="mt-1">您没有权限访问此页面</div>
                <Link href="/">
                    <Button className="mt-5">返回首页</Button>
                </Link>
            </div>
        </MainColumn>
    )
}

export default Page
