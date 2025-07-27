import SideRightWrap from "@/components/sideRight/SideRightWrap"
import SideLyric from "@/components/page/music/SideLyric"

export const metadata = {
    title: "音乐",
}
const Layout = ({children}) => {
    return (
        <div className={"flex max-xl:w-full"}>
            <div className={"flex-1"}>{children}</div>
            <SideRightWrap stickyWrap={<SideLyric />}></SideRightWrap>
        </div>
    )
}

export default Layout
