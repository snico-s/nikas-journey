import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import maplibregl, { Coordinates, LngLatBounds } from "maplibre-gl";
import usePrevious from "../lib/usePrevious";
import { FeatureCollection, MultiLineString, Position } from "geojson";
import { Prisma } from "@prisma/client";
import { TravelDayWithRoute } from "../@types/custom";

interface boundMap {
  id: string;
  bounds: LngLatBounds;
}

const makeGeoJsonFeature = (
  id: string | number,
  type: string,
  coordinates: Prisma.JsonArray,
  properties: Prisma.JsonValue
) => {
  const geoJson = {
    type: "Feature",
    id: "" + id,
    geometry: {
      type,
      coordinates,
    },
    properties,
  } as GeoJSON.Feature<MultiLineString>;

  return geoJson;
};

type Props = {
  route: TravelDayWithRoute[];
  onClick: Dispatch<SetStateAction<string | null>>;
  selected: string | null;
  hovered: string | null;
  onHover: Dispatch<SetStateAction<string | null>>;
};

function MapLibre({ route, onClick, selected, hovered, onHover }: Props) {
  const [boundMap, setBoundMap] = useState<boundMap[]>([]);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const boundsMap = useRef(new Map<string, LngLatBounds>());
  const prevSelected: string | null | undefined = usePrevious(selected);
  const prevHoverd: string | null | undefined = usePrevious(hovered);
  const [API_KEY] = useState("9V8S1PVf6CfINuabJsSA");

  // const boundsMap = new Map<string, LngLatBounds>();

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
      // map.current.addControl(new maplibregl.AttributionControl(), "top-left");

      map.current.on("load", () => {
        // Add GeoJson
        route.forEach((routeitem, index) => {
          if (!routeitem.route[0] || !routeitem.route[0].travelDayId) return;
          const travelDayId: string = routeitem.route[0].travelDayId;

          const bounds = new maplibregl.LngLatBounds(
            routeitem.route[0].coordinates[0],
            routeitem.route[0].coordinates[1]
          );

          const routesArray = routeitem.route.map((route) => {
            const coordinates: Coordinates = route.coordinates;

            const feature = makeGeoJsonFeature(
              travelDayId + "-" + index,
              route.type,
              coordinates,
              route.properties
            );

            coordinates.forEach((coord) => {
              bounds.extend([coord[0], coord[1]]);
            });

            return feature;
          });

          const featureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: routesArray,
            bbox: [
              bounds._ne.lat,
              bounds._ne.lng,
              bounds._sw.lat,
              bounds._sw.lat,
            ],
          };
          const boundObj = { id: travelDayId, bounds: bounds };
          setBoundMap((oldArray) => [...oldArray, boundObj]);

          const geoJsonRoute = makeGeoJsonFeature(
            routeitem.route[0].travelDayId,
            routeitem.route[0].type,
            routeitem.route[0].coordinates,
            routeitem.route[0].properties
          );

          if (!map.current) return;
          map.current.addSource(geoJsonRoute.id as string, {
            type: "geojson",
            data: featureCollection,
          });

          map.current!.addLayer({
            id: geoJsonRoute.id as string,
            type: "line",
            source: geoJsonRoute.id as string,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 4,
            },
          });

          // map.current.on("mousemove", geoJsonRoute.id as string, function (e) {
          //   if (!e.features) return;
          //   // @ts-ignore
          //   onClick(e.features[0].layer.id as string);
          // });

          // Change the cursor to a pointer when the mouse is over the places layer.
          map.current.on("mouseenter", geoJsonRoute.id as string, function () {
            if (!map.current) return;
            onHover((geoJsonRoute.id + "") as string);
            map.current.getCanvas().style.cursor = "pointer";
          });

          // Change it back to a pointer when it leaves.
          map.current.on("mouseleave", geoJsonRoute.id as string, function () {
            if (!map.current) return;

            onHover(null);
            map.current.getCanvas().style.cursor = "";
          });

          map.current.on("click", geoJsonRoute.id as string, function (e) {
            if (!e.features) return;
            // @ts-ignore
            onClick(e.features[0].source as string);
          });
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!selected || !map.current) return;
    const selectedRoute = route.find((routeItem) => {
      const id = "" + routeItem.id;
      return id == selected;
    });

    if (!selectedRoute?.route) return;

    if (!selectedRoute.route[0] || !selectedRoute.route[0].travelDayId) return;
    const geoJsonRoute = makeGeoJsonFeature(
      selectedRoute.route[0].travelDayId!,
      selectedRoute.route[0].type,
      selectedRoute.route[0].coordinates,
      selectedRoute.route[0].properties
    );

    const coordinates: Prisma.JsonValue = selectedRoute?.route[0].coordinates;

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    if (!coordinates) return;

    // const bounds = new maplibregl.LngLatBounds(
    //   geoJsonRoute.geometry.coordinates[0],
    //   geoJsonRoute.geometry.coordinates[0]
    // );

    // // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    // for (const coord of geoJsonRoute.geometry.coordinates) {
    //   //@ts-ignore
    //   bounds.extend(coord);
    // }

    if (prevSelected) {
      map.current.setPaintProperty(prevSelected, "line-color", "#888");
    }

    map.current.setPaintProperty(selected, "line-color", "#16a34a");

    const bounds = boundMap.find((obj) => obj.id == selected)?.bounds;

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

  return (
    <div className="relative w-full h-(screen-320) md:h-(screen-20)">
      <div id="map" ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

export default MapLibre;
