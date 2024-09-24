import React from "react";
import { Absensi, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Absensi[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "aending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "pending",
      branch: "Surabaya",
    },
    {
      id: "728ed52f",
      name: "bending",
      branch: "Lorem ipsum dolor dolor dolort",
      ongoing: "05 Juli 2024 06.30 AM",
    },
    {
      id: "728ed52f",
      name: "Lorem ipsum dolor dolor dolort",
      branch: "Jakarta",
    },
    // ...
  ];
}

const page = async () => {
  const data = await getData();
  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">Absensi</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default page;
