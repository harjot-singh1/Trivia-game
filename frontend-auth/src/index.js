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

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import Auth from './Pages/signIn_signUp/auth';
import Mfa from './Pages/mfa/mfa';
import { AuthProvider } from './components/authContext';
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
    path: "/waiting-room/:id",
    element: <AuthProvider><WaiitingRoom /></AuthProvider>
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
