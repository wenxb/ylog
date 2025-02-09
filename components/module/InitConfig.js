"use client"
import {useEffect} from "react"
import useAxios from "@/lib/api/useAxios"
import {useAppStore} from "@/stores/app"

const InitConfig = () => {
    const appStore = useAppStore()

    useEffect(() => {
        function getConfig() {
            useAxios.get("/api/settings").then((res) => {
                if (res.data) {
                    appStore.setSettings(res.data)
                }
            })
        }

        getConfig()
    }, [])

    return null
}

export default InitConfig
