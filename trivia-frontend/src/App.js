import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateTeam from "./screens/CreateTeam";
import CreateTeamSuccess from "./screens/CreateTeamSuccess";
import SendTeamInvite from "./screens/SendTeamInvite";
import SendTeamInviteSuccess from "./screens/SendTeamInviteSuccess";
import ManageInvites from "./screens/ManageInvites";
import PromoteToAdmin from "./screens/PromoteToAdmin";
import RemoveMembers from "./screens/RemoveMembers";
import LeaveTeam from "./screens/LeaveTeam";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/home"/>} />
          <Route exact path="/home" Component={HomeScreen} />
            <Route exact path="/create-team" Component={CreateTeam} />
            <Route exact path="/create-team-success" Component={CreateTeamSuccess} />
          <Route exact path="/send-team-invite" Component={SendTeamInvite} />
          <Route exact path="/send-invite-success" Component={SendTeamInviteSuccess} />
          <Route exact path="/answer-invites" Component={ManageInvites} />
          <Route exact path="/manage-invite-success" Component={HomeScreen} />
          <Route exact path="/promote-new-admin" Component={PromoteToAdmin} />
          <Route exact path="/remove-member" Component={RemoveMembers} />
          <Route exact path="/leave-team" Component={LeaveTeam} />
        </Routes>
      </Router>
    </>
  );
}

export default App