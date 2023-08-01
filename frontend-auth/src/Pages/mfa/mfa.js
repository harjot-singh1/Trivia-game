import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./mfa.css";
import axios from "axios";
import { useAuth } from "../../components/authContext";
import { hostName } from "../signIn_signUp/firebase";

const Mfa = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const ques = ["Where is your home town?", "What is month of your birth?", "Which is your favourite destination country?"];
    const ans = ["", "", ""];
    const [url, setUrl] = useState(location.pathname);

    const [index] = useState(Math.floor(Math.random() * 3));

    const { setIsAuthenticated } = useAuth();

    useEffect(() => {
        setUrl(location.pathname);
    });

    const submitmfa = (event) => {
        const userData = JSON.parse(window.localStorage.getItem("userData"));
        let data = {
            email: userData?.email,
        }
        event.preventDefault();
        if (data.email) {
            if (url === "/createmfa") {

                for (let i = 0; i < 3; i++) {
                    data[ques[i]] = ans[i];
                }
                const url = `${hostName}/add-mfa`;
                axios.post(url, data).then((res) => {
                    alert("mfa creation successfull");
                    navigate("/login");
                }).catch((error) => {
                    alert(error);
                });

            } else {
                data[ques[index]] = ans[index];
                axios.post(`${hostName}/verify-mfa`, data).then((res) => {
                    setIsAuthenticated(true);
                    var user = JSON.parse(window.localStorage.getItem("userData"))
                    if(user.email == "kadivarnand007@gmail.com"){
                        navigate("/admin/home");
                    }else {
                        navigate("/game-lobby");
                    }
                }).catch((error) => {
                    alert(error);
                })
            }
        } else {
            alert("error while locating userData");
            setIsAuthenticated(false);
        }

    }

    return (
        <div className="container-fluid mfa-container">
            <div className="row h-100">
                <div className="col-5 offset-7 p-5  mfa-panel">
                    <form id="mfa-form" onSubmit={submitmfa}>
                        {url === "/createmfa" ? (<div className="input-container">
                            <h1>Create MFA</h1>
                            <label htmlFor="q1">{ques[0]}</label>
                            <input
                                type="text"
                                id="q1"

                                onChange={(event) => {
                                    ans[0] = (event.target.value);
                                }}
                            />
                            <label htmlFor="q2">{ques[1]}</label>
                            <input
                                type="text"
                                id="q2"

                                onChange={(event) => {
                                    ans[1] = (event.target.value);
                                }}

                            />
                            <label htmlFor="q3">{ques[2]}</label>
                            <input
                                type="text"
                                id="q3"

                                onChange={(event) => {
                                    ans[2] = (event.target.value);
                                }}
                            /></div>) : (<div className="input-container">
                                <h1>Verify MFA</h1>
                                <label htmlFor="ans">{ques[index]}</label>
                                <input
                                    type="text"
                                    id="ans"

                                    onChange={(event) => {
                                        ans[index] = (event.target.value);
                                    }}

                                />
                            </div>)}

                        <input type="submit" name="mfa_submit" value="Submit" />

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Mfa;