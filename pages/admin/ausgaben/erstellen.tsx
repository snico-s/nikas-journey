import { Payment, TravelDay } from "@prisma/client";
import React from "react";
import AddPayment from "../../../components/Forms/AddPayment";

interface PaymentWithTravelDay extends Payment {
  travelDay: TravelDay;
}

type Props = {};

const ErstellenPage = (props: Props) => {
  return (
    <div>
      <AddPayment />
    </div>
  );
};

export default ErstellenPage;
