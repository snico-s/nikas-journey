import { TravelDay } from "@prisma/client";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

import TimelineItem from "./TimelineItem";

type Props = {
  travelDays: TravelDay[];
  startDate: Date;
  onClick: Dispatch<SetStateAction<string | null>>;
  onHover: Dispatch<SetStateAction<string | null>>;
  selected: string | null;
  hovered: string | null;
};

function Timeline({
  travelDays,
  startDate,
  onClick,
  onHover,
  selected,
  hovered,
}: Props) {
  const length = travelDays.length;
  let totalDistance = 0.0;
  travelDays.forEach((travelDay) => {
    if (!travelDay.distance) return;
    totalDistance += +travelDay.distance;
  });
  console.log(totalDistance);

  useEffect(() => {
    if (!selected) return;
    const el = document.getElementById("" + selected);

    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selected]);

  return (
    <div className="relativ p-2 bg-white">
      Gesamtkilometer: {totalDistance.toFixed(2)}
      <ol>
        {travelDays.map((travelDay, index) => (
          <TimelineItem
            key={travelDay.id}
            travelDay={travelDay}
            startDate={startDate}
            selected={selected == "" + travelDay.id}
            hovered={hovered == "" + travelDay.id}
            onClick={onClick}
            onHover={onHover}
            last={index + 1 === length}
            first={index === 0}
            // ref={(element) => (itemEls.current[index] = element)}
          />
        ))}
      </ol>
    </div>
  );
}

export default Timeline;
