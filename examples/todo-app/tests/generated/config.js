module.exports = {
  port: 8088,
  generators: {
    saveRenderTest: {
      dir: "./tests/generated/render",
      template: t => `
        import * as React from "react";
        import App from "../../../src/App";
        import render from "../../utils/render";
        describe("render", () => {
        it(${t.testName}, async () => {
            const { container } = render(<App />, {
            initState: ${t.state}
            });
            expect(container).toMatchSnapshot();
        });
        });`,
    },
    saveActionTest: {
      dir: "./tests/generated/actions",
      template: t => `
        import { ${t.actionNames} } from "../../../src/actions";
        import { model, State } from "../../../src/model";
        
        describe("actions", () => {
          it(${t.testName}, async () => {
            const { store } = model.createStore({
              initState: ${t.firstState},
              mockEffects: ${t.recordedEffects},
            });
            ${t.awaitActions}
            const lastState : State = ${t.lastState} 
            expect(store.universe.state).toEqual(lastState);
          });
        });`,
    },
  },
};
