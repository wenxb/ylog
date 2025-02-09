import {Button} from "@/components/ui/button"
import LoadingBox from "@/components/common/LoadingBox"

const PlayListHeader = ({data, loading, onPlayAll}) => {
    return <LoadingBox loading={loading}>
        {
            data && (
                <div className={"flex w-full grow gap-3 max-sm:flex-col max-sm:items-center max-sm:pb-1 max-sm:gap-1"}>
                    <div className={"aspect-square w-38 overflow-hidden rounded-xl border"}>
                        <img className={"h-full w-full object-cover"} src={data?.cover} alt="" />
                    </div>
                    <div className={"flex h-auto flex-1 flex-col justify-between max-sm:items-center max-sm:mt-3"}>
                        <div className={"text-2xl font-bold"}>{data?.title}</div>
                        <div className={"my-1 line-clamp-1 text-foreground/60"} title={data.description}>
                            {data.description}
                        </div>
                        <p className={"text-sm text-foreground/50"}>{`总共${data?.songsCount}首歌曲`}</p>
                        <div className={"mt-auto pt-2"}>
                            <Button onClick={onPlayAll}>播放全部</Button>
                        </div>
                    </div>
                </div>
            )
        }
    </LoadingBox>
}

export default PlayListHeader
