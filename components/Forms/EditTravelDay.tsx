import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { LineString, MultiLineString } from "geojson";
import { gpx } from "@tmcw/togeojson";
import { Prisma, PrismaClient, TravelDay } from "@prisma/client";

type Props = {
  id: number;
};

type TravelMapForm = {
  id: number;
  date: string;
  title: string;
  body: string;
  distance: number;
};

const EditTravelDay = ({ id }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [travelDay, setTravelDay] = useState<TravelMapForm>({
    id: 0,
    date: "",
    title: "",
    body: "",
    distance: 0,
  });
  // const [route, setRoute] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/travel-day/" + id);
      const data = await response.json();

      const travelDays: TravelDay[] = data.data;
      const travelDay = travelDays[0];

      setTravelDay({
        id: travelDay.id,
        date: new Date(travelDay.date).toISOString().slice(0, 10),
        title: travelDay.title!,
        body: travelDay.body!,
        distance: +travelDay.distance!,
      });
    };

    fetchData().catch(console.error);
  }, []);

  // const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const target = e.target;

  //   if (target.files != null) {
  //     const file = target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsText(file, "UTF-8");
  //     reader.onload = function (evt: ProgressEvent<FileReader>) {
  //       if (evt.target != null) {
  //         if (typeof evt.target.result === "string") {
  //           const result: string = evt.target.result;
  //           const fc = gpx(new DOMParser().parseFromString(result, "text/xml"));

  //           if (fc.features.length < 1) {
  //             setErrors({ features: "Keine Features vorhanden" });
  //             return console.error("Keine Fearutes vorhanden");
  //           }
  //           const type = fc.features[0].geometry.type;
  //           if (["LineString", "MultiLineString"].includes(type)) {
  //             const feature = fc
  //               .features[0] as GeoJSON.Feature<MultiLineString>;

  //             feature.geometry;

  //             setRoute({ feature });
  //           }
  //         }
  //       }
  //     };
  //     reader.onerror = function (evt) {
  //       console.error("Fehler beim lesen");
  //     };
  //   }
  // };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const errs = formValidate();
    if (Object.keys(errs).length > 0) {
      setErrors({ errs });
    }

    try {
      const res = await fetch("/api/travel-day/" + id, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          travelDay,
          // route,
        }),
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

  if (travelDay === null) <div>Loading</div>;

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 rounded-lg sm:shadow sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            {/* GPX Upload */}
            {/* <div>
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
            </div> */}

            {/* Datum */}
            <div>
              <label className="block text-sm font-medium" htmlFor="date">
                Tag
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  value={
                    travelDay?.date
                      ? new Date(travelDay.date).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setTravelDay({
                      ...travelDay,
                      date: e.target.value,
                    })
                  }
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
                value={travelDay?.title ? travelDay.title : ""}
                onChange={(e) =>
                  setTravelDay({ ...travelDay, title: e.target.value })
                }
              />
            </div>

            {/* Text */}
            <div>
              <label className="block text-sm font-medium" htmlFor="text">
                Text
              </label>
              <textarea
                name="body"
                value={travelDay?.body ? travelDay.body : ""}
                onChange={(e) =>
                  setTravelDay({ ...travelDay, body: e.target.value })
                }
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
                value={Number(travelDay.distance).toString()}
                onChange={(e) =>
                  setTravelDay({ ...travelDay, distance: +e.target.value })
                }
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

export default EditTravelDay;
