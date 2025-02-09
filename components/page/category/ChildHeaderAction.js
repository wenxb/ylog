"use client"
import Auth from "@/utils/Auth"
import {Button} from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useAxios from "@/lib/api/useAxios"
import {useToast} from "@/hooks/use-toast"
import {useRouter} from "next/navigation"

const ChildHeaderAction = ({name}) => {
    const {toast} = useToast()
    const router = useRouter()

    const handleRemove = () => {
        useAxios
            .delete("/api/admin/category/deleteByName", {
                data: {name: name},
            })
            .then(() => {
                toast({
                    title: "删除成功",
                    variant: "info",
                })
                router.replace("/category")
            })
    }

    return Auth.isAdmin() ? (
        <div className="my-4 mr-4 ml-2 flex w-full">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-500">
                        删除此分类
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>删除{name}</AlertDialogTitle>
                        <AlertDialogDescription>此操作不可恢复，不会删除相关联的文章</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove}>确定</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    ) : null
}

export default ChildHeaderAction
