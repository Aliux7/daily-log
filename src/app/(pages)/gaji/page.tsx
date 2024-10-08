"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getColumns, Karyawan } from "./columns";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/ui/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { getMonthlyAttendanceByStaff } from "./actions";

const page = () => {
  const { userData, businessData } = useAuth();
  const [data, setdata] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  const fetchDataRekap = async () => {
    setLoading(true);
    if (businessData && userData) {
      const result = await getMonthlyAttendanceByStaff(
        businessData?.id,
        "xqQB904No8mSt9CeMIUw",
        date
      );
      if (result?.success) {
        const { start, end, dataAttendance } = result;

        const startDate = new Date(start);
        const endDate = new Date(end);
        const allDates = [];

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          allDates.push(new Date(d).toISOString().split("T")[0]);
        }

        const tempData = allDates.map((date) => {
          const attendanceRecord = dataAttendance.find(
            (record: { date: string }) => record.date == date
          );

          return {
            date,
            clockIn: attendanceRecord ? attendanceRecord.clockIn : null,
            clockOut: attendanceRecord ? attendanceRecord.clockOut : null,
            overtimeClockIn: attendanceRecord
              ? attendanceRecord.overtimeClockIn
              : null,
            overtimeClockOut: attendanceRecord
              ? attendanceRecord.overtimeClockOut
              : null,
          };
        });

        console.log(tempData);
        setdata(tempData);
      }
      console.log(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataRekap();
  }, [businessData, date]);

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">Slip Gaji</h1>
        <DataTable
          date={date}
          setDate={setDate}
          columns={getColumns(
            date,
            fetchDataRekap,
            businessData,
            userData,
            setLoading
          )}
          data={data}
        />
      </div>
      {loading && <Loading />}
      <Toaster />
    </div>
  );
};

export default page;
