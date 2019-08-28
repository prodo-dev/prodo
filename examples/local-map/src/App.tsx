import * as React from "react";
import { model } from "./model";
import Map from "pigeon-maps";

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
      ></Map>
    </div>
  );
});

export default App;
