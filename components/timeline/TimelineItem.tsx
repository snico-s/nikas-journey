import moment from "moment";
import React, { useRef, Dispatch, SetStateAction, useState } from "react";
import { TravelDayWithRoute } from "../../@types/custom";

type Props = {
  travelDay: TravelDayWithRoute;
  startDate: Date | undefined;
  selected: boolean;
  hovered: boolean;
  last: boolean;
  first: boolean;
  onClick: Dispatch<SetStateAction<string | null>>;
  onHover: Dispatch<SetStateAction<string | null>>;
};

function TimelineItem({
  travelDay,
  startDate,
  selected,
  hovered,
  last,
  first,
  onClick,
  onHover,
}: Props) {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const myRef = useRef<HTMLLIElement>(null);
  // Destructure props
  // Destructure Item-Data
  const { id, date, title, body, route, distance } = travelDay;

  console.log(route);

  let day = moment(date).diff(moment(startDate), "days");
  if (day >= 0) day++;

  const jsDate = new Date(date);

  const dateString = `${jsDate?.getDate()}. ${new Intl.DateTimeFormat("de-DE", {
    month: "long",
  }).format(jsDate)} ${jsDate?.getFullYear()}`;

  return (
    <li
      className="relative mb-2 last:mb-0"
      onClick={() => {
        onClick((id + "") as string);
      }}
      onMouseOver={() => {
        onHover((id + "") as string);
      }}
      onMouseLeave={() => {
        console.log("leave");
        onHover(null);
      }}
      onTouchStart={() => {
        onHover((id + "") as string);
      }}
      ref={myRef}
      id={"" + id}
    >
      {/* Line */}
      <div
        className={`absolute w-0.5 lg:block 
        ${first ? "h-(timeline-first)" : "mt-3"}
        ${!first && !last ? "h-(timeline)" : ""}
        ${last ? "h-(timeline-end)" : ""} 
        ${selected ? "bg-green-600 z-20" : "bg-gray-500 z-10"}`}
      ></div>

      {/* Point */}

      <div
        className={`mt-3 z-20 absolute w-3.5 h-3.5 bg-gray-100 rounded-full -left-1.5 border  
        ${selected ? "bg-green-600" : ""} ${hovered ? "bg-green-400" : ""}`}
      ></div>

      {/* Content-Container */}
      <div
        className={`ml-4 rounded-md p-2 
        ${selected ? "bg-gray-100" : ""} 
        ${hovered ? "bg-gray-200" : ""}
        `}
      >
        {/* Header */}
        <div className="relative mb-1 leading-none font-normal text-base text-gray-400">
          <span className="font-bold">Tag {day}</span>
          <time className="text-sm"> - {dateString}</time>
          <span className="absolute text-sm right-2">{distance} km</span>
        </div>

        {/* Title */}
        <h3 className="pl-2 text-lg font-semibold text-gray-900">{title}</h3>

        {/* Content */}
        {body && body?.length > 0 ? (
          <p className="mb-4 pl-2 text-base font-normal text-gray-500">
            {isReadMore && body?.length > 250
              ? body.slice(0, 250) + " ..."
              : body}

            {body?.length > 250 ? (
              <div className="mt-4">
                <button onClick={toggleReadMore} className="btn">
                  {isReadMore ? "Weiter lesen" : "Weniger"}
                  {isReadMore ? (
                    <svg
                      className="w-3 h-3 ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    ""
                  )}
                </button>
              </div>
            ) : (
              ""
            )}
          </p>
        ) : (
          ""
        )}
      </div>
    </li>
  );
}

export default TimelineItem;
