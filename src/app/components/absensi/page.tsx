"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { useAuth } from "@/app/context/AuthContext"; 
import { getActiveAttendanceByBusinessId } from "./actions";
import { getColumns } from "./columns";
import Loading from "@/app/components/ui/Loading/Loading"; 
import { FaInfoCircle } from "react-icons/fa";

const Absensi = () => {
  const { userData, businessData, loading } = useAuth();
  const [data, setdata] = useState<any>([]);
  const [loadingFetch, setLoading] = useState(false); 

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
    <div className="w-full h-full relative flex justify-center items-start m-0">
      <div className="w-full h-full flex flex-col bg-gray-100 overflow-y-auto gap-3 px-7"> 
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

export default Absensi;
