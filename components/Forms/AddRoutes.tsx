import React, { useState } from "react";
import { FileData, TravelDayData } from "../../@types/custom";

import { concatLineStrings, gpxToLineString } from "../../lib/geoHelpers";
import length from "@turf/length";

import RouteFileDataCard from "./RouteFileDataCard";

const sameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const AddRoutes = () => {
  const [numberOfSelectedFiles, setNumberOfSelectedFiles] = useState(0);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [unsuccessful, setUnsuccessful] = useState<string[]>([]);
  const [upload, setUpload] = useState(false);
  const [travelDayDataList, setTravelDayDataList] = useState<TravelDayData[]>(
    []
  );

  const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.files != null && target.files.length > 0) {
      setNumberOfSelectedFiles(target.files.length);

      // Reset
      setTravelDayDataList([]);
      setUnsuccessful([]);
      setProcessedFiles(0);

      for (let i = 0; i < target.files.length; i++) {
        const file = target.files[i];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = function (event: ProgressEvent<FileReader>) {
          if (event.target === null || typeof event.target.result !== "string")
            return;

          const lineString = gpxToLineString(event.target.result);

          if (lineString === null) {
            setUnsuccessful((prev) => [...prev, file.name]);
            setProcessedFiles((prev) => (prev += 1));
            return;
          }

          const time = lineString.properties.time;
          const date = new Date(time.slice(0, 10));
          const distance = length(lineString, { units: "kilometers" });

          const routeFileData: FileData = {
            filename: file.name,
            date,
            lineString,
            distance,
          };

          setTravelDayDataList((prev) => {
            const dateExists =
              prev.findIndex((item) => {
                return sameDate(item.date, date);
              }) > -1;

            // new Entry, if Date not exists
            if (prev.length === 0 || !dateExists) {
              return [
                ...prev,
                {
                  date,
                  lineString,
                  fileData: [routeFileData],
                  totalDistance: distance,
                },
              ];
            }

            const next: TravelDayData[] = prev.map((item) => {
              if (!sameDate(item.date, date)) return item;

              const newDistance = item.totalDistance + distance;
              const newLineString = concatLineStrings(
                item.lineString,
                lineString
              );
              return {
                ...item,
                lineString: newLineString,
                totalDistance: newDistance,
                fileData: [...item.fileData, routeFileData],
              };
            });

            return next;
          });

          setProcessedFiles((prev) => (prev += 1));
        };

        reader.onerror = function (evt) {
          console.error("Fehler beim lesen");
        };
      }
    }
  };

  return (
    <div>
      {/* GPX Upload */}
      <div className="py-4 px-2">
        <label className="block text-sm font-medium" htmlFor="gpx">
          GPX-Datei
        </label>
        <input type="file" name="gpx" onChange={handleGpxInput} multiple />

        {processedFiles !== 0 || numberOfSelectedFiles !== 0 ? (
          <div className="mt-2">
            <div>
              GPX-Dateien verarbeitet: {processedFiles} /{" "}
              {numberOfSelectedFiles}
            </div>
            {processedFiles === numberOfSelectedFiles &&
            numberOfSelectedFiles > 0 ? (
              <button
                className="btn btn-primary"
                onClick={() => setUpload(true)}
              >
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

      {numberOfSelectedFiles > 0 && numberOfSelectedFiles === processedFiles
        ? travelDayDataList
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((data, index) => (
              <RouteFileDataCard
                key={index}
                upload={upload}
                distance={data.totalDistance}
                date={data.date}
                route={data.lineString}
              />
            ))
        : ""}
    </div>
  );
};

export default AddRoutes;
