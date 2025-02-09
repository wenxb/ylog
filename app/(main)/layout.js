import SideMenu from "@/components/sidebar/SideMenu"

const Layout = ({children}) => {
    return (
        <>
            <div className="flex min-h-dvh w-full">
                <SideMenu />
                <div className="flex w-[1050px] grow max-xl:w-full">{children}</div>
            </div>
        </>
    )
}

export default Layout
