import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import UserCardPage from './pages/UserCardPage/userCardPage';
import UserList from './pages/UserList/userlist';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
          <Route path="/usercard/:id">
            <UserCardPage />
          </Route>
          <Route path="/users">
            <UserList/>
          </Route>
          <Redirect to="/users" />
        </Switch>
    </div>
    </Router>
  );
}

export default App;
