import React, { useState } from "react";

type Props = {};

const SignUp = (props: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(form);

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status: " + res.status);
      }

      const { data } = await res.json();

      // router.push("/");
    } catch (error) {
      // setMessage("Failed to update");
      console.log("Mist!");
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium" htmlFor="email">
          E-Mail
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChangeInput}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="name">
          Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChangeInput}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="date">
          Passwort
        </label>
        <div className="mt-1">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChangeInput}
            required
          />
        </div>

        <button type="submit" className="btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default SignUp;
