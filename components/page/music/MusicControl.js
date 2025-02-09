"use client"
import {Slider} from "@/components/ui/slider"
import {Button} from "@/components/ui/button"
import {
    LyricsLine,
    PauseFill,
    PlayArrowFill,
    SkipNextFill,
    SkipPreviousFill,
    VolumeDownFill,
    VolumeUpFill,
} from "@/components/common/icons"
import {changePlayIndex, playOrPause, setPlayed, setSeek, setVolume} from "@/lib/musicPlayer"
import {useCallback, useEffect, useRef, useState} from "react"
import {debounce} from "lodash"
import {RepeatIcon} from "lucide-react"
import {cn} from "@/utils"
import LoadingBox from "@/components/common/LoadingBox"
import {useMusicDataStore, useMusicStateStore} from "@/stores/music"

const MusicControl = () => {
    const playSong = useMusicDataStore((state) => state.playSongData)
    const musicState = useMusicStateStore()
    const [sliderValue, setSliderValue] = useState([0])
    const canSliderRef = useRef(true)
    const isPlaying = useMusicStateStore((state) => state.isPlaying)
    const isLoading = useMusicStateStore((state) => state.isLoading)

    useEffect(() => {
        if (canSliderRef.current && musicState.playTimeData?.bar) {
            setSliderValue([musicState.playTimeData?.bar])
        }
    }, [musicState.playTimeData?.bar])

    // 更新进度条
    const songTimeSliderUpdate = (val) => {
        if (musicState.playTimeData?.duration) {
            const currentTime = (musicState.playTimeData.duration / 100) * val[0]
            setPlayed(currentTime)
            setSeek(currentTime)
        }
    }

    const changePlayIndexDebounce = useCallback(
        debounce(async (type) => {
            await changePlayIndex(type, true)
        }, 300),
        []
    )

    const handleChangePlayIndex = (type) => {
        changePlayIndexDebounce(type)
    }

    return (
        playSong?.id && (
            <div className={"relative w-full overflow-hidden rounded-xl border p-4"}>
                <LoadingBox
                    className={cn(
                        "pointer-events-none invisible absolute inset-0 z-5 bg-background opacity-100",
                        isLoading && "pointer-events-auto visible opacity-100"
                    )}
                />
                <div className={"relative z-1 w-full"}>
                    <div className={"flex items-center"}>
                        <div className={"h-14 w-14 min-w-14 overflow-hidden rounded-full border-2 select-none"}>
                            <img
                                className={"pointer-events-none h-full w-full object-cover"}
                                src={playSong?.cover}
                                alt=""
                            />
                        </div>
                        <div className={"ml-2.5"}>
                            <div className={"line-clamp-1 text-lg font-semibold"}>{playSong.name}</div>
                            {playSong.avatar && (
                                <div className={"line-clamp-1 text-foreground/60"}>
                                    {playSong.avatar.map((avatar, i) => (
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
                    <div className={"mt-3"}>
                        <Slider
                            onPointerDown={() => (canSliderRef.current = false)}
                            onPointerUp={() => (canSliderRef.current = true)}
                            onValueChange={(value) => setSliderValue(value)}
                            onValueCommit={songTimeSliderUpdate}
                            value={sliderValue}
                            min={0}
                            max={100}
                            step={0.1}
                        />

                        <div
                            className={
                                "mt-1 flex min-h-4 w-full items-center justify-between text-xs text-neutral-400 select-none"
                            }
                        >
                            <span>{musicState.playTimeData?.played}</span>
                            <span>{musicState.playTimeData?.durationTime}</span>
                        </div>
                    </div>
                    <div className={"-mt-1 flex items-center justify-around gap-2"}>
                        <div>
                            <RepeatIcon className="size-4" />
                        </div>
                        <div className={"flex items-center"}>
                            <Button
                                onClick={() => handleChangePlayIndex("prev")}
                                className={"h-11 w-11 text-3xl"}
                                size="icon"
                                variant="ghost"
                            >
                                <SkipPreviousFill />
                            </Button>
                            <Button onClick={playOrPause} className={"h-14 w-14 text-5xl"} size="icon" variant="ghost">
                                {isPlaying ? <PauseFill /> : <PlayArrowFill />}
                            </Button>
                            <Button
                                onClick={() => handleChangePlayIndex("next")}
                                className={"h-11 w-11 text-3xl"}
                                size="icon"
                                variant="ghost"
                            >
                                <SkipNextFill />
                            </Button>
                        </div>
                        <div>
                            <LyricsLine
                                onClick={() => musicState.setShowYrlics(!musicState.showYrlics)}
                                className={cn("cursor-pointer text-lg", musicState.showYrlics && "text-blue-500")}
                            />
                        </div>
                    </div>
                    <div className={"mt-3 flex w-full items-center justify-between"}>
                        <span className={"text-2xl text-foreground/50"}>
                            <VolumeDownFill />
                        </span>
                        <div className={"mx-3 grow"}>
                            <Slider
                                value={[musicState.playVolume]}
                                onValueChange={(value) => setVolume(value[0])}
                                max={1}
                                min={0}
                                step={0.01}
                            />
                        </div>
                        <span className={"text-2xl text-foreground/50"}>
                            <VolumeUpFill />
                        </span>
                    </div>
                </div>
            </div>
        )
    )
}

export default MusicControl
