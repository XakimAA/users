import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import UserCard from './pages/UserCard';
import UserList from './pages/UserList';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
          <Route path="/usercard/:id">
            <UserCard />
          </Route>
          <Route path="/">
            <UserList/>
          </Route>
        </Switch>
    </div>
    </Router>
  );
}

export default App;
