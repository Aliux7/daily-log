"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getColumns, Karyawan } from "./columns";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { getAllAttendanceByDate } from "./actions";
import Loading from "@/app/components/ui/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";

const formatDateToString = (date: Date | undefined): string => {
  return date ? format(date, "yyyy-MM-dd") : "";
};

const page = () => {
  const { userData, businessData } = useAuth();
  const [data, setdata] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const fetchDataRekap = async () => {
    setLoading(true);
    if (businessData) {
      const result = await getAllAttendanceByDate(
        businessData?.id,
        formatDateToString(date)
      );
      if (result?.success) setdata(result.data);
      console.log(result?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataRekap();
  }, [businessData, date]);

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">
          Rekap Absensi
        </h1>
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
          businessId={businessData?.id}
          role={userData?.role}
        />
      </div>
      {loading && <Loading />}
      <Toaster />
    </div>
  );
};

export default page;
