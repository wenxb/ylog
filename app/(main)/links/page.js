import React from "react"
import MainColumn from "@/components/module/common/MainColumn"
import PageHeader from "@/components/module/common/PageHeader"

export const metadata = {
    title: "导航链接",
}
const Page = () => {
    return (
        <>
            <MainColumn>
                <PageHeader hideBack title="导航" />
            </MainColumn>
        </>
    )
}

export default Page
