import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/home"/>} />
          <Route exact path="/home" Component={HomeScreen} />
        </Routes>
      </Router>
    </>
  );
}

export default App