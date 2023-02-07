import { TimeLine, TimeLineHasTravelDays, TravelDay } from "@prisma/client";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import Modal from "../ui/Modal";
import { useRouter } from "next/router";

type Props = {
  travelDays: (TravelDay & {
    timeLineTravelDays: (TimeLineHasTravelDays & {
      timeLine: TimeLine;
    })[];
  })[];
  timelines: TimeLine[];
};

const TravelDayList = ({ travelDays, timelines }: Props) => {
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [showDelete, setShowDeleteModal] = useState(false);
  const [selectedTravelDayId, setSelectedTravelDayId] = useState(0);
  const [deleteTravelDayId, setDeleteTravelDayId] = useState<number | null>(
    null
  );
  const [selectedTimeLine, setSelectedTimeLine] = useState(1);
  const [timelineFilter, setTimelineFilter] = useState<number | null>(null);

  const router = useRouter();

  const handleAddToCollection = async () => {
    try {
      const res = await fetch(
        "/api/travel-day/" + selectedTravelDayId + "/timeline/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeLineId: selectedTimeLine }),
        }
      );

      if (!res.ok) {
        throw new Error("Status" + res.status);
      }
      router.replace(router.asPath, undefined, { scroll: false });
      setShowAddToCollection(false);
    } catch (error) {}
  };

  const handleDeleteTravelDay = async () => {
    console.log("handleDeleteTravelDay");
    try {
      if (!deleteTravelDayId) return;
      const res = await fetch("/api/travel-day/" + deleteTravelDayId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Status" + res.status);
      }
      router.replace(router.asPath, undefined, { scroll: false });
      setDeleteTravelDayId(null);
      console.log("DELETED");
    } catch (error) {}
  };

  const handleDeleteFromTimeline = async (
    travelDayId: number,
    timelineId: number
  ) => {
    try {
      const res = await fetch("/api/travel-day/" + travelDayId + "/timeline/", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timeLineId: timelineId }),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status" + res.status);
      }
      router.replace(router.asPath, undefined, { scroll: false });
      setShowAddToCollection(false);
    } catch (error) {}
  };

  return (
    <div>
      <ul>
        {travelDays
          .filter((day) => {
            if (!timelineFilter) return true;
            const timelines = day.timeLineTravelDays.map(
              (item) => item.timeLineId
            );
            console.log(timelines);
            const isIn = timelines.includes(timelineFilter);
            return isIn;
          })
          .map((day) => (
            <li
              key={day.id}
              className="block mb-2 bg-white border border-gray-200 rounded-lg shadow hover:border-green-500"
            >
              <div className="bg-gray-100 p-2 rounded-t-lg flex items-center">
                <h5 className="text-xl py-2 font-bold leading-none text-gray-900 ">
                  <time>
                    <Suspense fallback={<div></div>}>
                      {new Date(day.date).toLocaleDateString()}
                    </Suspense>
                  </time>
                </h5>
              </div>
              <div className="p-2">
                <div>Titel: {day.title}</div>
                <div>
                  Text: {day.body ? day.body.slice(0, 200) + " ..." : ""}
                </div>
                <div>
                  Collections:{" "}
                  {day.timeLineTravelDays.map((timelines, index) => (
                    <div
                      key={index}
                      className="inline-flex rounded-md shadow-sm"
                      role="group"
                    >
                      <button
                        type="button"
                        className="px-2 py-1 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                        onClick={() => setTimelineFilter(timelines.timeLineId)}
                      >
                        {timelines.timeLine.name}
                      </button>

                      <button
                        type="button"
                        className="px-3 text-xs font-medium text-gray-900 bg-white border border-l-0 border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                        onClick={() =>
                          handleDeleteFromTimeline(
                            timelines.travelDayId,
                            timelines.timeLineId
                          )
                        }
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap mt-4">
                <button className="btn">
                  <Link href={"reise-tage/bearbeiten/" + day.id}>
                    Bearbeiten
                  </Link>
                </button>
                <button className="btn">
                  <Link href={"reise-tage/" + day.id + "/route-hinzufuegen"}>
                    Route hinzufügen
                  </Link>
                </button>

                <button
                  onClick={() => {
                    setSelectedTravelDayId(day.id);
                    setShowAddToCollection(true);
                  }}
                  className="btn"
                >
                  Zur Timeline hinzufügen
                </button>

                <button
                  onClick={() => {
                    setDeleteTravelDayId(day.id);
                    setShowDeleteModal(true);
                  }}
                  className="btn"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
      </ul>
      {showAddToCollection ? (
        <Modal
          setShowModal={setShowAddToCollection}
          title="Collection hinzufügen"
          onSubmit={handleAddToCollection}
        >
          Welcher Collection zuweisen?
          <select
            name="currency"
            value={selectedTimeLine}
            onChange={(e) => setSelectedTimeLine(+e.target.value)}
          >
            <option value={0}>"Bitte Collection auswählen"</option>
            {timelines.map((timeLine) => (
              <option key={timeLine.id} value={timeLine.id}>
                {timeLine.name}
              </option>
            ))}
          </select>
        </Modal>
      ) : (
        ""
      )}
      {showDelete ? (
        <Modal
          setShowModal={setShowDeleteModal}
          onSubmit={handleDeleteTravelDay}
          title="Tag löschen"
        >
          Wirklich löschen?
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default TravelDayList;
