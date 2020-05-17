import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
          <Route path="/users">
            <UserList/>
          </Route>
        </Switch>
    </div>
    </Router>
  );
}

export default App;
