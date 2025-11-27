import React from "react";
import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const Context = createContext(null);

const ContextProvider = (props) => {
    const url = "http://localhost:5000"
    const [currState, setCurrState] = useState("Sign Up");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
        }
    }, [])

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
    }


    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}


export default ContextProvider;