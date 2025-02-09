import {create} from "zustand"

const initialState = {
    showMobileSide: false,
    settings: {
        tool_enable: "true",
        home_desc_mode: "text",
        home_desc_text: "",
    },
}

export const useAppStore = create((set) => ({
    ...initialState,
    setShowMobileSide: (showMobileSide) => set({showMobileSide}),
    setSettings: (settings) => set({settings}),
}))
