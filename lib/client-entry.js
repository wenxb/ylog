"use client"

import ReactDOM from "react-dom/client"
import {setCreateRoot} from "@arco-design/web-react/es/_util/react-dom"

// 只执行一次初始化
setCreateRoot(ReactDOM.createRoot)

const ClientEntry = ({children}) => {
    return children
}

export default ClientEntry