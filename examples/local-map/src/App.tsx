import Map from "pigeon-maps";
import * as React from "react";
import { model } from "./model";

export const moveMap = model.action(
  ({ local }) => (center: [number, number], zoom: number) => {
    local.center = center;
    local.zoom = zoom;
  },
);

const App = model.connect(({ dispatch, local }) => () => {
  return (
    <div className="map">
      <Map
        center={local.center}
        zoom={local.zoom}
        onBoundsChanged={({ center, zoom }) => {
          dispatch(moveMap)(center, zoom);
        }}
      />
    </div>
  );
});

export default App;
