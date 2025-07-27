import Link from "next/link"
import MainColumn from "@/components/module/MainColumn"

export default function NotFound() {
    return (
        <MainColumn>
            <div className={"relative top-[15%] flex w-full flex-col items-center justify-center px-4"}>
                <div className={"flex h-full flex-col items-start justify-center"}>
                    <h2 className={"text-2xl"}>出现了错误</h2>
                    <p className={"py-4"}>无法找到播放列表</p>
                    <Link href="/music" className={"border-b border-blue-500"}>
                        返回音乐
                    </Link>
                </div>
            </div>
        </MainColumn>
    )
}
