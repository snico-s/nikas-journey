import { useEffect, useRef, useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

const MyMap = () => {
  const [init, setInit] = useState<boolean>(false);
  let map: L.Map | null = null;

  useEffect(() => {
    if (!init) {
      // Setup Map
      map = L.map("map").setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      setInit(true);
    }
    return function cleanup() {
      map?.remove;
    };
  }, []);

  return <div className="w-80 h-80" id="map"></div>;
};

export default MyMap;
