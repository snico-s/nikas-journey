import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import maplibregl from "maplibre-gl";
import usePrevious from "../lib/usePrevious";

type Props = {
  route: Array<routeData>;
  onClick: Dispatch<SetStateAction<string | null>>;
  selected: string | null;
};

function MapLibre({ route, onClick, selected }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const prevSelected: string | null | undefined = usePrevious(selected);
  const [API_KEY] = useState("9V8S1PVf6CfINuabJsSA");

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current !== null) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic/style.json?key=9V8S1PVf6CfINuabJsSA`,
        center: [10.524923744378782, 52.240802508845604],
        zoom: 14,
        // attributionControl: false,
      });
      // Add zoom and rotation controls to the map.
      map.current.addControl(new maplibregl.NavigationControl({}));
      // map.current.addControl(new maplibregl.AttributionControl(), "top-left");

      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([10.524923744378782, 52.240802508845604])
        .addTo(map.current);

      map.current.on("load", () => {
        // Add GeoJson
        route.map((routeitem) => {
          console.log(routeitem.route);
          map.current!.addSource(routeitem.route?.id! as string, {
            type: "geojson",
            data: routeitem.route,
          });

          map.current!.addLayer({
            id: routeitem._id! as string,
            type: "line",
            source: routeitem.route?.id! as string,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 4,
            },
          });

          map.current!.on(
            "mousemove",
            routeitem.route?.id! as string,
            function (e) {
              console.log(e);
              if (!e.features) return;
              // @ts-ignore
              onClick(e.features[0].layer.id);
            }
          );

          map.current!.on(
            "touchstart",
            routeitem.route?.id! as string,
            function (e) {
              console.log(e);
              if (!e.features) return;
              // @ts-ignore
              onClick(e.features[0].layer.id);
            }
          );
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!selected || !map.current) return;
    const selectedRoute = route.find((data) => data._id === selected);

    if (!selectedRoute?.route) return;
    const coordinates = selectedRoute?.route.geometry.coordinates;

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new maplibregl.LngLatBounds(coordinates[0], coordinates[0]);

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    for (const coord of coordinates) {
      bounds.extend(coord);
    }

    if (prevSelected) {
      map.current.setPaintProperty(prevSelected, "line-color", "#888");
    }

    map.current.setPaintProperty(selected, "line-color", "#F7455D");
    console.log(map.current);

    map.current.fitBounds(bounds, {
      padding: 20,
    });
  }, [selected]);

  return (
    <div className="relative w-full h-(screen-320) md:h-(screen-20)">
      <div id="map" ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

export default MapLibre;
