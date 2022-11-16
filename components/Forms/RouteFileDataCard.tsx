import { Feature, LineString } from "geojson";
import React, { useEffect, useState } from "react";
import { RouteFileData } from "../../@types/custom";

type props = {
  routeFileData: RouteFileData;
  upload: boolean;
};

const RouteFileDataCard = (props: props) => {
  const [date, setDate] = useState(props.routeFileData.date);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [distance, setDistance] = useState<number>(
    parseFloat(props.routeFileData.distance.toFixed(2))
  );
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <div className="mb-2 p-4 rounded-lg border border-gray-200 shadow-md hover:border-gray-600 ">
        <div className="flex">
          {/* {props.upload &&  === null ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          ) : (
            null
          )} */}

          {props.routeFileData.uploaded !== null ? (
            <div className="ml-2">
              {props.routeFileData.uploaded ? "✅" : "❌"}
            </div>
          ) : (
            ""
          )}
          <h5 className="mb-2 ml-2 font-bold tracking-tight text-gray-900">
            {props.routeFileData.filename}
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
            onChange={(e) => setDistance(parseFloat(e.target.value))}
          />
        </div>

        <div className="border rounded border-gray-200 p-2 mt-4">
          <h2>
            <button
              type="button"
              className="flex items-center justify-between w-full font-semibold"
              onClick={() => setCollapsed(!collapsed)}
            >
              <span>Titel und Text</span>
              {!collapsed ? (
                <svg
                  data-accordion-icon
                  className="w-6 h-6 rotate-180 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  data-accordion-icon
                  className="w-6 h-6 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </h2>
          {!collapsed ? (
            <div className="mt-2">
              {/* Titel */}
              <div className="mb-2">
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
                <label className="block text-sm font-medium" htmlFor="body">
                  Text
                </label>
                <textarea
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteFileDataCard;
