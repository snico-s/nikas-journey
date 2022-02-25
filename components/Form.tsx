import React, { ChangeEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";

type routeData = {
  day: string;
  title: string;
  body: string;
};

type Props = {
  routeData: routeData;
  newData: boolean;
};

const Form = (props: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<routeData>({
    day: props.routeData.day,
    title: props.routeData.title,
    body: props.routeData.body,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async () => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status: " + res.status);
      }

      const { data } = await res.json();

      mutate(`/api/pets/${id}`, data, false); // Update the local data without a revalidation
      router.push("/");
    } catch (error) {
      setMessage("Failed to update");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async () => {
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status" + res.status);
      }

      router.push("/");
    } catch (error) {
      setMessage("Failed to add");
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    console.log(target.name);

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.value;

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      props.newData ? postData() : putData();
    } else {
      setErrors({ errs });
    }
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err: any = {};
    if (!form.day) err.day = "Day is required";
    if (!form.title) err.title = "Title is required";
    if (!form.body) err.body = "Body is required";
    return err;
  };

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6  border rounded-lg shadow sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium" htmlFor="day">
                Tag
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  maxLength={20}
                  name="day"
                  value={form.day}
                  onChange={handleChangeInput}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="title">
                Titel
              </label>
              <input
                type="text"
                maxLength={20}
                name="title"
                value={form.title}
                onChange={handleChangeInput}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="body">
                Text
              </label>
              <textarea
                maxLength={200}
                name="body"
                value={form.body}
                onChange={handleChangeTextArea}
                required
              />
            </div>

            <button type="submit" className="btn">
              Submit
            </button>
          </form>
          <p>{message}</p>
          <div>
            {Object.keys(errors).map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
