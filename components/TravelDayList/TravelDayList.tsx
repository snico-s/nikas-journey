import { TimeLine, TimeLineHasTravelDays, TravelDay } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/Modal";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

const TravelDayList = () => {
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [showDelete, setShowDeleteModal] = useState(false);
  const [selectedTravelDayId, setSelectedTravelDayId] = useState(0);
  const [deleteTravelDayId, setDeleteTravelDayId] = useState<number | null>(
    null
  );
  const [selectedTimeLine, setSelectedTimeLine] = useState(1);

  const { data: session } = useSession();
  const userId = session?.user.id;

  const {
    data: travelDays,
    error,
    isLoading,
  } = useSWR<
    (TravelDay & {
      timeLineTravelDays: (TimeLineHasTravelDays & {
        timeLine: TimeLine;
      })[];
    })[]
  >(`/api/travel-day`, fetcher);

  const {
    data: timelines,
    error: error2,
    isLoading: isLoading2,
  } = useSWR<TimeLine[]>(`/api/timeline/${userId}`, fetcher);

  if (isLoading || isLoading2)
    return (
      <div className="relative w-full h-(screen-320) md:h-(screen-20)">
        <div className="grid h-screen place-items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  if (error || error2 || !travelDays || !timelines) return <div>"Hoppla!"</div>;

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

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status" + res.status);
      }

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

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status" + res.status);
      }
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

      setShowAddToCollection(false);
    } catch (error) {}
  };

  return (
    <div>
      <ul>
        {travelDays.map((day) => (
          <li
            key={day.id}
            className="block mb-2 bg-white border border-gray-200 rounded-lg shadow hover:border-green-500"
          >
            <div className="bg-gray-100 p-2 rounded-t-lg flex items-center">
              <h5 className="text-xl py-2 font-bold leading-none text-gray-900 ">
                {new Date(day.date).toLocaleDateString()}
              </h5>
            </div>
            <div className="p-2">
              <div>Titel: {day.title}</div>
              <div>Text: {day.body ? day.body.slice(0, 200) + " ..." : ""}</div>
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
                <Link href={"reise-tage/bearbeiten/" + day.id}>Bearbeiten</Link>
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
