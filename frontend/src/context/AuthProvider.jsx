import { useCallback, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(()=>Boolean(localStorage.getItem("token")))

    //fitur get user
    useEffect(()=> {
        const token = localStorage.getItem("token")

        if(!token) {
            return;
        }

        let active = true;

        async function fetchUser() {
            try {
                const response = await api.get("/user")
                if (active) {
                    setUser(response.data.user ?? response.data)
                }
            }
            catch {
                localStorage.removeItem("token")
                if(active) {
                    setUser(null)
                }
            }
            finally {
                if(active) {
                    setLoading(false)
                }
            }
        }
        fetchUser();

        return () => {
            active = false;
        }
    },[])

    //fitur login
    const login = useCallback(async(credentials)=> {
        const response = await api.post("/login", credentials)
        const {user, token} = response.data

        localStorage.setItem("token", token)
        setUser(user)

        return user;
    },[])

    //fitur register
    const register = useCallback(async(formData)=> {
        const response = await api.post("/register", formData)
        const {user, token} = response.data

        localStorage.setItem("token", token)
        setUser(user)

        return user;
    },[])

    //fitur logout
    const logout = useCallback(async()=> {
        try {
            if(localStorage.getItem("token")) {
                await api.post("/logout")
            }
        }
        finally {
            localStorage.removeItem("token")
            setUser(null)
        }
    },[])

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            register,
            logout
        }),
        [user,loading,login,register,logout]
    )

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}