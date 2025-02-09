import MainColumn from "@/components/module/common/MainColumn"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {ShellIcon} from "lucide-react"

const NotFound = () => {
    return (
        <MainColumn>
            <div className="mt-[20%] flex flex-col items-center justify-center gap-2">
                <div className="text-[80px]">
                    <ShellIcon />
                </div>
                <h2 className="text-2xl font-bold">页面不存在</h2>
                <Button asChild variant="link" className="text-blue-500">
                    <Link href="/">返回首页</Link>
                </Button>
            </div>
        </MainColumn>
    )
}

export default NotFound
