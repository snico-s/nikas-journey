import React, { useEffect, useRef } from "react";
import {
  Feature,
  GeoJsonProperties,
  LineString,
  MultiLineString,
} from "geojson";
import { gpx } from "@tmcw/togeojson";
import { fromMultiLineToLineString } from "./../../lib/geoHelpers";
import maplibregl from "maplibre-gl";
import simplify from "@turf/simplify";
import truncate from "@turf/truncate";
import turfLength from "@turf/length";

type Props = {
  route: Feature<LineString> | null;
  setRoute: React.Dispatch<
    React.SetStateAction<Feature<LineString, GeoJsonProperties> | null>
  >;
  setDate: React.Dispatch<React.SetStateAction<string>>;
};

const AddRoute = ({ route, setRoute, setDate }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

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
    }
  }, []);

  useEffect(() => {
    if (map.current == null || route === null) return;
    if (!map.current.isStyleLoaded()) return;

    const source = map.current.getSource("route");
    if (source) {
      // @ts-ignore
      source.setData(route);
    } else {
      map.current.addSource("route", {
        type: "geojson",
        data: route,
      });
      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      });
    }

    // Zoom to Track
    const coordinates = route.geometry.coordinates;
    const bounds = coordinates.reduce(function (bounds, coord) {
      return bounds.extend([coord[0], coord[1]]);
    }, new maplibregl.LngLatBounds(coordinates[0], coordinates[1]));
    map.current.fitBounds(bounds, {
      padding: 20,
    });
  }, [route]);

  const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.files != null && target.files.length > 0) {
      const file = target.files[0];
      console.log(file);

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target != null) {
          if (typeof evt.target.result === "string") {
            const result: string = evt.target.result;

            // Convert to FeatureCollection
            const fc = gpx(new DOMParser().parseFromString(result, "text/xml"));

            if (fc.features.length < 1) {
              return console.error("Keine Fearutes vorhanden");
            }

            console.log(fc);

            let properties = {};
            let geoJson = {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [],
              },
              properties,
            } as GeoJSON.Feature<LineString>;

            // Combine all Features from one FC to one LineString
            for (let i = 0; i < fc.features.length; i++) {
              const type = fc.features[i].geometry.type;

              if (["LineString", "MultiLineString"].includes(type)) {
                let feature;

                if (type === "MultiLineString") {
                  const tmpFeature = fc.features[
                    i
                  ] as GeoJSON.Feature<MultiLineString>;
                  feature = fromMultiLineToLineString(tmpFeature);
                } else {
                  feature = fc.features[i] as GeoJSON.Feature<LineString>;
                }

                feature.geometry.coordinates.forEach((coordinate) => {
                  geoJson.geometry.coordinates.push(coordinate);
                });

                // TODO: Properties aneinander reihen
                Object.assign(properties, feature.properties);
              }
            }

            var length = turfLength(geoJson, { units: "kilometers" });
            console.log(
              "🚀 ~ file: AddRoute.tsx ~ line 140 ~ handleGpxInput ~ length",
              length
            );

            // Read Date
            if (geoJson.properties != null && geoJson.properties.time != null) {
              const time: string = geoJson.properties.time;
              setDate(time.slice(0, 10));
            }

            console.log(geoJson);
            const options = { tolerance: 0.001, highQuality: false };
            const simplified = simplify(geoJson, options);
            console.log(simplified);

            var optionsTruncate = { precision: 3 };
            var truncated = truncate(simplified, optionsTruncate);
            console.log(truncated);

            setRoute(simplified);
          }
        }
      };

      reader.onerror = function (evt) {
        console.error("Fehler beim lesen");
      };
    }
  };

  return (
    <div>
      {/* GPX Upload */}
      <div className="py-4">
        <label className="block text-sm font-medium" htmlFor="date">
          GPX-Datei
        </label>
        <div className="mt-1">
          <input
            type="file"
            maxLength={20}
            name="gpx"
            onChange={handleGpxInput}
            onClick={() => console.log("hier")}
          />
        </div>
      </div>

      <div>
        <div className="relative w-full h-96">
          <div id="map" ref={mapContainer} className="absolute w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default AddRoute;
