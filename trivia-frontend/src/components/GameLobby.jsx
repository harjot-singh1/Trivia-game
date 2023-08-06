import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import GameCard from './GameCard';

const GameLobby = () => {

  const [games, setGames] = useState([]);
  const [modalShow, setShow] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission logic here
    console.log('Submitted');
    // You can perform any other operations or send the value to the server if needed
  };


  useEffect(() => {
    axios.get(`https://8bdevixqj9.execute-api.us-east-1.amazonaws.com/game/get`)
      .then(res => {
        setGames(res.data);
      })
  }, [])

  return (
    <>
      <div className='row mx-4'>
        <div className="col-12">
          <span style={{ fontSize: '2.5em' }}>
            Game Lobby
          </span>
        </div>
      </div>
      <div className="row mx-4" style={{ maxHeight: "90vh", overflow: "scroll" }}>
        {games?.map(game => <GameCard key={`game_card_` + game.id} id={game.id} title={game.name} category={game.category} timeFrameinMin={(new Date(game.endTime).getTime() > Date.now()) ? new Date(game.endTime).toLocaleString() : 'Expired'} difficuly={game.difficulty} expired={(new Date(game.endTime).getTime() <= Date.now())}></GameCard>)}
      </div>
      <button className='action-button' onClick={() => setShow(true)}>
        <img src='../assets/team.png' alt="Join Game" height='20' width='20' />
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
                required
              />
              <button type="submit btn btn-outline-dark w-25">Submit</button>
            </div>
          </form>
        </Modal.Body>
      </Modal >
    </>
  )
}

export default GameLobby