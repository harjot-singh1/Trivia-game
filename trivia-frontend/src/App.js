import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomeScreen from './screens/HomeScreen'
import AdminHomeScreen from './admin/screens/AdminHomeScreen'
import AdminCategoryScreen from './admin/screens/AdminCategoryScreen'
import AdminQuestionScreen from './admin/screens/AdminQuestionScreen'
import AdminGameScreen from './admin/screens/AdminGameScreen'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/home"/>} />
          <Route exact path="/home" Component={HomeScreen} />
          {/* Admin Routes Start */}
          <Route exact path="/admin/home" Component={AdminHomeScreen} />
          <Route exact path="/admin/category" Component={AdminCategoryScreen} />
          <Route exact path="/admin/question" Component={AdminQuestionScreen} />
          <Route exact path="/admin/game" Component={AdminGameScreen} />
          {/* Admin Routes End */}
        </Routes>
      </Router>
    </>
  );
}

export default App