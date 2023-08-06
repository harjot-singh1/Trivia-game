import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import './WaitingRoom.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const WaitingRoom = () => {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();
    const { id, gameid } = useParams();
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        axios.get(`https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/getparticipants?gameId=` + gameid)
            .then(res1 => {
                const flattedIds = res1.data.flatMap(item => item.id);
                axios.post(`https://us-central1-serverless-391112.cloudfunctions.net/get-all-teams`, {})
                    .then(res => {
                        if (res?.data?.data) {
                            setTeams(res.data.data.filter(team => flattedIds.includes(team.team_id)));
                        }
                    });
            });

        axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get`)
            .then(res => {
                const game = res.data.find(game => game.id == gameid);
                if (game && game.startTime) {
                    setStartTime(new Date(game.startTime).getTime());
                }
            });
    }, [gameid]);

    useEffect(() => {
        if (startTime && gameid) {
            const timer = setInterval(() => {
                console.log("Inside timer");
                if (Date.now() >= startTime) {
                    console.log(Date.now());
                    console.log(startTime);
                    navigate("/ingame/" + id + "/" + gameid);
                    clearInterval(timer);
                }
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [startTime, id, gameid, navigate]);

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className='row my-5'>
                    <div className="col-12 text-center">
                        <h3> Waiting for other teams to join </h3>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-10 offset-1 members-list">
                        {teams.map(member => <span key={member.team_id} className='mx-1 my-2 d-inline-block px-2 py-1 text-center member-name'> {member.team_name}</span>)}
                    </div>
                </div>
                <div className="row d-flex justify-content-center my-5">
                    <span className="loader"></span>
                </div>
            </div>
        </>
    );
}

export default WaitingRoom;
