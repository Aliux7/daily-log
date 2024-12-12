"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { useAuth } from "@/app/context/AuthContext";
import { getAllStaffsByBusinessId } from "../karyawan/actions";
import { getActiveAttendanceByBusinessId } from "./actions";
import { getColumns } from "./columns";
import Loading from "@/app/components/ui/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";
import { FaInfoCircle } from "react-icons/fa";

const page = () => {
  const { userData, businessData, loading } = useAuth();
  const [data, setdata] = useState<any>([]);
  const [loadingFetch, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const fetchDataAbsensi = async () => {
    if (businessData) {
      setLoading(true);
      const result = await getActiveAttendanceByBusinessId(businessData?.id);
      if (result?.success) setdata(result.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAbsensi();
  }, [businessData]);

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">Absensi</h1>
        <div
          className="absolute top-10 right-11 text-gray-400"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <FaInfoCircle />
        </div>
        {showInfo && (
          <div className="absolute top-1 right-16 bg-background-color shadow-xl text-xs px-2 py-1 rounded-md">
            <p className="text-xs text-gray-500">
              1. Maximal absen 2x setiap hari
            </p>
            <p className="text-xs text-gray-500">
              2. Absen ke 2 pada hari yang sama akan dianggap absen lembur
            </p>
            <p className="text-xs text-gray-500">
              3. Absen diatas 2x akan menimpa absen lembur
            </p>
          </div>
        )}
        <DataTable
          columns={getColumns(fetchDataAbsensi, setLoading)}
          data={data}
          businessId={businessData?.id}
          role={userData?.role}
        />
      </div>
      {loadingFetch && <Loading />}
    </div>
  );
};

export default page;
