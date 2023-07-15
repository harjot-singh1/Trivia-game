import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";


const SendTeamInvite = () => {

    const send_team_invite_url = "https://us-central1-serverless-391112.cloudfunctions.net/call-send-invite";

    const [recipientId, setRecipientId] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestBody = {};
        requestBody.sender = 8888; // TODO: Implement session id here
        requestBody.toTeam = 9999; // TODO: Implement fetching team id from sender id here
        requestBody.recipient = recipientId;
        console.log(requestBody);

        try{
            const response = await axios.post(send_team_invite_url, requestBody);
            const responseData = response.data;
            console.log(responseData)
            navigate('/send-invite-success', {state:{message:responseData['message']}});
        } catch (error){
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Send Invite</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="recipientId">Recipient ID:</label>
                    <input
                        type="email"
                        id="recipientId"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                    />
                </div>
                <button type="submit">Send Invite</button>
            </form>
        </div>
    );
};

export default SendTeamInvite;
