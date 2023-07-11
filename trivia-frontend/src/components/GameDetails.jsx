import axios from 'axios';
import { useEffect, useState } from 'react';
import './GameDetails.css';

const GameDetails = ({ id }) => {

    const [game, setGame] = useState({});

    useEffect(() => {
        axios.get(`https://5cik1dnqs9.execute-api.us-east-1.amazonaws.com/getGameDetails`)
            .then(res => {
                setGame(res.data);
            })
    }, [])


    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h2 className="quiz-title">{game.title}</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <p className="quiz-description">{game.description}</p>
                </div>
            </div>
            <div className="row quiz-details-row">
                <div className="col-3">
                    <span className="quiz-label">Category:</span>
                    <span className="quiz-info">{game.category}</span>
                </div>
                <div className="col-3">
                    <span className="quiz-label">Time Frame:</span>
                    <span className="quiz-info">{game.timeFrame}</span>
                </div>
                <div className="col-3">
                    <span className="quiz-label">Difficulty:</span>
                    <span className="quiz-info">{game.difficulty}</span>
                </div>
                <div className="col-3">
                    <span className="quiz-label">Current Participants:</span>
                    <span className="quiz-info">{game.participants}</span>
                </div>
            </div>

        </>
    )
}

export default GameDetails