import { Redirect, Route, Switch } from "@prodo/route";
import * as React from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App = () => (
  <div className="app">
    <Route exact path="/">
      <Redirect to="/home" />
    </Route>

    <Switch>
      <Route exact path="/home" component={Home} />
      <Route path="/user/:username" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default App;
