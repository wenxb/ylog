"use client"
import {useRouter} from "next/navigation"
import {PlayArrowFill} from "@/components/common/icons"
import {Button} from "@arco-design/web-react"
import axios from "axios"
import {playAllSongs} from "@/lib/musicPlayer"

export const PlayListItem = ({onClick, cover, title, desc, id}) => {
    const handlePlayPlaylist = (e) => {
        e.stopPropagation()

        if (!id) return
        axios({
            method: "get",
            url: "/api/music/playlistSongs",
            params: {
                id,
                limit: 200,
                offset: 0,
            },
        }).then(async (res) => {
            await playAllSongs(res.data)
        })
    }

    return (
        <div onClick={onClick} className={"group flex cursor-pointer items-center px-4 py-2.5 hover:bg-accent"}>
            <div className={"flex grow"}>
                <div className={"aspect-square w-12 overflow-hidden rounded-lg border bg-accent"}>
                    <img src={cover} alt={title} className={"pointer-events-none h-full w-full"} />
                </div>
                <div className={"ml-2 flex flex-col justify-center"}>
                    <div className={"line-clamp-1 font-semibold"}>{title}</div>
                    {desc && <div className={"line-clamp-1 text-gray-500 dark:text-foreground/60"}>{desc}</div>}
                </div>
            </div>
            {id && (
                <div className={"pr-4 max-sm:hidden max-sm:pointer-events-none"}>
                    <Button
                        onClick={handlePlayPlaylist}
                        className={"opacity-0 group-hover:opacity-100 hover:bg-blue-500/10"}
                        shape="circle"
                        type="text"
                    >
                        <PlayArrowFill className={"text-2xl text-blue-500"} />
                    </Button>
                </div>
            )}
        </div>
    )
}

const PlayList = ({data = []}) => {
    const router = useRouter()
    const handleItemClick = (id) => {
        if (!id) return
        router.push(`/music/playlist/${id}`)
    }

    return (
        <div>
            {data.map((item, i) => (
                <PlayListItem
                    id={item.id}
                    title={item.title}
                    desc={item?.desc}
                    cover={item.cover}
                    onClick={() => handleItemClick(item.id)}
                    key={i}
                />
            ))}
        </div>
    )
}

export default PlayList
