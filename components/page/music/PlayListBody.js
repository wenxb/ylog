import LoadingBox from "@/components/common/LoadingBox"
import MusicList from "@/components/lists/MusicList"
import {Button} from "@arco-design/web-react"

const PlayListBody = ({loading, songs, count, isLoadingMore, onLoadMore}) => {
    return (
        <div className={"pb-10"}>
            <LoadingBox loading={!songs || loading}>
                {songs && <MusicList data={songs} />}
                <div className={"mt-6 flex justify-center"}>
                    {songs?.length < count && !loading && (
                        <Button disabled={isLoadingMore} onClick={onLoadMore}>
                            {isLoadingMore ? "加载中..." : "加载更多"}
                        </Button>
                    )}
                </div>
            </LoadingBox>
        </div>
    )
}

export default PlayListBody
