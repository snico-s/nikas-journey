import { useState } from "react";
import Head from "next/head";
import MapLibre from "../components/MapLibre";
import Timeline from "../components/timeline/Timeline";
import { GetServerSideProps } from "next";
import { PrismaClient, TravelDay } from "@prisma/client";

type Props = {
  travelDays: TravelDay[];
  startDate: Date | undefined;
};

function RoutePage({ travelDays, startDate }: Props) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [hoveredRoute, setHoverRoute] = useState<string | null>(null);

  return (
    <div>
      <Head>
        <title>Route</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Content */}
      <div className="md:flex h-(screen-20)">
        <MapLibre
          onClick={setSelectedRoute}
          selected={selectedRoute}
          hovered={hoveredRoute}
          onHover={setHoverRoute}
          userId={1}
          timeLineName={"main"}
        />

        <div className="bg-white w-full h-80 overflow-y-auto md:h-full">
          <Timeline
            travelDays={travelDays}
            startDate={startDate}
            selected={selectedRoute}
            hovered={hoveredRoute}
            onClick={setSelectedRoute}
            onHover={setHoverRoute}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();

  const data = await prisma.timeLine.findUnique({
    where: {
      userId_name: {
        userId: 1,
        name: "main",
      },
    },
    include: {
      timeLineHasTravelDays: {
        include: {
          travelDays: true,
        },
      },
    },
  });

  const travelDays = data?.timeLineHasTravelDays.map(
    (travelDay) => travelDay.travelDays
  );

  const sortedTravelDay = travelDays?.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const startDate = data?.startDate.toDateString();

  const travelDaysParsed = JSON.parse(JSON.stringify(sortedTravelDay));
  // Pass data to the page via props
  return { props: { travelDays: travelDaysParsed, startDate } };
};

export default RoutePage;
