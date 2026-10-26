import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "https://taskly-production-2b88.up.railway.app/api",
    headers: {
        Accept: "application/json",
        "Content-Type" : "application/json"
    },
})

api.interceptors.request.use((config)=> {
    const token = localStorage.getItem("token")

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api;