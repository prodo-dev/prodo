import { Link, Redirect, Route, Switch } from "@prodo/route";
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
    Hello {watch(route.params.username)}.
    <button onClick={() => dispatch(redirectHome)()}>Log Out</button>
  </div>
));

const App = () => (
  <div className="app">
    <Redirect to={{ path: "/test-2" }} />
    <Link to={{ path: "/test", params: { user: "tom" } }}>Click Me</Link>
    <Switch>
      <Route exact path="/user" component={UserPage} />
      <Route exact path="/test" />
      <Route component={HomePage} />
    </Switch>
  </div>
);

export default App;
