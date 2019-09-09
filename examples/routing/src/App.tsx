import { Route, Switch } from "@prodo/routing-plugin";
import * as React from "react";
import { redirectHome, redirectUser } from "./actions";
import { model } from "./model";

const HomePage = model.connect(({ dispatch }) => () => (
  <div>
    HomePage
    <button onClick={() => dispatch(redirectUser)("tom")}>Log In</button>
  </div>
));
const UserPage = model.connect(({ watch, route, dispatch }) => () => (
  <div>
    Hello {watch(route.path)}.
    <button onClick={() => dispatch(redirectHome)()}>Log Out</button>
  </div>
));

const App = () => (
  <div className="app">
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/user" component={UserPage} />
    </Switch>
  </div>
);

export default App;
