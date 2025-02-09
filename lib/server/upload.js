import axios from "axios"
import NodeFormData from "form-data"
import {getSettingsByKeys} from "@/utils/server"

export const uploadMedia = async (file, option = {}, isNode = true) => {
    const config = await getSettingsByKeys(["image_api_url", "image_api_key", "image_album_id"])
    try {
        const api = config.image_api_url
        const album_id = config.image_album_id

        let form = new FormData()
        if (isNode) {
            form = new NodeFormData()
        }
        form.append("source", file, isNode ? {...option} : file.name)

        if (album_id) {
            form.append("album_id", album_id)
        }
        const res = await axios.post(api, form, {
            headers: {
                "X-API-Key": config.image_api_key,
            },
        })
        return res.data?.image.url
    } catch (err) {
        console.error(err)
        return null
    }
}
