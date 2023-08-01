import React from 'react';
import Logout from './logout';


const NavBar = () => {

    const loggedInUser = () => JSON.parse(localStorage.getItem("userData")).email;

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/game-lobby">Trivia Titans</a>
                    <div className='d-flex'>
                        <span className="nav-link text-white mx-3"><i className="fas fa-cog mx-1"></i> {loggedInUser()} </span>
                        <Logout />
                    </div>
                </div >
            </nav >
        </>
    )
}

export default NavBar