import React, { useState } from "react";
import { useRouter } from "next/router";
import { Feature, LineString } from "geojson";
import AddRoute from "./AddRoute";

const AddTravelDay = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [distance, setDistance] = useState(70);
  const [route, setRoute] = useState<Feature<LineString> | null>(null);

  const contentType = "application/json";

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

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
        setLoading(false);
        throw new Error("Status" + res.status);
      }

      setLoading(false);
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
      {!loading ? (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 rounded-lg sm:shadow sm:px-10">
            <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
              {/* GPX Upload */}
              <AddRoute route={route} setRoute={setRoute} setDate={setDate} />

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
      ) : (
        <div className="text-center mt-4">
          <div role="status">
            <svg
              className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTravelDay;
