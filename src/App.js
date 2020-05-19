import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


import UserCardPage from './pages/UserCardPage';
import UserList from './pages/UserList';

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
