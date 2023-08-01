import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import GameCard from './GameCard';
import NavBar from './NavBar';
import Filter from './Filter';
import teamImage from '../team.png';
import { useNavigate } from 'react-router-dom';

const GameLobby = () => {

  const [games, setGames] = useState([]);
  const [modalShow, setShow] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const navigate = useNavigate();
  const [gamePin, setGamePin] = useState('');

  const toggleFilter = () => {
    setFilterVisible(!filterVisible); // Step 2: Function to toggle filter visibility
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios.post(`https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/joinGame/checkAllowance`, {
      userId: JSON.parse(localStorage.getItem("userData")).email,
      instanceId: gamePin
    })
      .then(res => {
        if (res?.data?.allowed) {
          navigate(`/waiting-room/${gamePin}`);
        } else {
          alert("You're not authorized to join this game.");
        }
      })
  };

  const handleChange = (event) => {
    setGamePin(event.target.value);
  };

  useEffect(() => {
    axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get`)
      .then(res => {
        setGames(res.data);
      })
  }, [])

  const handleFilterApply = (selectedCategory, selectedDifficulty) => {
    axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get`)
      .then(res => {
        let filteredGames = [];
        filteredGames = selectedCategory !== "" ? res.data.filter(game => game.category === selectedCategory) : res.data;
        filteredGames = selectedDifficulty !== "" ? filteredGames.filter(game => game.difficulty === selectedDifficulty) : filteredGames;
        console.log("Filtered games: " + JSON.stringify(filteredGames));
        setGames(filteredGames);
      })
  };

  return (
    <>
      <NavBar></NavBar>
      <div className='row mx-4 mt-4'>
        <div className="col-3 px-4">
          <span style={{ fontSize: '2em' }}>
            Game Lobby
          </span>
        </div>
        <div className="col-1 d-flex filter justify-content-center offset-8">
          <div className="align-self-center" onClick={toggleFilter} style={{ cursor: "pointer" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="row mx-4" style={{ maxHeight: "90vh", overflow: "scroll" }}>
        {games?.map(game => <GameCard key={`game_card_` + game.id} id={game.id} title={game.name} category={game.category} timeFrameinMin={(new Date(game.endTime).getTime() > Date.now()) ? new Date(game.endTime).toLocaleString() : 'Expired'} difficuly={game.difficulty} expired={(new Date(game.endTime).getTime() <= Date.now())}></GameCard>)}
      </div>
      <button className='action-button' onClick={() => setShow(true)}>
        <img src={teamImage} alt="Join Game" height='45' width='45' />
      </button>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmit}>
            <label htmlFor="numberField">Enter your game pin</label>
            <div className="w-100 d-inline-flex">
              <input className='form-control w-75'
                type="number"
                id="numberField"
                name="numberField"
                value={gamePin}
                onChange={handleChange}
                required
              />
              <button type="submit btn btn-outline-dark w-25">Submit</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {filterVisible && <Filter onApply={handleFilterApply} />}
    </>
  )
}

export default GameLobby;
