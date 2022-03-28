import React from "react";
import { PrismaClient, TravelDay } from "@prisma/client";
import { GetServerSideProps } from "next";
import Link from "next/link";

type Props = { travelDays: TravelDay[] };

function index({ travelDays }: Props) {
  console.log(travelDays);
  return (
    <div className="container mx-auto px-4">
      <ul>
        {travelDays.map((day) => (
          <li key={day.id} className="p-2">
            <div>ID: {day.id}</div>
            <div>Date: {new Date(day.date).toLocaleDateString()}</div>
            <div>Titel: {day.title}</div>
            <div>Text: {day.body?.slice(0, 200) + " ..."}</div>
            <div className="flex flex-wrap space-x-2 mt-4">
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 dark:focus:ring-blue-200 dark:focus:text-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Link href={"reise-tage/bearbeiten/" + day.id}>Bearbeiten</Link>
              </span>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 dark:focus:ring-blue-200 dark:focus:text-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Löschen
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();

  const data = await prisma.travelDay.findMany();
  const travelDays = JSON.parse(JSON.stringify(data));

  return { props: { travelDays } };
};

export default index;
