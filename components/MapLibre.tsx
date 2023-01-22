import React, { useRef, useEffect, Dispatch, SetStateAction } from "react";
import maplibregl from "maplibre-gl";
import usePrevious from "../lib/usePrevious";
import { FeatureCollection, LineString, Position } from "geojson";
import useSWR from "swr";
import LoadingSpinner from "./ui/LoadingSpinner";
const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

const makeLineString = (id: string, coordinates: Position[]) => {
  return {
    type: "Feature",
    id: id,
    geometry: {
      type: "LineString",
      coordinates,
    },
  } as GeoJSON.Feature<LineString>;
};

type Route = {
  travelDayId: string;
  simplifiedCoordinates: Position[];
};

type Props = {
  onClick: Dispatch<SetStateAction<string | null>>;
  selected: string | null;
  hovered: string | null;
  onHover: Dispatch<SetStateAction<string | null>>;
  userId: number;
  timeLineName: string;
};

function MapLibre({
  onClick,
  selected,
  hovered,
  onHover,
  userId,
  timeLineName,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const prevSelected: string | null | undefined = usePrevious(selected);
  const prevHoverd: string | null | undefined = usePrevious(hovered);

  const {
    data: routes,
    error,
    isLoading,
  } = useSWR<Route[][]>(
    `/api/timeline/${userId}/${timeLineName}/simplified`,
    fetcher
  );

  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current !== null) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic/style.json?key=9V8S1PVf6CfINuabJsSA`,
        center: [15.176529, 47.406018],
        zoom: 3,
        // attributionControl: false,
      });
      // Add zoom and rotation controls to the map.
      map.current.addControl(new maplibregl.NavigationControl({}));

      map.current.on("load", () => {
        // Add GeoJson
        if (!routes) return;

        console.log(routes);
        const features = routes.map((route) => {
          console.log(route);
          const line = route
            .map((routeItem) => {
              console.log(routeItem);
              return routeItem.simplifiedCoordinates;
            })
            .flat();
          return makeLineString(route[0].travelDayId, line);
        });

        const featureCollection: FeatureCollection = {
          type: "FeatureCollection",
          features: features,
        };

        console.log(featureCollection);

        featureCollection.features.forEach((feature) => {
          if (!map.current) return;
          const id = "" + feature.id;
          map.current.addSource(id, {
            type: "geojson",
            data: feature,
          });

          map.current!.addLayer({
            id: id,
            type: "line",
            source: id,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 4,
            },
          });

          // Change the cursor to a pointer when the mouse is over the places layer.
          map.current.on("mouseenter", id, function () {
            if (!map.current) return;
            onHover(id);
            map.current.getCanvas().style.cursor = "pointer";
          });

          // Change it back to a pointer when it leaves.
          map.current.on("mouseleave", id, function () {
            if (!map.current) return;

            onHover(null);
            map.current.getCanvas().style.cursor = "";
          });

          map.current.on("click", id, function (e) {
            if (!e.features) return;
            const travelDayId = "" + e.features[0].id;
            onClick(travelDayId);
          });
        });
      });
    }
  }, [routes]);

  useEffect(() => {
    if (!selected || !map.current || !routes) return;

    const selectedRoute = routes.find((routeItem) => {
      const travelDayId = "" + routeItem[0].travelDayId;
      return travelDayId == selected;
    });

    if (!selectedRoute) return;

    const coordinates = selectedRoute
      .map((routes) => routes.simplifiedCoordinates)
      .flat();

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    if (!coordinates) return;

    const bounds = new maplibregl.LngLatBounds(coordinates[0], coordinates[0]);

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    for (const coord of coordinates) {
      const p1 = coord[0];
      const p2 = coord[1];

      bounds.extend([p1, p2]);
    }

    if (prevSelected) {
      map.current.setPaintProperty(prevSelected, "line-color", "#888");
    }

    map.current.setPaintProperty(selected, "line-color", "#16a34a");

    // const bounds = boundMap.find((obj) => obj.id == selected)?.bounds;

    if (bounds) {
      map.current.fitBounds(bounds, {
        padding: 20,
      });
    }
  }, [selected]);

  useEffect(() => {
    if (!map.current) return;
    if (!map.current.isStyleLoaded()) return;

    if (prevHoverd) {
      map.current.setPaintProperty(prevHoverd, "line-color", "#888");
    }

    // color tailwind green-400
    if (hovered) map.current.setPaintProperty(hovered, "line-color", "#4ade80");

    if (selected) {
      // color tailwind green-600
      map.current.setPaintProperty(selected, "line-color", "#16a34a");
    }
  }, [hovered, selected]);

  if (error) return <div>Hoppla, da lief was schief</div>;

  if (isLoading)
    return (
      <div className="relative w-full h-(screen-320) md:h-(screen-20)">
        <div className="grid h-screen place-items-center">
          <LoadingSpinner />
        </div>
      </div>
    );

  return (
    <div className="relative w-full h-(screen-320) md:h-(screen-20)">
      <div id="map" ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

export default MapLibre;
