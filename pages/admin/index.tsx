import Link from "next/link";

type Props = {};

function AdminPage({}: Props) {
  return (
    <div className="container mx-auto px-4 flex flex-col">
      <h1 className="text-3xl my-2">Admin</h1>
      <Link href="/admin/reise-tage">Zu den Reisetagen</Link>
      <Link href="/admin/ausgaben">Zu den Ausgaben</Link>
      <h2 className="text-2xl my-2">Zu den Routen</h2>
    </div>
  );
}

export default AdminPage;
