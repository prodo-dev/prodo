import * as React from "react";
import { connect, Provider } from "react-redux";
import { applyMiddleware, createStore, Dispatch } from "redux";
import thunkMiddleware, { ThunkAction } from "redux-thunk";
import Controls from "./Controls";
import { shuffle } from "./lib";
import { State } from "./model";

const initState = [...Array(300)].map(() => ({
  value: false,
}));

type Action =
  | {
      type: "CHANGE";
      fraction: number;
    }
  | TypedThunkAction<"CHANGE_N">;

const reducer = (state: State = initState, action: Action): State => {
  switch (action.type) {
    case "CHANGE":
      const newState = [...state];

      const idxs = [...Array(state.length)].map((_, i) => i);
      shuffle(idxs);
      idxs.slice(Math.floor(action.fraction * state.length)).forEach(idx => {
        newState[idx].value = !state[idx].value;
      });

      return newState;
  }
  return state;
};

const change = (fraction: number) => ({
  type: "CHANGE",
  fraction,
});

type TypedThunkAction<T> = ThunkAction<any, any, any, any> & {
  type: T;
};

const typedThunk = (
  thunk: ThunkAction<any, any, any, any>,
  type: string,
): Action => {
  (thunk as any).type = type;
  return thunk as Action;
};

const changeN = (fraction: number, count: number): Action => {
  return typedThunk((dispatch: Dispatch) => {
    dispatch(change(fraction));
    if (count > 1) {
      setTimeout(() => dispatch(changeN(fraction, count - 1)), 0);
    }
  }, "CHANGE_N");
};

const changeNSync = (fraction: number, count: number): Action => {
  return typedThunk((dispatch: Dispatch) => {
    dispatch(change(fraction));
    if (count > 1) {
      dispatch(changeNSync(fraction, count - 1));
    }
  }, "CHANGE_N");
};

const Box = ({ value }: { value: boolean }) => {
  return <div className={`box ${value ? "on" : "off"}`} />;
};

const ConnectedBox = connect((state: State, props: { idx: number }) => ({
  value: state[props.idx].value,
}))(Box);

const Grid = ({ n }: { n: number }) => {
  return (
    <div>
      {[...Array(n)].map((_, i) => (
        <ConnectedBox key={i} idx={i} />
      ))}
    </div>
  );
};

const ConnectedGrid = connect((state: State) => ({
  n: state.length,
}))(Grid);

const App = ({
  changeN,
  changeNSync,
}: {
  changeN: (fraction: number, count: number) => void;
  changeNSync: (fraction: number, count: number) => void;
}) => {
  return (
    <div>
      <Controls changeN={changeN} changeNSync={changeNSync} />
      <ConnectedGrid />
    </div>
  );
};

const ConnectedApp = connect(
  () => ({}),
  dispatch => ({
    changeN: (fraction: number, count: number) => {
      dispatch(changeN(fraction, count));
    },
    changeNSync: (fraction: number, count: number) => {
      dispatch(changeNSync(fraction, count));
    },
  }),
)(App);

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
