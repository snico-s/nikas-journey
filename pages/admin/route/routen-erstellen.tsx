import Link from "next/link";
import AddRoutes from "../../../components/Forms/AddRoutes";

type Props = {};

function CreateRoutePage({}: Props) {
  return (
    <div className="container mx-auto px-4 flex flex-col">
      <h1 className="text-3xl my-2">Routen hochladen</h1>
      <AddRoutes />
    </div>
  );
}

export default CreateRoutePage;
