import React from "react";
import { useAuth } from "./authContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../Pages/signIn_signUp/firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import { hostName } from "../Pages/signIn_signUp/firebase";

const Logout = () => {
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const signout = () => {

        signOut(auth).then(() => {
            const userData = JSON.parse(window.localStorage.getItem("userData"));
            let idToken = userData?.idToken

            axios.get(`${hostName}/revoke-token`, {
                headers: {
                    'IdToken': idToken,
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                window.localStorage.removeItem("userData");
                window.localStorage.clear();
                setIsAuthenticated(false);
                navigate("/login");
            }).catch((error) => {
                alert(error);
            })
        }).catch((error) => {
            console.log(error);
            alert("error signing out");
        });

    }



    return (
        <span className="text-white" style={{ cursor: "pointer" }} onClick={signout}>Logout</span >
    )
}

export default Logout;
