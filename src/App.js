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
          <Route exact path="/">
            <UserList/>
          </Route>
          <Redirect to="/" />
        </Switch>
    </div>
    </Router>
  );
}

export default App;
