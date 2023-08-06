import React from 'react'
import './Header.css'
import Logout from '../../components/logout'

const Header = () => {
  return (
    <nav className='admin-header d-flex flex-row align-items-center justify-content-center p-4'>
      <div className='col-8 d-flex flex-row align-items-center justify-content-around'>
        <div className='admin-nav-btn' onClick={()=>window.location.href = "/admin/home"}>
            Home
        </div>
        <div className='admin-nav-btn' onClick={()=>window.location.href = "/admin/category"}>
            Category
        </div>
        <div className='admin-nav-btn' onClick={()=>window.location.href = "/admin/question"}>
            Question
        </div>
        <div className='admin-nav-btn' onClick={()=>window.location.href = "/admin/game"}>
            Game
        </div>
      </div>
      <div className='col-3 d-flex flex-row align-items-center justify-content-end'>
        <div className='admin-nav-btn' onClick={()=>window.location.href = "/login"}>
          <Logout></Logout>
        </div>
      </div>
    </nav>
  )
}

export default Header
