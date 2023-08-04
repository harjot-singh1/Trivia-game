import React from 'react';
import Logout from './logout';
import { Link } from 'react-router-dom';


const NavBar = () => {

    const loggedInUser = () => JSON.parse(localStorage.getItem("userData")).email;
    const currentTeam = () => localStorage.getItem("teamName");
    const whereToNavigateForTeam = () => localStorage.getItem("teamId") === null ? "/create-team" : "";

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/game-lobby">Trivia Titans</a>
                    <div className='d-flex'>
                        <Link to={'/chat'} className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i>Help</Link>
                        <Link to={'/userstats'} className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i>Stats</Link>
                        <Link to={'/team-management/view-invitations'} className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i>Invites</Link>
                        <Link to={'/leaderboard'} className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i>Leaderboard</Link>
                        <Link to={'/team-management' + whereToNavigateForTeam()} className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i> {currentTeam() || "Create Team"} </Link>
                        <Link to={'/profile'} className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i> {loggedInUser()} </Link>
                        <Logout />
                    </div>
                </div >
            </nav >
        </>
    )
}

export default NavBar