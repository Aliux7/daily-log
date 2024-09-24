"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns, Karyawan } from "./columns";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

async function getData(): Promise<Karyawan[]> {
  return [];
}

const page = () => {
  const [data, setdata] = useState<any>([]);
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">Karyawan</h1>
        <DataTable columns={columns} data={data} />
        <div
          className="absolute bottom-5 right-5 bg-first-color hover:bg-first-color/80 rounded-full w-14 h-14 text-white flex justify-center items-center text-4xl cursor-pointer"
          onClick={() => setShowPopUp(true)}
        >
          <FaPlus className="w-5 h-5" />
        </div>
      </div>
      {showPopUp && (
        <div
          className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setShowPopUp(false)}
        >
          <div
            className="relative w-96 max-h-[85vh] h-fit bg-gray-100 rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-center gap-3 items-start mb-5 mt-1">
              <Label className="text-primary-text">Nama:</Label>
              <Input type="text" placeholder="Nama" maxLength={30} />
            </div>
            <div className="flex flex-col justify-center gap-3 items-start my-5">
              <Label className="text-primary-text">Cabang:</Label>
              <Input type="branch" placeholder="Cabang" maxLength={30} />
            </div>
            <div className="flex flex-col justify-center gap-3 items-start my-5">
              <Label className="text-primary-text">Gender:</Label>
              <RadioGroup
                defaultValue="comfortable"
                className="flex gap-5 mx-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Pria" id="r1" />
                  <Label htmlFor="r1">Pria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Wanita" id="r2" />
                  <Label htmlFor="r2">Wanita</Label>
                </div>
              </RadioGroup>
            </div>
            <button className="bg-first-color text-white w-full text-center rounded-xl py-2">
              Tambahkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
