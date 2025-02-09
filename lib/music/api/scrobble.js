import request from "@/lib/music/request"
import {createOption} from "@/lib/music/util"

export default function (query) {
    const data = {
        logs: JSON.stringify([
            {
                action: "play",
                json: {
                    download: 0,
                    end: "playend",
                    id: query.id,
                    sourceId: query.sourceid,
                    time: query.time,
                    type: "song",
                    wifi: 0,
                    source: "list",
                    mainsite: 1,
                    content: "",
                },
            },
        ]),
    }

    return request(`/api/feedback/weblog`, data, createOption(query, "weapi"))
}
