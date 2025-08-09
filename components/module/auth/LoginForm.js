"use client"
import {Button} from "@/components/ui/button"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {MailIcon} from "lucide-react"

const LoginForm = () => {
    const formSchema = z.object({
        email: z.string().email(),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {}

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>邮件地址</FormLabel>
                            <FormControl>
                                <Input placeholder="输入邮箱" {...field} />
                            </FormControl>
                            <FormDescription>未注册将收到一封电子邮件，然后进行登录</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <Button type="submit">
                        <MailIcon />
                        继续
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default LoginForm
