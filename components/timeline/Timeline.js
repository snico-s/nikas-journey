import React, { useEffect, useRef } from "react";
import TimelineItem from "./TimelineItem";

function Timeline(props) {
  const itemEls = useRef({});

  const { data, onClick, selected } = props;
  const length = props.data.length;

  useEffect(() => {
    console.log(data);
    if (selected === -1) return;
    const el = document.getElementById(selected);
    console.log(el);
    el.scrollIntoView({
      behavior: "smooth",
    });
  }, [selected]);

  return (
    <ol className="relativ p-2 bg-white dark:bg-black">
      {data.map((item, index) => (
        <TimelineItem
          key={item._id}
          data={item}
          selected={selected === item._id}
          onClick={onClick}
          last={index + 1 === length}
          first={index === 0}
          ref={(element) => (itemEls.current[index] = element)}
        />
      ))}
    </ol>
  );
}

export default Timeline;
