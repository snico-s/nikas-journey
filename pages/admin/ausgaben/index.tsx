import { Payment, TravelDay } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface PaymentWithTravelDay extends Payment {
  travelDay: TravelDay;
}

type Props = {};

const index = (props: Props) => {
  const [payments, setPayments] = useState<PaymentWithTravelDay[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/payments");
      const json = await response.json();
      console.log(json.data);
      console.log(typeof json.data);
      setPayments(json.data);
    };

    fetchData().catch(console.error);
  }, []);

  const makeDateString = (date: Date) => {
    const jsDate = new Date(date);
    return jsDate.toLocaleDateString();
  };

  if (!payments) return "loading";

  return (
    <div>
      <Link href="/admin/ausgaben/erstellen">Ausgabe hinzufügen</Link>
      <ul>
        {payments.map((payment, index) => (
          <li key={index} className="ml-2 mb-2">
            {makeDateString(payment.travelDay.date)}
            <ul>
              <li className="ml-2">
                {payment.amount} {payment.currencyId}
              </li>
              <li className="ml-2">{payment?.category}</li>
              <li className="ml-2">{payment?.description}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default index;
