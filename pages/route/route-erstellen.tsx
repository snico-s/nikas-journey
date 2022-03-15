import { GeoJSONFeature } from "maplibre-gl";
import React, { useState } from "react";
import DrawMap from "../../components/maps/DrawMap";

type Props = {};

const RouteErstellen = (props: Props) => {
  // const [routes, setRoutes] = useState<Array<GeoJSON.Feature[]>>([]);
  return (
    <div className="flex">
      <DrawMap />
      <div>
        <ul>
          {/* {routes.map((route) => (
            <li>{route}</li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default RouteErstellen;
