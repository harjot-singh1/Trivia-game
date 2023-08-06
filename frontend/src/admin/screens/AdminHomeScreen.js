import React from 'react'
import Header from '../components/Header'

const AdminHomeScreen = () => {
  return (
    <>
      <Header />
      <main className='p-4' style={{width: "100%",height: "100vh"}}>
        <h3>Dashboard</h3>
        <iframe width="100%" height="95%" src="https://lookerstudio.google.com/embed/reporting/3adff318-9719-4c67-80a6-6ec7f05d5c97/page/3rqXD" frameborder="0" allowfullscreen></iframe>
      </main>
    </>
  )
}

export default AdminHomeScreen
