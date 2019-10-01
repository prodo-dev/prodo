import Map from "pigeon-maps";
import * as React from "react";
import { dispatch, local, watch } from "./model";

export const moveMap = (center: [number, number], zoom: number) => {
  local.center = center;
  local.zoom = zoom;
};

const App = () => (
  <div className="map">
    <Map
      center={watch(local.center)}
      zoom={watch(local.zoom)}
      onBoundsChanged={({ center, zoom }) => {
        dispatch(moveMap)(center, zoom);
      }}
    />
  </div>
);

export default App;
