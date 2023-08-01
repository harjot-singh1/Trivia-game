import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MemberNotAdmin = () => {

    const leave_team_url = "https://us-central1-serverless-391112.cloudfunctions.net/leave-team"
    const requestBody = {};
    requestBody.user_id = JSON.parse(localStorage.getItem("userData")).email;
    requestBody.team_id = localStorage.getItem("teamId").toString();

    const navigate = useNavigate();

    const buttons = {
        display: 'flex',
        flexDirection: 'column',
    };

    const handleCreateNewTeam = () => {
        navigate("/team-management/create-team");
    }

    const handleLeaveTeam = () => {
        axios.post(leave_team_url).then(res => {
            navigate('/game-lobby')
        });
    }

    return(
        <div>
            <h2>
                Hey! You are not admin of the selected team. Please ask admin to promote you to view the enhanced functions.
            </h2>
            <h3>
                OR... Just create your own team, we wont tell ;)
            </h3>
            <div style={buttons}>
                <button onClick={handleLeaveTeam}>Leave Team</button>
                <button onClick={handleCreateNewTeam}>Create New Team</button>
            </div>
        </div>
    );

};

export default MemberNotAdmin;