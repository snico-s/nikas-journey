import React, { useState } from "react";
import { PrismaClient, RouteColleaction } from "@prisma/client";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { TravelDayWithRoute } from "../../@types/custom";
import Modal from "../../components/ui/Modal";
import TravelDayList from "../../components/TravelDayList/TravelDayList";

type Props = {
  travelDays: TravelDayWithRoute[];
  travelDaysNotInMain: TravelDayWithRoute[];
  routeColleactions: RouteColleaction[];
};

function index({ travelDays, travelDaysNotInMain, routeColleactions }: Props) {
  console.log(travelDays);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl my-2">Liste in Main-Timeline</h1>
      <TravelDayList
        travelDays={travelDays}
        routeColleactions={routeColleactions}
      />
      <h1 className="text-3xl my-2">Liste nicht Main-Timeline enthalten</h1>
      <TravelDayList
        travelDays={travelDaysNotInMain}
        routeColleactions={routeColleactions}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();

  const travelDaysData = await prisma.travelDay.findMany({
    include: { route: true },
  });

  const routeColleactionsData = await prisma.routeColleaction.findMany();

  const isInMainCollection = await prisma.collectionDays.findMany({
    where: {
      routeCollectionId: 1, // main
    },
    include: {
      travelDays: {
        include: {
          route: true,
        },
      },
    },
  });

  const travelDaysInCollection = isInMainCollection.map(
    (collection) => collection.travelDays
  );

  let difference = travelDaysData.filter((day) => {
    const { id } = day;
    let isIn = false;
    travelDaysInCollection.forEach((element) => {
      if (element.id === id) isIn = true;
    });
    return !isIn;
  });

  const routeColleactions = JSON.parse(JSON.stringify(routeColleactionsData));
  const travelDays = JSON.parse(JSON.stringify(travelDaysInCollection));
  const travelDaysNotInMain = JSON.parse(JSON.stringify(difference));

  return { props: { travelDays, travelDaysNotInMain, routeColleactions } };
};

export default index;
