import { useState } from "react";
import Head from "next/head";
import MapLibre from "../../components/MapLibre";
import Timeline from "../../components/timeline/Timeline";
import { GetServerSideProps } from "next";
import { PrismaClient, Route, TravelDay } from "@prisma/client";

interface TravelDayWithRoute extends TravelDay {
  route: Route[];
}

type Props = {
  travelDays: TravelDayWithRoute[];
};

function RoutePage({ travelDays }: Props) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [timeLineData, setTimeLineData] = useState([{}]);

  console.log(travelDays);

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
          route={travelDays}
          onClick={setSelectedRoute}
          selected={selectedRoute}
        />
        <div className="bg-white w-full h-80 overflow-y-auto md:h-full">
          <Timeline
            data={travelDays}
            selected={selectedRoute}
            onClick={setSelectedRoute}
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
      routeColleaction: {
        include: {
          collectiondays: {
            include: {
              travelDays: {
                include: {
                  payments: true,
                  route: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const travelDays = data?.routeColleaction.collectiondays.map(
    (travelDay) => travelDay.travelDays
  );

  const travelDaysParsed = JSON.parse(JSON.stringify(travelDays));
  console.log("hier");
  console.log(travelDays);

  // Pass data to the page via props
  return { props: { travelDays: travelDaysParsed } };
};

export default RoutePage;
