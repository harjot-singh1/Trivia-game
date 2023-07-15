import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const PromoteToAdmin = () => {
    const fetch_members_url = "https://us-central1-serverless-391112.cloudfunctions.net/fetch-admin-team";
    const promote_admin_url = "https://us-central1-serverless-391112.cloudfunctions.net/promote-to-admin";

    const [members, setMembers] = useState([]);
    const [docId, setDocId] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembersFromAdminTeam = async () => {
            const requestBody = {};
            requestBody.adminId = "react-test2@gmail.com"; // TODO Session id her

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
        requestAnswerInvite.newAdminId = member;
        try{
            await axios.post(promote_admin_url, requestAnswerInvite);
            navigate('/home');
        }catch (error){
            console.error(error);
        }
    };

    return(
        <div>
            <h2>Members in Admin's Team</h2>
            <ul>
                {members.map((member) => (
                    <li key={member}>
                        <button onClick={() => handleAccept(member)}>Promote {member} to Admin</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PromoteToAdmin;