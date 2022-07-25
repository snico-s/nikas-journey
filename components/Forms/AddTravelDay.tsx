import React, { useState } from "react";
import { useRouter } from "next/router";
import { Feature, LineString } from "geojson";
import AddRoute from "./AddRoute";

const AddTravelDay = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [distance, setDistance] = useState(70);
  const [route, setRoute] = useState<Feature<LineString> | null>(null);

  const contentType = "application/json";

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const errs = formValidate();
    if (Object.keys(errs).length > 0) {
      setErrors({ errs });
    }

    const form = { date, title, body, route, distance };

    try {
      const res = await fetch("/api/travel-day", {
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
    if (!date) err.date = "Day is required";
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
            <AddRoute route={route} setRoute={setRoute} />

            {/* Datum */}
            <div>
              <label className="block text-sm font-medium" htmlFor="date">
                Tag
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Titel */}
            <div>
              <label className="block text-sm font-medium" htmlFor="title">
                Titel
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Text */}
            <div>
              <label className="block text-sm font-medium" htmlFor="text">
                Text
              </label>
              <textarea
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
              />
            </div>

            {/* Distanz */}
            <div>
              <label className="block text-sm font-medium" htmlFor="distance">
                Distanz
              </label>
              <input
                type="number"
                name="distance"
                value={Number(distance).toString()}
                onChange={(e) => setDistance(+e.target.value)}
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

export default AddTravelDay;
