import request from "@/lib/music/request"
import CryptoJS from "crypto-js"
import fs from "node:fs"
import path from "node:path"
import {createOption} from "@/lib/music/util"

const ID_XOR_KEY_1 = "3go8&$8*3*3h0k(2)2"
const deviceidText = fs.readFileSync(path.resolve(__dirname, "../deviceid.txt"), "utf-8")

const deviceidList = deviceidText.split("\n")

function getRandomFromList(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function cloudmusic_dll_encode_id(some_id) {
    let xoredString = ""
    for (let i = 0; i < some_id.length; i++) {
        const charCode = some_id.charCodeAt(i) ^ ID_XOR_KEY_1.charCodeAt(i % ID_XOR_KEY_1.length)
        xoredString += String.fromCharCode(charCode)
    }
    const wordArray = CryptoJS.enc.Utf8.parse(xoredString)
    const digest = CryptoJS.MD5(wordArray)
    return CryptoJS.enc.Base64.stringify(digest)
}

export async function register_anonymous(query) {
    const deviceId = getRandomFromList(deviceidList)
    global.deviceId = deviceId
    const encodedId = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(`${deviceId} ${cloudmusic_dll_encode_id(deviceId)}`)
    )
    const data = {
        username: encodedId,
    }
    let result = await request(`/api/register/anonimous`, data, createOption(query, "weapi"))
    if (result.body.code === 200) {
        result = {
            status: 200,
            body: {
                ...result.body,
                cookie: result.cookie.join(";"),
            },
            cookie: result.cookie,
        }
    }
    return result
}
