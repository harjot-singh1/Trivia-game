import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, hostName } from "./firebase";
import "./auth.css";
import axios from "axios";


const Auth = () => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const [url, setUrl] = useState(location.pathname);

    useEffect(() => {
        setUrl(location.pathname);
    });

    const googleSignIn = () => {

        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);

                const userData = {
                    idToken: credential.accessToken,
                    refreshToken: result?.user?.stsTokenManager?.refreshToken,
                    email: result?.user?.email,
                    creationTime: Date.now()
                }

                window.localStorage.setItem("userData", JSON.stringify(userData));
                console.log(window.localStorage.getItem("userData"));
                const apiUrl = `${hostName}/email-exist?email=${userData.email}`;
                axios.get(apiUrl).then((res) => {
                    navigate("/verifymfa");
                }).catch((error) => {
                    navigate("/createmfa");
                });

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
    };

    const validate = (event) => {
        event.preventDefault();

        if (url === "/login") {
            signInWithEmailAndPassword(auth, email, pass).then((result) => {
                const user = result.user;

                const userData = {
                    idToken: user?.accessToken,
                    refreshToken: user?.stsTokenManager?.refreshToken,
                    email: user?.email,
                    creationTime: Date.now()
                }

                window.localStorage.setItem("userData", JSON.stringify(userData));
                navigate("/verifymfa");
                //const userData = window.localStorage.getItem("userData");
                //window.localStorage.removeItem("userData");
            }).catch((error) => {
                alert(error.message);
            })

        } else {
            createUserWithEmailAndPassword(auth, email, pass)
                .then((userCredential) => {
                    const user = userCredential.user;
                    window.localStorage.setItem("userData", JSON.stringify({ email: user.email }));
                    navigate("/createmfa");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    alert(errorMessage)
                });
        }
    };

    return (
        <div id="login-box">
            <div className="left">
                {url === "/login" ? (
                    <h1>Trivia Login</h1>
                ) : (
                    <h1>Trivia Sign up</h1>
                )}
                <form id="auth-from" onSubmit={validate}>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        name="email"
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        id="password"
                        value={pass}
                        onChange={(event) => {
                            setPass(event.target.value);
                        }}
                        name="password"
                        placeholder="Password"
                    />
                    <input type="submit" id="signUp" name="signup_submit" value="Submit" />
                </form>
            </div>
            {url === "/login" && (
                <div>
                    <h2 className="or">OR</h2>
                    <div className="right">
                        <span className="loginwith">Sign in with social network</span>
                        <button className="social-signin facebook">Log in with facebook</button>
                        <button className="social-signin google" onClick={googleSignIn} id="login">Log in with Google</button>
                    </div>
                    <a href="/signup">Signup</a>
                </div>

            )}
        </div>
    );
};

export default Auth;
