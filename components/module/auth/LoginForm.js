"use client"
import {Form, Input, Button} from "@arco-design/web-react"
import {MailIcon} from "lucide-react"

const LoginForm = () => {
    const [form] = Form.useForm()

    const onSubmit = (values) => {}

    return (
        <Form form={form} onSubmit={onSubmit} layout="vertical" className="space-y-8">
            <Form.Item
                field="email"
                label="邮件地址"
                rules={[{type: "email", required: true}]}
                extra="未注册将收到一封电子邮件，然后进行登录"
            >
                <Input placeholder="输入邮箱" />
            </Form.Item>
            <div className="flex justify-center">
                <Button htmlType="submit">
                    <MailIcon />
                    继续
                </Button>
            </div>
        </Form>
    )
}

export default LoginForm
