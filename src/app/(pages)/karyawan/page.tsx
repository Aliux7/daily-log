"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getColumns, Karyawan } from "./columns";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { getAllStaffsByBusinessId, uploadImageToFirebase } from "./actions";
import Loading from "@/app/components/ui/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";
import PopUpKaryawan from "@/app/components/popup/karyawan/PopUpKaryawan";

const page = () => {
  const { userData, businessData, loading } = useAuth();
  const [showPopUp, setShowPopUp] = useState(false);
  const [data, setdata] = useState<any>([]);
  const [loadingAdd, setLoading] = useState(false);

  const fetchDataKaryawan = async () => {
    setLoading(true);
    if (businessData) {
      const result = await getAllStaffsByBusinessId(businessData?.id);
      if (result?.success) setdata(result.data);
    }
    setLoading(false);
  };

  // const tryUpload = async () => {
  //   console.log("TEST")
  //   if (businessData && userData) {
  //     const response = await fetch("/model.jpg");
  //     const fileBlob = await response.blob();

  //     const file = new File([fileBlob], "model.jpg", { type: fileBlob.type });
  //     const result = uploadImageToFirebase(
  //       businessData?.id,
  //       userData?.id,
  //       file
  //     );

  //     console.log(result);
  //   }
  // };

  useEffect(() => {
    fetchDataKaryawan();
    // tryUpload();
  }, [businessData]);

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">Karyawan</h1>
        <DataTable
          columns={getColumns(fetchDataKaryawan, businessData, setLoading)}
          data={data}
        />
        <div
          className="absolute bottom-5 right-5 bg-first-color hover:bg-first-color/80 rounded-full w-14 h-14 text-white flex justify-center items-center text-4xl cursor-pointer"
          onClick={() => setShowPopUp(true)}
        >
          <FaPlus className="w-5 h-5" />
        </div>
      </div>
      {showPopUp && (
        <PopUpKaryawan
          fetchDataKaryawan={fetchDataKaryawan}
          setShowPopUp={setShowPopUp}
          setLoading={setLoading}
          businessId={businessData?.id ? businessData.id : ""}
        />
      )}
      {loadingAdd && <Loading />}
      <Toaster />
    </div>
  );
};

export default page;
