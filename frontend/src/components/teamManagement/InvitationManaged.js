import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar";
const InvitationManaged = () => {
    const location = useLocation();
    const teamName = location.state.teamName;


    return (
        <div>
            <NavBar></NavBar>
            <h2>Welcome to your team: {teamName}</h2>
        </div>
    );
};

export default InvitationManaged;