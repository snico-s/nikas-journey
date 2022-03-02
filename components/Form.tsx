import React, { ChangeEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { LineString, MultiLineString } from "geojson";
import { gpx } from "@tmcw/togeojson";
import { read } from "fs";

type FormProps = {
  routeData: routeData;
  newData: boolean;
};

const Form = ({ routeData, newData }: FormProps) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<routeData>({
    date: routeData.date,
    title: routeData.title,
    text: routeData.text,
    outgoings: routeData.outgoings,
    distance: routeData.distance,
    route: routeData.route,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async () => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/routes/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status: " + res.status);
      }

      const { data } = await res.json();

      mutate(`/api/pets/${id}`, data, false); // Update the local data without a revalidation
      router.push("/");
    } catch (error) {
      setMessage("Failed to update");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async () => {
    try {
      const res = await fetch("/api/routes", {
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

      router.push("/");
    } catch (error) {
      setMessage("Failed to add");
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

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
              const feature = fc
                .features[0] as GeoJSON.Feature<MultiLineString>;
              setForm({
                ...form,
                route: feature,
              });
            }
          }
        }
      };
      reader.onerror = function (evt) {
        console.error("Fehler beim lesen");
      };
    }

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.value;

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    newData ? postData() : putData();
    // const errs = formValidate();
    // if (Object.keys(errs).length === 0) {
    //   newData ? postData() : putData();
    // } else {
    //   setErrors({ errs });
    // }
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err: any = {};
    if (!form.date) err.date = "Day is required";
    if (!form.title) err.title = "Title is required";
    if (!form.text) err.text = "Body is required";
    return err;
  };

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 rounded-lg sm:shadow sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
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
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="date">
                Tag
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  maxLength={20}
                  name="date"
                  value={form.date}
                  onChange={handleChangeInput}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="title">
                Titel
              </label>
              <input
                type="text"
                maxLength={20}
                name="title"
                value={form.title}
                onChange={handleChangeInput}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="text">
                Text
              </label>
              <textarea
                maxLength={200}
                name="text"
                value={form.text}
                onChange={handleChangeTextArea}
                required
                rows={10}
              />
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

export default Form;
