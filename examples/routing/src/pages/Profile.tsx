import * as React from "react";
import { redirectHome } from "../actions";
import { dispatch, route, watch } from "../model";

const capitalize = (s: string): string =>
  `${s.charAt(0).toUpperCase()}${s.substring(1)}`;

const normalize = (s: string): string =>
  s
    .replace(/\-/g, " ")
    .split(" ")
    .map(capitalize)
    .join(" ");

const Home: React.FC<{ username: string }> = props => {
  const params = watch(route.params);

  return (
    <div>
      <h1 className="title">{normalize(props.username)}</h1>
      <div className="gohome" onClick={() => dispatch(redirectHome)()}>
        Go Home
      </div>

      {Object.keys(params).map(k => (
        <div className="param" key={k}>
          <div className="key">{k}</div>
          <div className="value">{params[k]}</div>
        </div>
      ))}
    </div>
  );
};

export default Home;
