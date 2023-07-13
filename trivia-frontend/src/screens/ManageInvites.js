import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ManageInvites = () => {
    const recipientId = "r@dal.ca"; // TODO: Implement session id here
    const fetch_invites_url = "get-pending-invites"
    // const proxy_server = "https://cors-anywhere.herokuapp.com/";
    // const proxy_server = " https://api.allorigins.win/raw?url="
    const proxy_server = "http://localhost:8010/proxy/";
    const answer_invite_url = "call-answer-invite";

    const navigate = useNavigate();

    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
        const fetchInvites = async () => {
            const requestBody = {};
            requestBody.recipient = recipientId;

            try {
                const responseFetchInvites = await axios.post(proxy_server + fetch_invites_url, requestBody);
                const responseDataFetchInvites = responseFetchInvites.data;
                setInvitations(responseDataFetchInvites['message'])
            } catch (error) {
                console.error(error);
            }
        }
        fetchInvites();
    });
    // const fetchInvites = async () => {
    //     const requestBody = {};
    //     requestBody.recipient = recipientId;
    //
    //     try {
    //         const responseFetchInvites = await axios.post(proxy_server + fetch_invites_url, requestBody);
    //         const responseDataFetchInvites = responseFetchInvites.data;
    //         setInvitations(responseDataFetchInvites['message']);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // fetchInvites();



    const handleAccept = async (docId) => {
        const requestAnswerInvite = {};
        requestAnswerInvite.docId = docId;
        requestAnswerInvite.status = 1;
        try{
            await axios.post(proxy_server + answer_invite_url, requestAnswerInvite);
            navigate('/manage-invite-success');
        }catch (error){
            console.error(error);
        }
    };

    const handleReject = async (docId) => {
        const requestAnswerInvite = {};
        requestAnswerInvite.docId = docId;
        requestAnswerInvite.status = 2;
        try{
            await axios.post(proxy_server + answer_invite_url, requestAnswerInvite);
            navigate('/manage-invite-success');
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
                        <p>Join team of {invitation.sender} and their team: {invitation.team}</p>
                        <button onClick={() => handleAccept(invitation.docId)}>Accept</button>
                        <button onClick={() => handleReject(invitation.docId)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default ManageInvites;