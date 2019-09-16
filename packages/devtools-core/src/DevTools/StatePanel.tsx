import * as React from "react";
import { state, watch } from "../model";
import { sendMessage } from "../utils/communication";
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
    const path = keyPath.concat([key]);
    if (oldValue !== newValue) {
      sendMessage({ type: "updateState", contents: { path, newValue } });
    }
  };

  return (
    <EditorSection
      data={watch(state.app.state)}
      jsonFile={stateJsonFile}
      onDeltaUpdate={onDeltaStateUpdate}
      onFullUpdate={({ newValue }: { newValue: any }) =>
        sendMessage({ type: "setState", contents: { newValue } })
      }
      liveUpdate
      disabled={false}
    />
  );
};
