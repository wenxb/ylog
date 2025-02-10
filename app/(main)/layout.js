import SideMenu from "@/components/sidebar/SideMenu"
import GlobalBottomNav from "@/components/module/common/GlobalBottomNav"

const Layout = ({children}) => {
    return (
        <>
            <div className="flex min-h-dvh w-full">
                <SideMenu />
                <div className="flex w-[1050px] grow max-xl:w-full">{children}</div>
                <GlobalBottomNav/>
            </div>
        </>
    )
}

export default Layout
