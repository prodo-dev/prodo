import { Redirect, Route, Switch } from "@prodo/route";
import * as React from "react";
import { state, watch } from "../model";
import "./App.scss";
import BoardContainer from "./Board/BoardContainer";
import Home from "./Home/Home";
import LandingPage from "./LandingPage/LandingPage";

const AppInner = ({}) => {
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
export default () => (
  <>
    <AppInner />
    <div id="modal" />
  </>
);
