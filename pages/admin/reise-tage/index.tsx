import React from "react";
import Link from "next/link";
import TravelDayList from "../../../components/TravelDayList/TravelDayList";
import { GetServerSideProps } from "next";
import { TimeLine, TimeLineHasTravelDays, TravelDay } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../lib/prisma";

type Props = {
  userTravelDays: (TravelDay & {
    timeLineTravelDays: (TimeLineHasTravelDays & {
      timeLine: TimeLine;
    })[];
  })[];
  userTimelines: TimeLine[];
};

function TravelDaysPage({ userTimelines, userTravelDays }: Props) {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl my-2">Deine Reisetage</h2>
      <button className="btn btn-primary btn-sm btn-outline">
        <Link href="/admin/reise-tage/erstellen">Reise-Tag erstellen</Link>
      </button>
      <div className="m-2">
        <TravelDayList travelDays={userTravelDays} timelines={userTimelines} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const userId = session?.user.id;
  console.log(session);

  const timeline = await prisma.timeLine.findMany({
    where: {
      userId: Number(userId),
    },
  });

  const travelDays = await prisma.travelDay.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      timeLineTravelDays: {
        include: {
          timeLine: true,
        },
      },
    },
  });

  const parsedTimeline = JSON.parse(JSON.stringify(timeline));
  const parsedTravelDays = JSON.parse(JSON.stringify(travelDays));

  return {
    props: {
      userTravelDays: parsedTravelDays,
      userTimelines: parsedTimeline,
    },
  };
};

export default TravelDaysPage;
