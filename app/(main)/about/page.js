import MainColumn from "@/components/module/MainColumn"
import PageHeaderWrap from "@/components/module/PageHeaderWrap"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {SiBilibili, SiFacebook, SiGithub, SiX} from "@icons-pack/react-simple-icons"
import {LinkIcon, MailIcon} from "lucide-react"
import {getAdminUser, getSettingsByKeys} from "@/utils/server"
import AboutBody from "@/content/page/about.mdx"
import {connection} from "next/server"

const Page = async () => {
    await connection()
    const config = await getSettingsByKeys([
        "social_github",
        "social_facebook",
        "social_email",
        "social_x",
        "social_bilibili",
    ])
    const user = await getAdminUser()

    const socialIcons = Object.keys(config).map((key, index) => {
        let icon
        switch (key) {
            case "social_github":
                icon = <SiGithub />
                break
            case "social_facebook":
                icon = <SiFacebook />
                break
            case "social_x":
                icon = <SiX />
                break
            case "social_email":
                icon = <MailIcon />
                break
            case "social_bilibili":
                icon = <SiBilibili />
                break
            default:
                icon = <LinkIcon />
        }
        if (!config[key]) return null

        return (
            <Button className={"h-10 w-10 text-xl"} key={index} asChild variant={"ghost"} size={"icon"}>
                <Link href={config[key]} target={"_blank"}>
                    {icon}
                </Link>
            </Button>
        )
    })

    return (
        <MainColumn>
            <PageHeaderWrap hideBar>
                <div className={"w-full flex-1"}>
                    <div>
                        <div className={"relative w-1/5 min-w-12 overflow-hidden rounded-full"}>
                            <div className={"pb-[100%]"}></div>
                            <div className={"absolute inset-0 h-full w-full bg-accent"}>
                                <img
                                    className={"h-full w-full"}
                                    src={user?.image || "/img/default-avatar.jpg"}
                                    alt="about me"
                                />
                            </div>
                        </div>
                        <div className={"mt-4"}>
                            <div className={"text-3xl font-semibold"}>{user?.name || "About me"}</div>
                        </div>
                    </div>
                    <div className={"-mx-2 mt-4"}>
                        <div className={"flex items-center"}>{socialIcons}</div>
                    </div>
                </div>
            </PageHeaderWrap>
            <article className={"prose p-4"}>
                <AboutBody />
            </article>
        </MainColumn>
    )
}

export default Page
