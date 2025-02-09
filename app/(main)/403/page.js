import React from "react"
import MainColumn from "@/components/module/common/MainColumn"
import {Button} from "@/components/ui/button"
import Link from "next/link"

const Page = () => {
    return (
        <MainColumn>
            <div className="relative top-[5%] flex w-full flex-col items-center justify-center py-10">
                <div className="text-5xl font-semibold">403</div>
                <div className="mt-1">您没有权限访问此页面</div>
                <Button asChild className="mt-5">
                    <Link href="/">返回首页</Link>
                </Button>
            </div>
        </MainColumn>
    )
}

export default Page
