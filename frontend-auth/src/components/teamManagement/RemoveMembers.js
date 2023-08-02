import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const RemoveMembers = () => {
    const fetch_members_url = "https://us-central1-serverless-391112.cloudfunctions.net/fetch-admin-team";
    const remove_members_url = "https://us-central1-serverless-391112.cloudfunctions.net/remove-member";

    const [members, setMembers] = useState([]);
    const [docId, setDocId] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembersFromAdminTeam = async () => {
            const requestBody = {};
            requestBody.adminId = JSON.parse(localStorage.getItem("userData")).email;
            requestBody.teamId = localStorage.getItem("teamId").toString();

            try {
                const responseFetchMembers = await axios.post(fetch_members_url, requestBody);
                setMembers(responseFetchMembers.data['members'])
                setDocId(responseFetchMembers.data['docId'])
            } catch (error) {
                console.error(error);
            }
        }

        fetchMembersFromAdminTeam();
    });

    const handleAccept = async (member) => {
        const requestAnswerInvite = {};
        requestAnswerInvite.docId = docId;
        requestAnswerInvite.removedMember = member;
        try{
            await axios.post(remove_members_url, requestAnswerInvite);
            navigate('/team-management');
        }catch (error){
            console.error(error);
        }
    };

    return(
        <div>
            <h2>Select members to remove</h2>
            <ul>
                {members.map((member) => (
                    <li key={member}>
                        <button onClick={() => handleAccept(member)}>Remove {member} from team</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RemoveMembers;