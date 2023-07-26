import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Auth from './Pages/signIn_signUp/auth';
import Mfa from './Pages/mfa/mfa';
import { AuthProvider } from './components/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider><App></App></AuthProvider>
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
