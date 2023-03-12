import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Feature, LineString, MultiLineString } from "geojson";
import { gpx } from "@tmcw/togeojson";
import { TravelDay } from "@prisma/client";
import { fromMultiLineToLineString } from "../../lib/geoHelpers";
import AddRoute from "./AddRoute";
// import maplibregl from "maplibre-gl";
// import AddRoute from "./AddRoute";

type Props = {
  id: number;
};

const AddRouteForm = ({ id }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [message, setMessage] = useState("");
  const [route, setRoute] = useState<Feature<LineString> | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

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

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 rounded-lg sm:shadow sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            {/* GPX Upload */}
            <AddRoute route={route} setRoute={setRoute} />

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRouteForm;
