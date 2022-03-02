import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

function MapLibre() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [lng] = useState(139.753);
  const [lat] = useState(35.6844);
  const [zoom] = useState(14);
  const [API_KEY] = useState("9V8S1PVf6CfINuabJsSA");

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current !== null) {
      console.log("hier");
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic/style.json?key=9V8S1PVf6CfINuabJsSA`,
        center: [lng, lat],
        zoom: zoom,
      });
      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([139.7525, 35.6846])
        .addTo(map.current);
      // Add zoom and rotation controls to the map.
      map.current.addControl(new maplibregl.NavigationControl({}));
    }
  }, []);

  return (
    <div className="relative w-full h-(screen-20)">
      <div id="map" ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

export default MapLibre;
