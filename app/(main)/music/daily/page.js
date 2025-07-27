"use client"
import MainColumn from "@/components/module/MainColumn"
import PageHeaderWrap from "@/components/module/PageHeaderWrap"
import PlayListHeader from "@/components/page/music/PlayListHeader"
import useSWR from "swr"
import PlayListBody from "@/components/page/music/PlayListBody"
import {playAllSongs} from "@/lib/musicPlayer"

const Page = () => {
    const {data, isLoading} = useSWR("/api/music/getDaily")

    return (
        <MainColumn>
            <PageHeaderWrap barSlot={<div className="text-xl font-bold">{data?.title}</div>} scrollShowBarSlot>
                <PlayListHeader onPlayAll={() => playAllSongs(data?.songs)} loading={isLoading} data={data} />
            </PageHeaderWrap>
            <PlayListBody songs={data?.songs} count={data?.songsCount} loading={isLoading} />
        </MainColumn>
    )
}

export default Page
