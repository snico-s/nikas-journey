import { Feature } from "@turf/turf";
import { LineString } from "geojson";
import React, { useEffect, useState } from "react";
import UploadIcon from "./UploadIcon";

type Props = {
  date: Date;
  distance: number;
  upload: boolean;
  route: Feature<LineString>;
};

const RouteFileDataCard = (props: Props) => {
  const [date, setDate] = useState(
    new Date(props.date).toISOString().slice(0, 10)
  );
  const [distance, setDistance] = useState<number>(
    parseFloat(props.distance.toFixed(2))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (props.upload) handleUpload();
  }, [props.upload]);

  const handleUpload = async () => {
    console.log("Upload");
    setIsLoading(true);
    const route = props.route;

    const form = { date, route, distance };

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
        setIsSuccess(false);
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      console.error("Upload fehlgeschlagen: ", props.date);
    }
  };

  return (
    <div>
      <div className="mb-2 p-4 rounded-lg border border-gray-200 shadow-md hover:border-gray-600 ">
        <div className="flex">
          {props.upload ? (
            <UploadIcon isLoading={isLoading} isSuccess={isSuccess} />
          ) : (
            ""
          )}
          <h5 className="mb-2 ml-2 font-bold tracking-tight text-gray-900">
            {props.date.toDateString()}
          </h5>
        </div>

        {/* Datum */}
        <div className="mb-2 ">
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

        {/* Distanz */}
        <div className="mb-2">
          <label className=" block text-sm font-medium" htmlFor="distance">
            Distanz
          </label>
          <input
            type="number"
            name="distance"
            value={distance}
            onChange={(e) => {
              const newDistance: number = parseFloat(e.target.value);
              const fixedValue: string = newDistance.toFixed(2);
              setDistance(parseFloat(fixedValue));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteFileDataCard;
