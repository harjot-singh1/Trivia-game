import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminCategoryScreen from './admin/screens/AdminCategoryScreen';
import AdminGameScreen from './admin/screens/AdminGameScreen';
import AdminHomeScreen from './admin/screens/AdminHomeScreen';
import AdminQuestionScreen from './admin/screens/AdminQuestionScreen';
import GameDetails from './components/GameDetails';
import GameLobby from './components/GameLobby';
import WaiitingRoom from './components/WaitingRoom';
import './index.css';
import LeaderboardScreen from './Pages/LeaderboardScreen';
import reportWebVitals from './reportWebVitals';
import Ingame from './components/ingame';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { AuthProvider } from './components/authContext';
import CreateTeam from "./components/teamManagement/CreateTeam";
import CreateTeamSuccess from "./components/teamManagement/CreateTeamSuccess";
import InvitationManaged from "./components/teamManagement/InvitationManaged";
import ManageInvites from "./components/teamManagement/ManageInvites";
import ManageTeam from "./components/teamManagement/ManageTeam";
import MemberNotAdmin from "./components/teamManagement/MemberNotAdmin";
import PromoteToAdmin from "./components/teamManagement/PromoteToAdmin";
import RemoveMembers from "./components/teamManagement/RemoveMembers";
import ViewTeamStats from "./components/teamManagement/ViewTeamStats";
import Mfa from './Pages/mfa/mfa';
import Profile from './Pages/Profile/Profile';
import UserStats from './Pages/userStats/userStats';
import Auth from './Pages/signIn_signUp/auth';
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider></AuthProvider>
  },
  {
    path: "/game-lobby",
    element: <AuthProvider><GameLobby /></AuthProvider>
  },
  {
    path: "/waiting-room/:id/:gameid",
    element: <AuthProvider><WaiitingRoom /></AuthProvider>
  },
  {
    path: "/ingame/:id/:gameid",
    element: <AuthProvider><Ingame /></AuthProvider>
  },
  {
    path: "/game-details/:id",
    element: <AuthProvider><GameDetails /></AuthProvider>
  },
  {
    path: "/leaderboard",
    element: <AuthProvider><LeaderboardScreen /></AuthProvider>
  },
  {
    path: "/admin/home",
    element: <AuthProvider><AdminHomeScreen /></AuthProvider>
  },
  {
    path: "/admin/category",
    element: <AuthProvider><AdminCategoryScreen /></AuthProvider>
  },
  {
    path: "/admin/question",
    element: <AuthProvider><AdminQuestionScreen /></AuthProvider>
  },
  {
    path: "/admin/game",
    element: <AuthProvider><AdminGameScreen /></AuthProvider>
  },
  {
    path: "/login",
    element: <AuthProvider><Auth></Auth></AuthProvider>
  },
  {
    path: "/signup",
    element: <AuthProvider><Auth></Auth></AuthProvider>
  },
  {
    path: "/createmfa",
    element: <AuthProvider><Mfa></Mfa></AuthProvider>
  },
  {
    path: "/verifymfa",
    element: <AuthProvider><Mfa></Mfa></AuthProvider>
  },
  {
    path: "/team-management/create-team",
    element: <AuthProvider><CreateTeam></CreateTeam></AuthProvider>
  },
  {
    path: "/team-management/create-team-success",
    element: <AuthProvider><CreateTeamSuccess></CreateTeamSuccess></AuthProvider>
  },
  {
    path: "/team-management/added-to-team",
    element: <AuthProvider><InvitationManaged></InvitationManaged></AuthProvider>
  },
  {
    path: "/team-management/view-invitations",
    element: <AuthProvider><ManageInvites></ManageInvites></AuthProvider>
  },
  {
    path: "/team-management/team-stats",
    element: <AuthProvider><ViewTeamStats></ViewTeamStats></AuthProvider>
  },
  {
    path: "/team-management/remove-member",
    element: <AuthProvider><RemoveMembers></RemoveMembers></AuthProvider>
  },
  {
    path: "/team-management/promote-admin",
    element: <AuthProvider><PromoteToAdmin></PromoteToAdmin></AuthProvider>
  },
  {
    path: "/team-management",
    element: <AuthProvider><ManageTeam></ManageTeam></AuthProvider>
  },
  {
    path: "/team-management/not-admin",
    element: <AuthProvider><MemberNotAdmin></MemberNotAdmin></AuthProvider>
  },
  {
    path: "/profile",
    element: <AuthProvider><Profile></Profile></AuthProvider>
  },
  {
    path: "/userstats",
    element: <AuthProvider><UserStats></UserStats></AuthProvider>
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
