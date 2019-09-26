import { Redirect, Route, Switch } from "@prodo/route";
import * as React from "react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const App = () => (
  <div className="app">
    <Route exact path="/">
      <Redirect to="/home" />
    </Route>

    <Switch>
      <Route exact path="/home" component={Home} />
      <Route path="/users/:username" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default App;
