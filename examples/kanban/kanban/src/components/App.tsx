import * as React from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import Home from "./Home/Home";
import BoardContainer from "./Board/BoardContainer";
import LandingPage from "./LandingPage/LandingPage";
import "./App.scss";
import { watch, state } from "../model";

const App = ({}) => {
  const user = watch(state.user);
  const isGuest = watch(state.isGuest);
  // Serve different pages depending on if user is logged in or not
  if (user || isGuest) {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/b/:boardId" component={BoardContainer} />
        <Redirect to="/" />
      </Switch>
    );
  }
  // If not logged in, always redirect to landing page
  return (
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Redirect to="/" />
    </Switch>
  );
};

// Use withRouter to prevent strange glitch where other components
// lower down in the component tree wouldn't update from URL changes
export default withRouter(App);
