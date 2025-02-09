import axios from "axios"

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8"
const instance = axios.create({
    withCredentials: true,
    timeout: 50000,
})

instance.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"]
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (err) => {
        const msg = err.response?.data?.error || "请求失败: " + err.status
        return Promise.reject(msg)
    }
)

export default instance
