import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import './WaitingRoom.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const WaitingRoom = () => {
    const teams = [
        {
            id: 1,
            name: "Galactic Guardians"
        },
        {
            id: 2,
            name: "Stealth Serpents"
        },
        {
            id: 3,
            name: "Lunar Wolves"
        },
        {
            id: 4,
            name: "Phoenix Rising"
        },
        {
            id: 5,
            name: "Thunder Titans"
        },
        {
            id: 6,
            name: "Mystic Mermaids"
        },
        {
            id: 7,
            name: "Gravity Grapplers"
        },
        {
            id: 8,
            name: "Savage Sabertooths"
        },
        {
            id: 9,
            name: "Astral Avengers"
        },
        {
            id: 10,
            name: "Neon Ninjas"
        },
        {
            id: 11,
            name: "Cyber Centurions"
        },
        {
            id: 12,
            name: "Inferno Inquisitors"
        },
        {
            id: 13,
            name: "Emerald Enchanters"
        },
        {
            id: 14,
            name: "Venomous Vipers"
        },
        {
            id: 15,
            name: "Aurora Arrows"
        }
    ];
    const navigate = useNavigate();
    const { id, gameid } = useParams();
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get`)
            .then(res => {
                const game = res.data.find(game => game.id == gameid);
                if (game && game.startTime) {
                    setStartTime(new Date(game.startTime).getTime());
                }
            });
    }, [gameid]);

    useEffect(() => {
        if (startTime) {
            const timer = setInterval(() => {
                console.log("Inside timer");
                if (Date.now() >= startTime) {
                    console.log(Date.now());
                    console.log(startTime);
                    navigate("/ingame/" + id);
                    clearInterval(timer);
                }
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [startTime, id, navigate]);

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
                        {teams.map(member => <span key={member.id} className='mx-1 my-2 d-inline-block px-2 py-1 text-center member-name'> {member.name}</span>)}
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
