import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const CreateTeam = () => {

    const create_new_team_url = "https://us-central1-serverless-391112.cloudfunctions.net/create-new-teamv2";
    const proxy_server = "https://cors-anywhere.herokuapp.com/";

    const [teamMemberId, setTeamMemberId] = useState(['']);

    const navigate = useNavigate();

    const handleInputChange = (index, value) => {
        const updatedIds = [...teamMemberId];
        updatedIds[index] = value;
        setTeamMemberId(updatedIds);
    };

    const handleAddInput = () => {
        setTeamMemberId([...teamMemberId, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const param = [];
        teamMemberId.forEach((id) => param.push(id));
        const requestBody = {}
        requestBody.teamMembers = param;
        requestBody.senderId = 9000 // TODO: Add session id for sender ID
        console.log(requestBody);

        try{
            const response = await axios.post(proxy_server + create_new_team_url, requestBody);

            const responseData = response.data;
            navigate('/create-team-success', {state:{message:responseData['message'], teamName:responseData['team_name']}});
        } catch (error){
            console.error(error);
        }

    };


    return (
        <div>
            <h1>Create New Team</h1>
            <form onSubmit={handleSubmit}>
                {teamMemberId.map((memberId, index) => (
                    <div key={index}>
                        <label htmlFor={`memberId${index}`}>Member ID:</label>
                        <input
                            type="text"
                            id={`memberId${index}`}
                            value={memberId}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddInput}>
                    Add Member
                </button>
                <button type="submit">Create Team</button>
            </form>
        </div>
    );
};

export default CreateTeam;
