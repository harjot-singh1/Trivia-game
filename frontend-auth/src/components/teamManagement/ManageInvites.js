import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ManageInvites = () => {
    const recipientId = JSON.parse(localStorage.getItem("userData")).email;
    const fetch_invites_url = "https://us-central1-serverless-391112.cloudfunctions.net/get-pending-invites";
    const answer_invite_url = "https://us-central1-serverless-391112.cloudfunctions.net/call-answer-invite";

    const navigate = useNavigate();

    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
        const fetchInvites = async () => {
            const requestBody = {};
            requestBody.recipient = recipientId;

            try {
                const responseFetchInvites = await axios.post(fetch_invites_url, requestBody);
                const responseDataFetchInvites = responseFetchInvites.data;
                setInvitations(responseDataFetchInvites['message'])
            } catch (error) {
                console.error(error);
            }
        }
        fetchInvites();
    });

    const handleAccept = async (docId, teamName) => {
        const requestAnswerInvite = {};
        requestAnswerInvite.docId = docId;
        requestAnswerInvite.status = 1;
        try{
            await axios.post(answer_invite_url, requestAnswerInvite);
            navigate('/team-management/added-to-team', {state:{teamName:teamName}});
        }catch (error){
            console.error(error);
        }
    };

    const handleReject = async (docId) => {
        const requestAnswerInvite = {};
        requestAnswerInvite.docId = docId;
        requestAnswerInvite.status = 2;
        try{
            await axios.post(answer_invite_url, requestAnswerInvite);
            navigate('/game-lobby');
        }catch (error){
            console.error(error);
        }
    };

    return(
        <div>
            <h2>Pending Invitations</h2>
            <ul>
                {invitations.map((invitation) => (
                    <li key={invitation.docId}>
                        <p>Join team of {invitation.sender} and their team: {invitation.teamName}</p>
                        <button onClick={() => handleAccept(invitation.docId, invitation.teamName)}>Accept</button>
                        <button onClick={() => handleReject(invitation.docId)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default ManageInvites;