import {getSettingsByKeys} from "@/utils/server"

export const GET = async () => {
    try {
        const config = await getSettingsByKeys(["tool_enable", 'home_desc_mode', 'home_desc_text'])

        return Response.json(config)
    } catch (err) {
        console.error(err)
        return Response.error()
    }
}
