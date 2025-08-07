import { createContext, useContext, useEffect, useState } from "react";
import { checkLoginUser, signinUserApi } from "../utils/apiService";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await checkLoginUser();
                if (res.data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUserData(res.data.userDetails);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        }
        checkLogin();

    }, [])
    const login = async (formData) => {
        const res = await signinUserApi(formData); 
        if (res.data.token) {
            localStorage.setItem("token", "Bearer "+res.data.token);
            setIsLoggedIn(true); 
            setUserData(res.data.userDetails);
            window.location.replace("/");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setUserData(null);
        window.location.replace("/");
    };

    const value = { isLoggedIn, userData, login, logout, isLoading }; 

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
export const UseAuth = () => useContext(AuthContext); 