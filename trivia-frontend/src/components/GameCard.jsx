import axios from 'axios';
import { default as React } from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';


const GameCard = ({ id, title, category, timeFrameinMin, difficuly, expired }) => {

    let borderColor;

    switch (difficuly) {
        case "high": borderColor = "#FF0000"; break;
        case "medium": borderColor = "#FFFF00"; break;
        case "low": borderColor = "#0000FF"; break;
        default: borderColor = "#000";
    }

    const handleJoinGame = async (gameId) => {
        try {
            const response = await axios.post('https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/joinGame', {
                userId: localStorage.getItem('loggedInUserId') || 'madanmayank5@gmail.com',
                teamId: localStorage.getItem('teamId') || 'team1',
                gameId: "" + gameId
            });
            if (response.status === 200) {
                console.log("response from joinGame API " + response.data);
                const instanceId = response.data.body.instanceId;
                localStorage.setItem('gameInstanceId', instanceId);
                const invitationResponse = await axios.post(' https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/inviteparticipants', {
                    userId: localStorage.getItem('loggedInUserId') || 'madanmayank5@gmail.com',
                    instanceId: instanceId
                });
                console.log("invitation-response:: " + invitationResponse);
            } else {
                console.error("Something is broken, please try again later")
            }
        } catch (error) {
            console.error("Failed to start game")
        }
    };

    return (
        <section className={`card_${id} col-md-3 col-xs-2 p-3 m-4`}
            style={{
                border: '1px solid' + borderColor, boxShadow: 'rgba(0, 0, 0, 0.35)  0px 5px 15px',
                borderRadius: '10px', minHeight: "11em", maxHeight: "15em",
                cursor: "pointer"
            }}>
            <div className='row h-25'>
                <div className='col-7'>
                    <span className='category'>{category}</span>
                </div>
                <div className="col-4 offset-1">
                    <span className='timeFrame d-flex justify-content-end'>{timeFrameinMin}</span>
                </div>
            </div>
            <div className="row h-50">
                <div className="col-12">
                    <span className='title'>{title}</span>
                </div>
            </div>
            <div className="row h-25">
                <div className="col-6">
                    <Link to={'/game-details/' + id} className='btn btn-outline-secondary details-btn'
                        style={{ textDecoration: 'none' }}> Details</Link>
                </div>
                <div className="col-2 offset-3">
                    <button className={`btn join-btn  d-flex justify-content-end ${expired ? 'disabled' : ' btn-outline-success'}`}
                        onClick={() => handleJoinGame(id)}>Join</button>
                </div>
            </div>
        </section>
    )
}

export default GameCard