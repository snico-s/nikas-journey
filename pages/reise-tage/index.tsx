import React from "react";
import { PrismaClient, TravelDay } from "@prisma/client";
import { GetServerSideProps } from "next";

type Props = { travelDays: TravelDay[] };

function index({ travelDays }: Props) {
  console.log(travelDays);
  return (
    <div>
      {travelDays.map((day) => (
        <ul key={day.id}>
          <li className="p-2">
            <div>ID: {day.id}</div>
            <div>Date: {new Date(day.date).toLocaleDateString()}</div>
            <div>Titel: {day.title}</div>
            <div>Text: {day.body}</div>
          </li>
        </ul>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();

  const data = await prisma.travelDay.findMany();
  console.log(data);
  console.log(typeof data);
  const travelDays = JSON.parse(JSON.stringify(data));
  console.log(typeof travelDays);

  // Pass data to the page via props
  return { props: { travelDays } };
};

export default index;
