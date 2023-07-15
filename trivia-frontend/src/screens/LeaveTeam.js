import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const LeaveTeam = () => {
    const recipientId = "react-test2@gmail.com"; // TODO: Implement session id here
    const fetch_teams_url = "https://us-central1-serverless-391112.cloudfunctions.net/fetch-teams-for-member";
    const remove_members_url = "https://us-central1-serverless-391112.cloudfunctions.net/remove-member";

    const navigate = useNavigate();

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const requestBody = {};
            requestBody.recipient = recipientId;

            try {
                const responseFetchInvites = await axios.post(fetch_teams_url, requestBody);
                const responseDataFetchInvites = responseFetchInvites.data;
                setTeams(responseDataFetchInvites['message'])
            } catch (error) {
                console.error(error);
            }
        }
        fetchTeams();
    });

    const handleAccept = async (docId) => {
        const requestAnswerInvite = {};
        requestAnswerInvite.docId = docId;
        requestAnswerInvite.removedMember = recipientId;
        try{
            await axios.post(remove_members_url, requestAnswerInvite);
            navigate('/home');
        }catch (error){
            console.error(error);
        }
    };


    return(
        <div>
            <h2>Select Team to Leave</h2>
            <ul>
                {teams.map((team) => (
                    <li key={team.docId}>
                        <button onClick={() => handleAccept(team.docId)}>Leave {team.team_name} team</button>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default LeaveTeam;