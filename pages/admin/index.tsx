import Link from "next/link";

type Props = {};

function AdminPage({}: Props) {
  return (
    <div className="container mx-auto px-4 flex flex-col">
      <h1 className="text-3xl my-2">Admin</h1>
      <div>
        <button className="btn">
          <Link href="/admin/reise-tage">Zu den Reisetagen</Link>
        </button>
        <button className="btn">
          <Link href="/admin/ausgaben">Zu den Ausgaben</Link>
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
