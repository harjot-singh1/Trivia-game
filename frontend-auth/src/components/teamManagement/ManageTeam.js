import React, {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ManageTeam = () => {
    const admin_check_url = "https://us-central1-serverless-391112.cloudfunctions.net/is-user-admin"
    const navigate = useNavigate();

    const buttons = {
        display: 'flex',
        flexDirection: 'column',
    };

    useEffect(()=>{
        const checkAdmin = async () => {
            const requestBody = {}
            requestBody.user_id = JSON.parse(localStorage.getItem("userData")).email;
            requestBody.team_id = localStorage.getItem("teamId").toString();
            const response = await axios.post(admin_check_url, requestBody)
            if (response.data['flag'] === 1){
                navigate('/team-management/not-admin')
            }
        }
        checkAdmin();
    });

    const handlePromoteAdmin = () => {
        navigate("/team-management/promote-admin");
    }

    const handleRemoveMember = () => {
        navigate("/team-management/remove-member")
    }

    const handleTeamStats = () => {
        navigate("/team-management/team-stats")
    }

    const handleCreateNewTeam = () => {
        navigate("/team-management/create-team");
    }

    return(
        <div>
            <h2>
                Team Management Deck
            </h2>
            <div style={buttons}>
                <button onClick={handlePromoteAdmin}>Promote New Admin</button>
                <button onClick={handleRemoveMember}>Remove Member</button>
                <button onClick={handleTeamStats}>View Team Statistics</button>
                <button onClick={handleCreateNewTeam}>Create New Team</button>
            </div>
        </div>
    );
};

export default ManageTeam;