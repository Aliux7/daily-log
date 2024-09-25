"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import Greeting from "../../components/ui/Greeting";
import Clock from "../../components/ui/Clock/Clock";
import { FaUser } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/ui/Loading/Loading";

const page = () => {
  const { userData, businessData, loading } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const markedDates = [
    new Date("2024-09-01"),
    new Date("2024-09-02"),
    new Date("2024-09-03"),
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100  rounded-3xl px-10 p-5 overflow-y-auto">
        <nav className="w-full h-auto ">
          <Greeting />
          <h1 className="text-3xl font-urbanist font-semibold">
            Halo, {userData?.role} {businessData?.name}
            <span className="text-sm text-gray-500 font-urbanist ml-2">
              ({userData?.email})
            </span>
          </h1>
        </nav>
        <div className="w-full h-full flex items-start justify-between py-3 font-sans pt-8 gap-7">
          <div className="bg-background-color rounded-xl w-full max-w-96 h-[34rem] flex flex-col justify-center items-center shadow-xl gap-2">
            <div>
              <Clock />
            </div>
            <button className="bg-first-color hover:bg-first-color/90 hover:scale-[1.01] transition-all duration-300 ease-in-out text-gray-50 px-14 py-3 rounded-md">
              Absensi
            </button>
            <del className="text-first-color/50 my-1 italic">
              Bypass Absensi
            </del>
          </div>

          <div className="w-px h-[34rem] bg-gray-300"></div>

          <div className="rounded-xl flex-grow h-[34rem] flex flex-col justify-center items-center gap-10">
            <div className="w-full h-[22rem] flex gap-7">
              <div className="relative h-full w-full  flex flex-col bg-background-color shadow-xl rounded-xl p-6">
                <div className="text-center font-urbanist font-medium text-gray-500 text-xl border-b border-b-gray-200 pb-4 italic">
                  Catatan
                </div>
                <div className="w-full h-full overflow-y-scroll">
                  <div className="w-full h-auto border-b flex flex-col px-3 py-2">
                    <div className="flex justify-between items-center w-full">
                      <h1 className="text-lg font-bold">Jadwal Picket Hari</h1>
                      <span className="text-sm italic text-gray-500">
                        20 Sept 2024
                      </span>
                    </div>
                    <div className="w-full h-auto text-wrap mt-1">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </div>
                  </div>
                  <div className="w-full h-auto border-b flex flex-col px-3 py-2">
                    <div className="flex justify-between items-center w-full">
                      <h1 className="text-lg font-bold">Jadwal Picket Hari</h1>
                      <span className="text-sm italic text-gray-500">
                        20 Sept 2024
                      </span>
                    </div>
                    <div className="w-full h-auto text-wrap mt-1">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </div>
                  </div>
                  <div className="w-full h-auto border-b flex flex-col px-3 py-2">
                    <div className="flex justify-between items-center w-full">
                      <h1 className="text-lg font-bold">Jadwal Picket Hari</h1>
                      <span className="text-sm italic text-gray-500">
                        20 Sept 2024
                      </span>
                    </div>
                    <div className="w-full h-auto text-wrap mt-1">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Sed doloribus, deleniti a nihil, laboriosam modi saepe
                      numquam quos iure ea necessitatibus? Similique suscipit
                      quibusdam aspernatur consequuntur, distinctio quis fugiat
                      eligendi!
                    </div>
                  </div>
                  <div className="w-full h-auto border-b flex flex-col px-3 py-2">
                    <div className="flex justify-between items-center w-full">
                      <h1 className="text-lg font-bold">Jadwal Picket Hari</h1>
                      <span className="text-sm italic text-gray-500">
                        20 Sept 2024
                      </span>
                    </div>
                    <div className="w-full h-auto text-wrap mt-1">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </div>
                  </div>
                  <div className="w-full h-auto border-b flex flex-col px-3 py-2">
                    <div className="flex justify-between items-center w-full">
                      <h1 className="text-lg font-bold">Jadwal Picket Hari</h1>
                      <span className="text-sm italic text-gray-500">
                        20 Sept 2024
                      </span>
                    </div>
                    <div className="w-full h-auto text-wrap mt-1">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-background-color w-80 rounded-xl h-auto flex justify-center items-center shadow-xl">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  markedDates={markedDates}
                  className="rounded-md"
                />
              </div>
            </div>
            <div className="w-full h-full flex gap-5">
              <div className="relative bg-background-color shadow-xl w-1/3 rounded-xl p-5 flex flex-col justify-between">
                <h1 className="text-gray-500 text-lg italic">Total Staff</h1>
                <h1 className="text-first-color text-6xl font-semibold w-full text-end">
                  27
                </h1>
                <div className="absolute bottom-7 left-5">
                  <FaUser color="#d1d5db" className="w-11 h-11" />
                </div>
              </div>
              <div className="relative bg-background-color shadow-xl w-2/3 rounded-xl p-5 flex flex-col justify-between">
                <h1 className="text-gray-500 text-sm text-end">Log Terbaru</h1>
                <div className="w-full h-20 overflow-y-auto">
                  <div className="w-full flex justify-between items-center border-b-1 text-gray-700">
                    <div>John Doe Check In</div>
                    <div className="text-gray-500 text-sm italic">
                      20 Sept 2024 13:00:00
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center border-b-1 text-gray-700">
                    <div>Staff Baru Joni Masuk</div>
                    <div className="text-gray-500 text-sm italic">
                      20 Sept 2024 10:00:00
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center border-b-1 text-gray-700">
                    <div>John Doe Check In</div>
                    <div className="text-gray-500 text-sm italic">
                      20 Sept 2024 09:30:00
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center border-b-1 text-gray-700">
                    <div>John Doe Check In</div>
                    <div className="text-gray-500 text-sm italic">
                      20 Sept 2024 09:00:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
