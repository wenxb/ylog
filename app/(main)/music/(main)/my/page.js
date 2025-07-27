"use client"
import PlayList, {PlayListItem} from "@/components/lists/PlayList"
import SectionTitle from "@/components/module/SectionTitle"
import useSWR from "swr"
import {useRouter} from "next/navigation"
import LoadingBox from "@/components/common/LoadingBox"

const Page = () => {
    const router = useRouter()
    const {data: pageData, isLoading} = useSWR("/api/music/myPlaylist")

    return (
        <>
            <LoadingBox loading={isLoading}>
                <>
                    <SectionTitle>我的歌单</SectionTitle>
                    {pageData?.like && (
                        <div>
                            <PlayListItem
                                cover={pageData.like.cover}
                                title={pageData.like.title}
                                onClick={() => router.push("/music/like")}
                            />
                            <PlayListItem
                                cover={
                                    "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg?param=300y300"
                                }
                                title={"我的云盘"}
                                onClick={() => router.push("/music/cloud")}
                            />
                        </div>
                    )}
                    {pageData?.create && pageData?.create?.length > 0 && (
                        <>
                            <SectionTitle>创建的歌单</SectionTitle>
                            <PlayList data={pageData?.create} />
                        </>
                    )}
                    {pageData?.favorite && pageData?.favorite?.length > 0 && (
                        <>
                            <SectionTitle>收藏的歌单</SectionTitle>
                            <PlayList data={pageData?.favorite} />
                        </>
                    )}
                </>
            </LoadingBox>
        </>
    )
}

export default Page
