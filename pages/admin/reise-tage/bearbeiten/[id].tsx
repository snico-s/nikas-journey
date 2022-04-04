import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import EditTravelDay from "../../../../components/Forms/EditTravelDay";

type Props = {};

function EditTravelDayPage({}: Props) {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <div>Nichts gefunden</div>;

  return (
    <div className="container m-auto">
      <Head>
        <title>Route erstellen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EditTravelDay id={+id} />
    </div>
  );
}

export default EditTravelDayPage;
