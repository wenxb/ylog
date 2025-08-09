import MainColumn from "@/components/module/MainColumn"
import Link from "next/link"
import {notFound} from "next/navigation"
import {getSettingsByKeys} from "@/utils/server"
import PageHeader from "@/components/module/PageHeader"
import {Avatar} from "@arco-design/web-react"

const ToolItem = ({tool, parentPath}) => {
    return (
        <li>
            <Link href={`/tools/${parentPath}/${tool.path}`} className={"flex rounded-2xl p-2 hover:bg-accent"}>
                <Avatar
                    className={"h-12 w-12 rounded-xl border bg-background dark:bg-foreground"}
                    src={tool.icon}
                />
                <div className={"ml-2"}>
                    <div className={"font-semibold"}>{tool.name}</div>
                    <div className={"mt-1 line-clamp-1 text-xs text-neutral-400"}>{tool.desc}</div>
                </div>
            </Link>
        </li>
    )
}

export const metadata = {
    title: "工具",
}

const Page = async () => {
    const settings = await getSettingsByKeys(["tool_enable"])

    if (settings.tool_enable === "false") {
        notFound()
    }

    return (
        <MainColumn>
            <PageHeader hideBack title="工具"></PageHeader>

            {/*<div className={"px-4"}>*/}
            {/*    {tools.data &&*/}
            {/*        tools.data.map((group) => (*/}
            {/*            <div key={group.key}>*/}
            {/*                <div className={"mb-4 mt-2 text-xl font-semibold"}>{group.title}</div>*/}
            {/*                <ul className={"-mx-2 mb-4 grid grid-cols-2 gap-4"}>*/}
            {/*                    {group.tools.map((tool) => (*/}
            {/*                        <ToolItem parentPath={group.key} key={tool.path} tool={tool} />*/}
            {/*                    ))}*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*</div>*/}
        </MainColumn>
    )
}

export default Page
