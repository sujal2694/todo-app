import React from "react";
import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const Context = createContext(null);

const ContextProvider = (props) => {
    const url = "https://todo-app-backend-gamma-liard.vercel.app"
    const [currState, setCurrState] = useState("Sign Up");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [userData, setUserData] = useState(null); // New state for user data
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    // Decode user ID from JWT token
    const getUserIdFromToken = (jwtToken) => {
        if (!jwtToken) return null;
        try {
            const payload = jwtToken.split('.')[1];
            if (!payload) return null;
            const decoded = JSON.parse(atob(payload));
            return decoded.id || decoded._id || decoded.userId || null;
        } catch (error) {
            console.log("Token parse error:", error);
            return null;
        }
    };

    // Fetch user data from database
    const fetchUserData = async () => {
        if (!token) {
            setUserData(null);
            return;
        }

        try {
            const userId = getUserIdFromToken(token);
            if (!userId) {
                console.log("No user ID found in token");
                setUserData(null);
                return;
            }

            const response = await axios.post(`${url}/api/user/getuser`, { userId });
            
            if (response.data?.success) {
                setUserData(response.data.user);
                // Update the data state with user email
                setData(prev => ({
                    ...prev,
                    email: response.data.user.email || prev.email
                }));
            } else {
                console.log("Failed to fetch user data:", response.data?.message);
                setUserData(null);
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
            setUserData(null);
        }
    };

    // Fetch user data when token changes
    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setUserData(null);
        }
    }, [token]);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const contextValue = {
        url,
        currState,
        setCurrState,
        token,
        setToken,
        loading,
        setLoading,
        todos,
        setTodos,
        data,
        setData,
        userData,
        setUserData,
        getUserIdFromToken,
        fetchUserData
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;