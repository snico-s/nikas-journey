import React from "react";
import Link from "next/link";
import TravelDayList from "../../../components/TravelDayList/TravelDayList";

function TravelDaysPage() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl my-2">Deine Reisetage</h2>
      <button className="btn">
        <Link href="/admin/reise-tage/erstellen">Reise-Tag erstellen</Link>
      </button>
      <div className="m-2">
        <TravelDayList />
      </div>
    </div>
  );
}

export default TravelDaysPage;
