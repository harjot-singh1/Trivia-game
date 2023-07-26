import './App.css';
import Logout from './components/logout';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AdminHomeScreen from './admin/screens/AdminHomeScreen'
import AdminCategoryScreen from './admin/screens/AdminCategoryScreen'
import AdminQuestionScreen from './admin/screens/AdminQuestionScreen'
import AdminGameScreen from './admin/screens/AdminGameScreen'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div>
      {/* <Router>
        <Routes> */}
          {/* Admin Routes Start */}
          {/* <Route exact path="/admin/home" Component={AdminHomeScreen} />
          <Route exact path="/admin/category" Component={AdminCategoryScreen} />
          <Route exact path="/admin/question" Component={AdminQuestionScreen} />
          <Route exact path="/admin/game" Component={AdminGameScreen} /> */}
          {/* Admin Routes End */}
        {/* </Routes>
      </Router> */}
      <Logout></Logout>
    </div>
  );
}

export default App;
