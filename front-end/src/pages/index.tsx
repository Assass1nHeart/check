import React from 'react';
import TaskBoard from './TaskBoard';
import SignIn from './SignIn';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Router>
      <Route path="/" exact>
        <SignIn />
      </Route>
      <Route path="/home" exact>
        <TaskBoard />
      </Route>
    </Router>
  );
};

export default HomePage;
