import { useEffect, useState } from "react";
import Head from "next/head";
import MapLibre from "../../components/MapLibre";
import Timeline from "../../components/timeline/Timeline";
import { GetServerSideProps } from "next";
import Route from "../../models/Route";
import dbConnect from "../../lib/dbConnect";

type Props = {
  routes: Array<routeData> | [];
};

function RoutePage({ routes }: Props) {
  const [selectedRoute, setSelectedRoute] = useState(-1);
  const [timeLineData, setTimeLineData] = useState([{}]);

  return (
    <div>
      <Head>
        <title>Route</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Content */}
      <div className="md:flex h-(screen-20)">
        <MapLibre />
        <div className="bg-white w-full h-80 overflow-y-auto md:h-full">
          <Timeline
            data={routes}
            selected={selectedRoute}
            onClick={setSelectedRoute}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  await dbConnect();
  const data: Array<routeData> = await Route.find({});
  console.log(typeof data);
  const routes = JSON.parse(JSON.stringify(data));
  console.log(typeof routes);

  // Pass data to the page via props
  return { props: { routes } };
};

export default RoutePage;
