import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AdminHomeScreen from './admin/screens/AdminHomeScreen'
import AdminCategoryScreen from './admin/screens/AdminCategoryScreen'
import AdminQuestionScreen from './admin/screens/AdminQuestionScreen'
import AdminGameScreen from './admin/screens/AdminGameScreen'
import LeaderboardScreen from './Pages/LeaderboardScreen';
import GameLobby from './components/GameLobby';
import GameDetails from './components/GameDetails';
import WaiitingRoom from './components/WaitingRoom';
import Ingame from './components/ingame';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import Auth from './Pages/signIn_signUp/auth';
import Mfa from './Pages/mfa/mfa';
import { AuthProvider } from './components/authContext';
import CreateTeam from "./components/teamManagement/CreateTeam";
import CreateTeamSuccess from "./components/teamManagement/CreateTeamSuccess";
import InvitationManaged from "./components/teamManagement/InvitationManaged";
import ManageInvites from "./components/teamManagement/ManageInvites";
import ViewTeamStats from "./components/teamManagement/ViewTeamStats";
import RemoveMembers from "./components/teamManagement/RemoveMembers";
import PromoteToAdmin from "./components/teamManagement/PromoteToAdmin";
import ManageTeam from "./components/teamManagement/ManageTeam";
import MemberNotAdmin from "./components/teamManagement/MemberNotAdmin";
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
    path: "/ingame/:id",
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
    element: <CreateTeam><Mfa></Mfa></CreateTeam>
  },
  {
    path: "/team-management/create-team-success",
    element: <CreateTeamSuccess><Mfa></Mfa></CreateTeamSuccess>
  },
  {
    path: "/team-management/added-to-team",
    element: <InvitationManaged><Mfa></Mfa></InvitationManaged>
  },
  {
    path: "/team-management/view-invitations",
    element: <ManageInvites><Mfa></Mfa></ManageInvites>
  },
  {
    path: "/team-management/team-stats",
    element: <ViewTeamStats><Mfa></Mfa></ViewTeamStats>
  },
  {
    path: "/team-management/remove-member",
    element: <RemoveMembers><Mfa></Mfa></RemoveMembers>
  },
  {
    path: "/team-management/promote-admin",
    element: <PromoteToAdmin><Mfa></Mfa></PromoteToAdmin>
  },
  {
    path: "/team-management",
    element: <ManageTeam><Mfa></Mfa></ManageTeam>
  },
  {
    path: "/team-management/not-admin",
    element: <MemberNotAdmin><Mfa></Mfa></MemberNotAdmin>
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
