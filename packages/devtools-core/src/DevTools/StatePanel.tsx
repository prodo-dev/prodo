import * as React from "react";
import { state, watch } from "../model";
import EditorSection from "./components/EditorSection";

export const StatePanel = () => {
  const stateJsonFile = "/state.json";

  const onDeltaStateUpdate = ({
    key,
    keyPath,
    newValue,
    oldValue,
  }: {
    key: string;
    keyPath: string[];
    newValue: any;
    oldValue: any;
  }) => {
    console.log(key, keyPath, newValue, oldValue);
    // const fullUpdatePath = keyPath.concat([key]);
    // const stateUpdate: StateUpdate = {
    //   path: fullUpdatePath,
    //   oldValue,
    //   newValue,
    // };

    // actions.updateState({ stateUpdate });
  };

  return (
    <EditorSection
      data={watch(state.app.state)}
      jsonFile={stateJsonFile}
      onDeltaUpdate={onDeltaStateUpdate}
      onFullUpdate={
        ({ newValue }: { newValue: any }) => console.log(newValue)
        // actions.setState({ newState: newValue })
      }
      liveUpdate
      disabled={false}
    />
  );
};
