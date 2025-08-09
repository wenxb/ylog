import MainColumn from "@/components/module/MainColumn"
import Link from "next/link"
import {ShellIcon} from "lucide-react"
import {Button} from "@arco-design/web-react"

const NotFound = () => {
    return (
        <MainColumn>
            <div className="mt-[20%] flex flex-col items-center justify-center gap-2">
                <div className="text-[80px]">
                    <ShellIcon />
                </div>
                <h2 className="text-2xl font-bold">页面不存在</h2>
                <Link href="/">
                    <Button type="text" className="text-blue-500">
                        返回首页
                    </Button>
                </Link>
            </div>
        </MainColumn>
    )
}

export default NotFound
