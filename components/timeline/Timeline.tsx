import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { TravelDayWithRoute } from "../../@types/custom";
import TimelineItem from "./TimelineItem";

type Props = {
  travelDays: TravelDayWithRoute[];
  startDate: Date | undefined;
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
  const itemEls = useRef({});
  const length = travelDays.length;

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
    <ol className="relativ p-2 bg-white">
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
  );
}

export default Timeline;
