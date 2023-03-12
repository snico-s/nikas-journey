import Link from "next/link";

type Props = {};

function AdminPage({}: Props) {
  return (
    <div className="container mx-auto px-4 flex flex-col">
      <h1 className="text-3xl my-2">Admin</h1>
      <div>
        <Link className="btn btn-primary mr-2" href="/admin/reise-tage">
          Zu den Reisetagen
        </Link>
        <Link className="btn btn-primary" href="/admin/ausgaben">
          Zu den Ausgaben
        </Link>
      </div>
    </div>
  );
}

export default AdminPage;
