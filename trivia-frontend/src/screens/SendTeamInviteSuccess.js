import React from "react";
import {useLocation} from "react-router-dom";

const SendTeamInviteSuccess = () => {
    const location = useLocation();
    const message = location.state.message;
    console.log(message)
    return(
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default SendTeamInviteSuccess;