import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import TimelineItem from "./TimelineItem";

type Props = {
  data: Array<routeData> | [];
  onClick: Dispatch<SetStateAction<string | null>>;
  selected: string | null;
};

function Timeline({ data, onClick, selected }: Props) {
  const itemEls = useRef({});

  const length = data.length;

  useEffect(() => {
    console.log(data);
    if (!selected) return;
    const el = document.getElementById("" + selected);
    console.log(el);
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selected]);

  return (
    <ol className="relativ p-2 bg-white dark:bg-black">
      {data.map((item, index) => (
        <TimelineItem
          key={item.id}
          data={item}
          selected={selected === item.route?.id}
          onClick={onClick}
          last={index + 1 === length}
          first={index === 0}
          // ref={(element) => (itemEls.current[index] = element)}
        />
      ))}
    </ol>
  );
}

export default Timeline;
