"use client"
import PlayList, {PlayListItem} from "@/components/lists/PlayList"
import SectionTitle from "@/components/module/SectionTitle"
import useSWR from "swr"
import {useRouter} from "next/navigation"
import LoadingBox from "@/components/common/LoadingBox"
import {RefreshCcwIcon} from "lucide-react"
import {Button, Tooltip} from "@arco-design/web-react"
import {useCallback} from "react"
import {debounce} from "lodash"

const Page = () => {
    const router = useRouter()

    const {data: privateData, isLoading: privateLoading, error} = useSWR("/api/music/privateList")
    const {data: resourceData, isLoading: resourceLoading, error: error1, mutate} = useSWR("/api/music/resourceList")

    const handleClick = (type) => {
        if (type === "daily") {
            router.push("/music/daily")
        } else if (type === "radar") {
            router.push("/music/radar")
        }
    }

    const updateResourceDe = useCallback(
        debounce(() => mutate(), 300),
        []
    )

    const handleRefresh = () => {
        updateResourceDe()
    }

    return (
        <>
            <SectionTitle>私人歌单</SectionTitle>
            <LoadingBox noBg={false} loading={privateLoading}>
                {privateData && !error && (
                    <div>
                        {privateData.map((item, index) => (
                            <PlayListItem
                                id={item?.id}
                                onClick={() => handleClick(item.type)}
                                key={index}
                                desc={item?.desc}
                                title={item.title}
                                cover={item.cover}
                            />
                        ))}
                    </div>
                )}
            </LoadingBox>
            <div className={"my-3 flex w-full items-center justify-between px-4"}>
                <div className={"text-xl font-bold"}>推荐歌单</div>
                <Tooltip content="刷新推荐">
                    <Button onClick={handleRefresh} type="text" shape="circle">
                        <RefreshCcwIcon className={"text-foreground/60"} />
                    </Button>
                </Tooltip>
            </div>
            <LoadingBox loading={resourceLoading}>
                {resourceData && !error && <PlayList data={resourceData} />}
            </LoadingBox>
        </>
    )
}

export default Page
