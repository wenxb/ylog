"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {useImmer} from "use-immer"
import {cn} from "@/utils"

const CommentForm = ({onSubmit, className, loading, session}) => {
    const [dataForm, setDataForm] = useImmer({
        content: "",
    })

    const handleInputChange = (e) => {
        setDataForm((d) => {
            if (d.content.length < 200) {
                d.content = e.target.value
            }
        })
    }

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(dataForm)
        }

        setDataForm((d) => {
            d.content = ""
        })
    }

    return (
        <div className={cn("flex gap-2", className)}>
            <div>
                <Avatar>
                    <AvatarImage src={session?.user?.image}></AvatarImage>
                    <AvatarFallback>{session?.user?.name}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1">
                <div>
                    <div>
                        <Textarea
                            autoSize
                            value={dataForm.content}
                            onChange={handleInputChange}
                            className="min-h-[70px] w-full border-none py-1.5 pl-0 text-xl focus-visible:ring-0"
                            placeholder="说说你的看法"
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <div></div>
                        <Button onClick={handleSubmit} disabled={!dataForm.content || loading}>
                            发布
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentForm
