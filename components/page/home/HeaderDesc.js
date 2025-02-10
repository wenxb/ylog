import TypicalText from "@/components/common/TypicalText"
import {getSettingsByKeys} from "@/utils/server"

const HeaderDesc = async () => {
    const settings = await getSettingsByKeys(["home_desc_mode", "home_desc_text"])
    const type = settings.home_desc_mode
    const api_url = "https://v1.hitokoto.cn?c=c&encode=json"
    const customText = settings.home_desc_text ? settings.home_desc_text.split("\n") : []

    let text
    if (type === "one_api") {
        try {
            const json = await fetch(api_url, {
                next: {
                    revalidate: 3600,
                },
            }).then((res) => res.json())

            if (json?.hitokoto) {
                text = `"${json.hitokoto}"`
            }
            if (json?.from) {
                text += " - " + json.from
            }
            if (json?.from_who) {
                text += " · " + json.from_who
            }
        } catch (e) {
            text = null
            console.log(e)
        }
    }

    return (
        <div>
            {type === "one_api" && text && <p className={"text-foreground/60"}>{text}</p>}
            {type === "text" && <TypicalText className={"text-foreground/60"} text={customText} />}
        </div>
    )
}

export default HeaderDesc
