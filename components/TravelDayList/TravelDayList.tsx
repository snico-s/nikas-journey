import { TimeLine } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { TravelDayWithRoute } from "../../@types/custom";
import Modal from "../ui/Modal";

type Props = {
  travelDays: TravelDayWithRoute[];
  timeLines: TimeLine[];
};

const TravelDayList = ({ travelDays, timeLines }: Props) => {
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [showDelete, setShowDeleteModal] = useState(false);
  const [selectedTravelDayId, setSelectedTravelDayId] = useState(0);
  const [selectedTimeLine, setSelectedTimeLine] = useState(1);

  const handleAddToCollection = async () => {
    try {
      const res = await fetch(
        "/api/travel-day/" + selectedTravelDayId + "/add-to-collection/",
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

  return (
    <div>
      {" "}
      <ul>
        {travelDays.map((day) => (
          <li key={day.id} className="p-2">
            <div>ID: {day.id}</div>
            <div>Date: {new Date(day.date).toLocaleDateString()}</div>
            <div>Titel: {day.title}</div>
            <div>Text: {day.body ? day.body.slice(0, 200) + " ..." : ""}</div>
            <div className="flex flex-wrap mt-4">
              <button className="btn">
                <Link href={"reise-tage/bearbeiten/" + day.id}>Bearbeiten</Link>
              </button>
              {day.route.length === 0 ? (
                <button className="btn">
                  <Link href={"reise-tage/" + day.id + "/route-hinzufuegen"}>
                    Route hinzufügen
                  </Link>
                </button>
              ) : (
                ""
              )}

              <button
                onClick={() => {
                  setSelectedTravelDayId(day.id);
                  setShowAddToCollection(true);
                }}
                className="btn"
              >
                Zur Timeline hinzufügen
              </button>

              <button onClick={() => setShowDeleteModal(true)} className="btn">
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
            {timeLines.map((timeLine) => (
              <option key={timeLine.id} value={timeLine.id}>
                {timeLine.name}
              </option>
            ))}
          </select>
        </Modal>
      ) : (
        ""
      )}
      {/* {showDelete ? (
        <Modal setShowModal={setShowDeleteModal} title="Tag löschen">
          Wirklich löschen?
        </Modal>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default TravelDayList;
