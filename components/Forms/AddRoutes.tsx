import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { RouteFileData } from "../../@types/custom";

import {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
  LineString,
  MultiLineString,
} from "geojson";
import maplibregl from "maplibre-gl";
import { gpx } from "@tmcw/togeojson";
import { fromMultiLineToLineString } from "./../../lib/geoHelpers";
import simplify from "@turf/simplify";
import truncate from "@turf/truncate";
import length from "@turf/length";
import RouteFileDataCard from "./RouteFileDataCard";

const gpxToLineString = (result: string) => {
  const fc: FeatureCollection<Geometry, GeoJsonProperties> = gpx(
    new DOMParser().parseFromString(result, "text/xml")
  );

  if (fc.features.length < 1) {
    console.error("Keine Fearutes vorhanden in");
    return null;
  }

  if (fc.features.length > 1) {
    console.warn("Mehrere Featueres vorhanden: ");
  }

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
  for (let j = 0; j < fc.features.length; j++) {
    const type = fc.features[j].geometry.type;

    if (!["LineString", "MultiLineString"].includes(type)) continue;

    let feature;

    if (type === "MultiLineString") {
      const tmpFeature = fc.features[j] as GeoJSON.Feature<MultiLineString>;
      feature = fromMultiLineToLineString(tmpFeature);
    } else {
      feature = fc.features[j] as GeoJSON.Feature<LineString>;
    }

    feature.geometry.coordinates.forEach((coordinate) => {
      geoJson.geometry.coordinates.push(coordinate);
    });

    Object.assign(properties, feature.properties);
  }

  return geoJson;
};

const AddRoutes = () => {
  const [routeFileData, setRouteFileData] = useState<RouteFileData[]>([]);
  const [numberOfSelectedFiles, setNumberOfSelectedFiles] = useState(0);
  const [processedData, setProcessedData] = useState(0);
  const [unsuccessful, setUnsuccessful] = useState<string[]>([]);
  const [upload, setUpload] = useState(false);

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
    if (processedData !== numberOfSelectedFiles || numberOfSelectedFiles == 0) {
      return;
    }
    // console.log(features);

    let featureCollection: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };

    routeFileData.forEach((data) => {
      const geoJson = data.geoJson;
      featureCollection.features.push(geoJson);
    });

    console.log(featureCollection);
    if (map.current == null || featureCollection === null) return;
    if (!map.current.isStyleLoaded()) return;

    const source = map.current.getSource("route");
    if (source) {
      // @ts-ignore
      source.setData(featureCollection);
    } else {
      map.current.addSource("route", {
        type: "geojson",
        data: featureCollection,
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
  }, [processedData]);

  const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.files != null && target.files.length > 0) {
      setRouteFileData([]);
      setUnsuccessful([]);
      setProcessedData(0);
      setNumberOfSelectedFiles(target.files.length);

      for (let i = 0; i < target.files.length; i++) {
        const file = target.files[i];
        console.log(file);
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = async function (evt: ProgressEvent<FileReader>) {
          if (evt.target != null) {
            if (typeof evt.target.result === "string") {
              const geoJson = gpxToLineString(evt.target.result);
              if (geoJson === null) {
                setUnsuccessful((prev) => [...prev, file.name]);
                setProcessedData((prev) => (prev += 1));
                return;
              }

              let date: string = "";
              if (
                geoJson.properties !== null &&
                geoJson.properties.time !== null
              ) {
                const time: string = geoJson.properties.time;
                date = time.slice(0, 10);
              }

              const simplified = simplify(geoJson, {
                tolerance: 0.001,
                highQuality: false,
              });
              const truncated = truncate(simplified, { precision: 3 });
              const distance = length(geoJson, { units: "kilometers" });

              const travelDayData: RouteFileData = {
                filename: file.name,
                date,
                truncated,
                geoJson,
                distance,
                uploaded: null,
              };

              setRouteFileData((oldFeatures) => [
                ...oldFeatures,
                travelDayData,
              ]);
              setProcessedData((prev) => (prev += 1));
            }
          }
        };

        reader.onerror = function (evt) {
          console.error("Fehler beim lesen");
        };
      }
      console.log("finish");
    }
  };

  useEffect(() => {
    uploader();
  }, [upload]);

  const uploader = async () => {
    let uploaded = 0;
    for (const routeData of routeFileData) {
      const form = {
        date: routeData.date,
        title: "",
        body: "",
        route: routeData.geoJson,
        distance: routeData.distance,
      };

      try {
        const res = await fetch("/api/travel-day", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
          setRouteFileData((old) => {
            const index = old.findIndex(
              (d) => d.filename === routeData.filename
            );
            old[index].uploaded = false;
            return [...old];
          });
          throw new Error("Status" + res.status);
        }

        setRouteFileData((old) => {
          // const actualData = old.find((d) => d.filename === routeData.filename);
          // actualData?.uploaded = true;
          const index = old.findIndex((d) => d.filename === routeData.filename);
          old[index].uploaded = true;
          return [...old];
        });
      } catch (error) {
        setRouteFileData((old) => {
          const index = old.findIndex((d) => d.filename === routeData.filename);
          old[index].uploaded = false;
          return [...old];
        });
        console.error(routeData.filename, " konnte nicht hoch geladen werden");
      }
    }
    uploaded += 1;
    console.log(uploaded);
  };

  return (
    <div>
      {/* GPX Upload */}
      <div className="py-4 px-2">
        <label className="block text-sm font-medium" htmlFor="gpx">
          GPX-Datei
        </label>
        <input type="file" name="gpx" onChange={handleGpxInput} multiple />

        <div className="relative w-full h-96">
          <div id="map" ref={mapContainer} className="absolute w-full h-full" />
        </div>

        {processedData !== 0 || numberOfSelectedFiles !== 0 ? (
          <div className="mt-2">
            <div>
              GPX-Dateien verarbeitet: {processedData} / {numberOfSelectedFiles}
            </div>
            {processedData === numberOfSelectedFiles &&
            numberOfSelectedFiles > 0 ? (
              <button className="btn" onClick={() => setUpload(true)}>
                Upload
              </button>
            ) : (
              <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                Upload
              </button>
            )}
          </div>
        ) : (
          ""
        )}

        {unsuccessful.length > 0 ? (
          <div className="mt-2">
            Erfolglose Verarbeitung:
            <ul className="pl-4">
              {unsuccessful.map((filename, index) => (
                <li className="list-disc" key={index}>
                  {filename}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>

      {routeFileData.map((data, index) => (
        <RouteFileDataCard upload={upload} key={index} routeFileData={data} />
      ))}
    </div>
  );
};

AddRoutes.propTypes = {};

export default AddRoutes;
