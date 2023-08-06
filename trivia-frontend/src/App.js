import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomeScreen from './screens/HomeScreen'
import AdminHomeScreen from './admin/screens/AdminHomeScreen'
import AdminCategoryScreen from './admin/screens/AdminCategoryScreen'
import AdminQuestionScreen from './admin/screens/AdminQuestionScreen'
import AdminGameScreen from './admin/screens/AdminGameScreen'
import LeaderboardScreen from "./screens/LeaderboardScreen"
import GameLobby from './components/GameLobby';
import GameDetails from './components/GameDetails';

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/home" Component={HomeScreen} />
          <Route exact path="/leaderboard" Component={LeaderboardScreen} />
          {/* Admin Routes Start */}
          <Route exact path="/admin/home" Component={AdminHomeScreen} />
          <Route exact path="/admin/category" Component={AdminCategoryScreen} />
          <Route exact path="/admin/question" Component={AdminQuestionScreen} />
          <Route exact path="/admin/game" Component={AdminGameScreen} />
          {/* Admin Routes End */}
          <Route exact path="/game-lobby" Component={GameLobby} element={<Navigate replace to="/game-lobby" />} />
          <Route exact path="/game-details/:id" Component={GameDetails} />
        </Routes>
      </Router>
    </>
  );
}

export default App