import axios from 'axios';
import { useEffect, useState } from 'react';
import './GameDetails.css';
import { Link, useParams } from 'react-router-dom';

const GameDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState({});

    useEffect(() => {
        axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get?id=` + id)
            .then(res => {
                console.log(JSON.stringify(res));
                setGame(res.data);
            })
    }, [])


    return (
        <section className="p-5">
            <div className="row">
                <Link to={'/game-lobby'}
                    style={{ textDecoration: 'none', color: 'darkslategrey', fontSize: "1.1em" }}> Back to Game Lobby</Link>
            </div>
            <div className="row py-3">
                <div className="col-12">
                    <h1 className="quiz-title">{game.title}</h1>
                </div>
            </div>
            <div className="row py-3">
                <div className="col-12">
                    <p className="quiz-description">{game.description}</p>
                </div>
            </div>
            <div className="row quiz-details-row py-5">
                <div className="col-3">
                    <span className="quiz-label">Category:</span>
                    <span className="quiz-info">{game.category}</span>
                </div>
                <div className="col-3">
                    <span className="quiz-label">Time Frame:</span>
                    <span className="quiz-info">{new Date(game.endTime).toLocaleString()}</span>
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

        </section>
    )
}

export default GameDetails