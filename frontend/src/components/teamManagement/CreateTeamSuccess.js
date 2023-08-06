import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar";
const CreateTeamSuccess = () => {
    const location = useLocation();
    const message = location.state.message;
    const teamName = location.state.teamName;

    return (
        <div>
            <NavBar></NavBar>
            <h1>{message}</h1>
            <h2>Welcome to your team named: {teamName}</h2>
        </div>
    );
};

export default CreateTeamSuccess;