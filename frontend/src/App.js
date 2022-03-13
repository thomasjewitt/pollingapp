import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CreatePoll } from './pages/CreatePoll';
import { HomePage } from './pages/Home';
import { Poll } from './pages/Poll';
import { PollResults } from './pages/PollResults';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/create/" exact component={CreatePoll} />
      <Route path="/poll/:id/" exact component={Poll}/>
      <Route path="/poll/:id/results/" exact component={PollResults} />
    </Switch>
  </BrowserRouter>
);

export default App;