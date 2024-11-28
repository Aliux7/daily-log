"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IoIosClose } from "react-icons/io";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const page = () => {
  const [date, setDate] = React.useState<Date>();
  const [showPopUp, setShowPopUp] = useState(false);
  const catatans = [
    {
      judul: "Jangan Lupa Picket Malem",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
    {
      judul: "Jangan Lupa Picket Malem",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
    {
      judul: "Jangan Lupa Picket Malem",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
    {
      judul: "Jangan Lupa Picket Malem",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
    {
      judul: "Jangan Lupa Picket Malem",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
    {
      judul: "Jangan Lupa Picket Mal",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
    {
      judul: "Jangan Lupa Pickett Malem",
      catatan:
        "Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is Lore",
      tanggal: "20 Sept 2024",
    },
  ];

  const color = [
    "bg-green-200",
    "bg-yellow-200",
    "bg-blue-200",
    "bg-red-200",
    "bg-purple-200",
    "bg-orange-200",
  ];

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2 px-5">Catatan</h1>

        <div className="w-full h-fit grid grid-cols-4 gap-7 overflow-y-auto pb-10 px-5">
          {catatans?.map((catatan, index) => (
            <div
              className={`${
                color[index % 6]
              } w-auto rounded-xl shadow-xl p-5 h-fit relative`}
            >
              <div className="absolute top-3 right-3 text-gray-500">
                <IoIosClose
                  className="w-9 h-9 text-gray-700 hover:text-primary-text hover:bg-black/10 p-0.5 rounded-full cursor-pointer"
                  fill="currentColor"
                />
              </div>
              <h1 className="text-2xl font-urbanist font-semibold text-primary-text pr-5">
                {catatan.judul}
              </h1>
              <h3>{catatan.catatan}</h3>
              <h3 className="text-gray-700 text-sm text-end mt-2">
                {catatan.tanggal}
              </h3>
            </div>
          ))}
        </div>
        <div
          className="absolute bottom-5 right-5 bg-first-color/80 hover:bg-first-color rounded-full w-14 h-14 text-white flex justify-center items-center text-4xl cursor-pointer"
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
              <Label className="text-primary-text">Judul:</Label>
              <Input type="text" placeholder="Judul" maxLength={30} />
            </div>
            <div className="flex flex-col justify-center gap-3 items-start mb-5 mt-1">
              <Label className="text-primary-text">Tanggal:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col justify-center gap-3 items-start my-5">
              <Label className="text-primary-text">Catatan:</Label>
              <Textarea placeholder="Catatan . . ." />
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
