import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";

export const userContext = createContext();

export function UserContextProvider({children}){
    
    const [user,setUserState] = useState(null);
    const [loadingUser,setLoadingUser] = useState(true);
    const userUpdateVersion = useRef(0);

    const setUser = (nextUser) => {
        userUpdateVersion.current += 1;
        setUserState(nextUser);
    };

    useEffect(() => {
        const requestVersion = userUpdateVersion.current;
        axios.get("/api")
        .then((res) => {
            if(userUpdateVersion.current === requestVersion){
                setUserState(res.data.user ?? null);
            }
        })
        .catch((e) => {
            console.log("Server Error Request not served properly !! : " + e)
        })
        .finally(() => {
            setLoadingUser(false);
        })
    },[])

    const logout = async () => {
        try{
            await axios.post("/api/user/logout");
            setUser(null);
        }
        catch(error){
            console.error("Logout Failed : ", error);
        }
    }

    return (
        <userContext.Provider value={{user,setUser,logout,loadingUser}}>
            {children}
        </userContext.Provider>
    );
}