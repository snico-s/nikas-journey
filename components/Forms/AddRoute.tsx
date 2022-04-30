import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { LineString, MultiLineString } from "geojson";
import { gpx } from "@tmcw/togeojson";
import { TravelDay } from "@prisma/client";

type Props = {
  id: number;
};

const makeLineString = (feature: GeoJSON.Feature<MultiLineString>) => {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: feature.geometry.coordinates.flat(),
    },
    properties: feature.properties,
  };
};

const AddRoute = ({ id }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [route, setRoute] = useState({});

  const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.files != null) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt: ProgressEvent<FileReader>) {
        if (evt.target != null) {
          if (typeof evt.target.result === "string") {
            const result: string = evt.target.result;
            const fc = gpx(new DOMParser().parseFromString(result, "text/xml"));

            console.log(fc);
            if (fc.features.length < 1) {
              setErrors({ features: "Keine Features vorhanden" });
              return console.error("Keine Fearutes vorhanden");
            }
            const type = fc.features[0].geometry.type;
            if (["LineString", "MultiLineString"].includes(type)) {
              let feature;
              if (type === "MultiLineString") {
                const tmpFeature = fc
                  .features[0] as GeoJSON.Feature<MultiLineString>;
                feature = makeLineString(tmpFeature);
              } else {
                feature = fc.features[0] as GeoJSON.Feature<LineString>;
              }

              setRoute(feature);
            }
          }
        }
      };
      reader.onerror = function (evt) {
        console.error("Fehler beim lesen");
      };
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const errs = formValidate();
    if (Object.keys(errs).length > 0) {
      setErrors({ errs });
    }

    const form = { route };

    try {
      const res = await fetch("/api/travel-day/" + id + "/route", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status" + res.status);
      }

      router.push("/admin/reise-tage");
    } catch (error) {
      setMessage("Failed to add");
    }
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err: any = {};
    // if (!date) err.date = "Day is required";
    // if (!form.title) err.title = "Title is required";
    // if (!form.body) err.text = "Body is required";
    return err;
  };

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 rounded-lg sm:shadow sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            {/* GPX Upload */}
            <div>
              <label className="block text-sm font-medium" htmlFor="date">
                GPX-Datei
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  maxLength={20}
                  name="gpx"
                  onChange={handleGpxInput}
                />
              </div>
            </div>

            <button type="submit" className="btn">
              Submit
            </button>
          </form>
          <p>{message}</p>
          <div>
            {Object.keys(errors).map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoute;
