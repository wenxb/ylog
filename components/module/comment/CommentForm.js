"use client"
import {Avatar, Button, Input} from "@arco-design/web-react"
import {useImmer} from "use-immer"
import {cn} from "@/utils"

const CommentForm = ({onSubmit, className, loading, session}) => {
    const [dataForm, setDataForm] = useImmer({
        content: "",
    })

    const handleInputChange = (value) => {
        setDataForm((d) => {
            if (d.content.length < 200) {
                d.content = value
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
                <Avatar size={36}>
                    {session?.user?.image ? <img alt="" src={session?.user?.image}></img> : session?.user?.name}
                </Avatar>
            </div>
            <div className="flex-1">
                <div>
                    <div>
                        <Input.TextArea
                            autoSize={{minRows: 4}}
                            value={dataForm.content}
                            onChange={handleInputChange}
                            placeholder="说说你的看法"
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <div></div>
                        <Button type={"primary"} onClick={handleSubmit} disabled={!dataForm.content || loading}>
                            发布
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentForm
