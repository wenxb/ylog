"use client"
import {MusicNoteFill, PlayArrowFill} from "@/components/common/icons"
import {playSong} from "@/lib/musicPlayer"
import {cn} from "@/utils"
import {useMusicDataStore} from "@/stores/music"

const MusicItem = ({item, num, onClick, isPlayActive}) => {
    return (
        <div
            onClick={() => onClick(item.id)}
            className={
                "group grid cursor-pointer grid-cols-12 items-center px-4 py-3 transition-colors hover:bg-accent max-sm:px-2"
            }
        >
            <div className={"col-span-1 min-w-8"}>
                <span className={cn("pl-1.5 text-foreground/60 group-hover:hidden", isPlayActive && "hidden")}>
                    {num + 1}
                </span>
                <span className={cn("-ml-1 hidden group-hover:flex max-sm:-ml-0.5", isPlayActive && "flex")}>
                    {isPlayActive ? (
                        <MusicNoteFill className={"mt-1.5 ml-0.5 animate-bounce text-2xl text-blue-500"} />
                    ) : (
                        <PlayArrowFill className={cn("text-3xl text-blue-500")} />
                    )}
                </span>
            </div>
            <div className="col-span-6 -ml-2 max-sm:ml-0 flex">
                <div className={"h-10 w-10 min-w-10 overflow-hidden rounded-md bg-accent"}>
                    <img className={"pointer-events-none h-full w-full object-cover"} src={item.cover} alt="" />
                </div>
                <div className={"ml-2 flex min-w-24 flex-col justify-center"}>
                    <div className={"line-clamp-1"}>{item.name}</div>
                    {item.avatar && (
                        <div className={"line-clamp-1 text-sm text-foreground/60"}>
                            {item.avatar.map((avatar, i) => (
                                <span
                                    key={avatar.id || i}
                                    className={"not-last-child:after:content-['/'] not-last-child:after:mx-1"}
                                >
                                    {avatar.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={"col-span-3 mx-2 line-clamp-1 flex-1 text-[14px] text-foreground/50"}>
                {item.album.name}
            </div>
            <div className={"col-span-2 min-w-10 text-center text-[14px] text-foreground/50"}>
                {item.duration}
            </div>
        </div>
    )
}

const MusicList = ({data = []}) => {
    const currentPlaySong = useMusicDataStore((state) => state.playSongData)

    const handleItemClick = async (id) => {
        await playSong(data, id)
    }

    return (
        <div>
            {data.map((item, i) => (
                <MusicItem
                    onClick={handleItemClick}
                    isPlayActive={currentPlaySong?.id === item.id}
                    item={item}
                    key={item.id}
                    num={i}
                />
            ))}
        </div>
    )
}

export default MusicList
