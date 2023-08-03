import './App.css';
import Logout from './components/logout';

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
