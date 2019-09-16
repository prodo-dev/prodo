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
  }: {
    key: string;
    keyPath: string[];
    newValue: any;
    oldValue: any;
  }) => {
    const updatePath = keyPath.concat([key]);
    sendMessage({ type: "updateState", data: { updatePath, newValue } });
  };

  return (
    <EditorSection
      data={watch(state.app.state)}
      jsonFile={stateJsonFile}
      onDeltaUpdate={onDeltaStateUpdate}
      onFullUpdate={({ newValue }: { newValue: any }) =>
        sendMessage({ type: "setState", data: { newValue } })
      }
      liveUpdate
      disabled={false}
    />
  );
};
