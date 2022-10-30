import { Currency, Payment, TravelDay } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface PaymentWithTravelDay extends Payment {
  travelDay: TravelDay;
}

type Props = {};

const AddPayment = (props: Props) => {
  const router = useRouter();
  const [currencies, setCurrencies] = useState<Currency[] | null>(null);
  const [categories, setCategories] = useState<string[] | null>(null);

  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState<string>("EUR");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchCurrency = async () => {
      const response = await fetch("/api/currency");
      const json = await response.json();
      setCurrencies(json.data);
    };
    const fetchCategories = async () => {
      const response = await fetch("/api/payments/categories");
      const json = await response.json();
      setCategories(json.data);
    };

    fetchCurrency().catch(console.error);
    fetchCategories().catch(console.error);
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form = { amount, currency, category, description, date };

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error("Status" + res.status);
      }

      router.push("/admin/ausgaben");
    } catch (error) {}
  };

  const makeDateString = (date: Date) => {
    const jsDate = new Date(date);
    return jsDate.toLocaleDateString();
  };

  if (!currencies) return <div>loading</div>;

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 rounded-lg sm:shadow sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium" htmlFor="amount">
                Ausgabe
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step=".01"
                  name="amount"
                  value={amount ? amount : ""}
                  onChange={(e) => setAmount(+e.target.value)}
                />

                <select
                  name="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.isoCode} value={currency.isoCode}>
                      {currency.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="date">
                Tag
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="category">
                Kategorie
              </label>
              <input
                type="text"
                name="category"
                list="categories"
                autoComplete="off"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="categories">
                {categories?.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label
                className="block, text-sm font-medium"
                htmlFor="description"
              >
                Beschreibung
              </label>
              <textarea
                name="body"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <button type="submit" className="btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
