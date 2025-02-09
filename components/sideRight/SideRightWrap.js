"use client"
import MusicControl from "@/components/page/music/MusicControl"

const SideRightWrap = ({children, stickyWrap, showMusic = true}) => {
    return (
        <div className="ml-4 w-[var(--side-right-width)] gap-3 max-[1000px]:hidden max-2xl:w-[280px]">
            <div className={"sticky top-3 flex flex-col gap-3"}>
                {showMusic && <MusicControl />}
                {stickyWrap}
            </div>

            {children}
        </div>
    )
}

export default SideRightWrap
