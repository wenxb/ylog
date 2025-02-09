"use client"
import {useEffect, useState} from "react"
import {cloneDeep} from "lodash"
import {useMusicDataStore, useMusicStateStore} from "@/stores/music"

const SideLyric = () => {
    const playSongId = useMusicDataStore((state) => state.playSongData?.id)
    const playSongLyric = useMusicDataStore((state) => state.playSongLyric)
    const [lyricLines, setLyricLines] = useState([])
    const isPlaying = useMusicStateStore((state) => state.isPlaying)
    const currentTime = useMusicStateStore((state) => state.currentTime)
    const showYrlics = useMusicStateStore((state) => state.showYrlics)

    useEffect(() => {
        const lyrics = playSongLyric.hasYrc ? playSongLyric.yrc : playSongLyric.lrc
        if (lyrics.length) {
            setLyricLines(cloneDeep(lyrics))
        }
    }, [playSongId, playSongLyric])

    return showYrlics && lyricLines.length ? (
        <div
            style={{
                "--amll-lyric-player-font-size": "1.4em",
            }}
            className={"relative mt-4 h-[350px] w-full max-w-full overflow-hidden rounded-xl border"}
        ></div>
    ) : null
}

export default SideLyric
