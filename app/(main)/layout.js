import SideMenu from "@/components/sidebar/SideMenu"
import GlobalBottomNav from "@/components/module/GlobalBottomNav"

const Layout = ({children}) => {
    return (
        <>
            <div className="flex min-h-dvh w-full">
                <SideMenu />
                <div className="z-[1] flex w-[1050px] grow max-xl:w-full">{children}</div>
                <GlobalBottomNav />
            </div>
        </>
    )
}

export default Layout
