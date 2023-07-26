import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import GameLobby from './components/GameLobby';
import 'bootstrap/dist/css/bootstrap.min.css'
import GameDetails from './components/GameDetails';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/game-lobby" />} />
          <Route exact path="/home" Component={HomeScreen} />
          <Route exact path="/game-lobby" Component={GameLobby} />
          <Route exact path="/game-details/:id" Component={GameDetails} />
        </Routes>
      </Router>
    </>
  );
}

export default App