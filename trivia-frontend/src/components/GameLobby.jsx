import React, { useEffect, useState } from 'react'
import GameCard from './GameCard'
import axios from 'axios';

const GameLobby = () => {

  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(`https://5cik1dnqs9.execute-api.us-east-1.amazonaws.com/getGamesMocked`)
      .then(res => {
        setGames(res.data);
      })
  }, [])

  return (
    <>
      <div>GameLobby</div>
      <div className="row mx-4">
        {games?.map(game => <GameCard key={`game_card_` + game.name} title={game.name} category={game.category} timeFrameinMin={game.timeFrame} difficuly={game.difficulty}></GameCard>)}
      </div>
    </>
  )
}

export default GameLobby