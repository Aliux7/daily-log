"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getColumns, Karyawan } from "./columns";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/ui/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import {
  getAllStaffsByBusinessId,
  getMonthlyAttendanceByStaff,
} from "./actions";
import { firestore } from "@/lib/firebase/firebaseConfig";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

const page = () => {
  const { userData, businessData } = useAuth();
  const [data, setdata] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  const [hourlyPaid, setHourlyPaid] = useState(0);
  const [listStaff, setListStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [payslip, setPayslip] = useState<number>(0);

  const formatToIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const convertFirestoreTimestampToDate = (timestamp: Timestamp) => {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    return new Date(milliseconds);
  };

  const calculateWorkingHours = (attendanceRecord: any) => {
    const clockInTime = convertFirestoreTimestampToDate(
      attendanceRecord.clockIn
    );
    const clockOutTime = convertFirestoreTimestampToDate(
      attendanceRecord.clockOut
    );
    const timeDifference = clockOutTime.getTime() - clockInTime.getTime();
    return timeDifference / (1000 * 60 * 60); // Convert to hours
  };

  const calculateOvertimeHours = (attendanceRecord: any) => {
    const overtimeClockInTime = convertFirestoreTimestampToDate(
      attendanceRecord.overtimeClockIn
    );
    const overtimeClockOutTime = convertFirestoreTimestampToDate(
      attendanceRecord.overtimeClockOut
    );
    const overtimeDifference =
      overtimeClockOutTime.getTime() - overtimeClockInTime.getTime();
    return overtimeDifference / (1000 * 60 * 60); // Convert to hours
  };

  const fetchDataRekap = async () => {
    if (businessData && userData) {
      const result = await getMonthlyAttendanceByStaff(
        businessData?.id,
        selectedStaff,
        date
      );
      if (result?.success) {
        const { start, end, dataAttendance, hourlyPaid } = result;

        const startDate = new Date(start);
        const endDate = new Date(end);
        const allDates = [];

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          allDates.push(new Date(d).toISOString().split("T")[0]);
        }

        let totalPayslip = 0;

        const tempData = allDates.map((date) => {
          const attendanceRecord = dataAttendance.find(
            (record: { date: string }) => record.date == date
          );

          let subtotal = 0;

          if (attendanceRecord?.clockIn && attendanceRecord?.clockOut) {
            const workingHours = calculateWorkingHours(attendanceRecord);
            subtotal = workingHours * hourlyPaid;
          }

          if (
            attendanceRecord?.overtimeClockIn &&
            attendanceRecord?.overtimeClockOut
          ) {
            const overtimeHours = calculateOvertimeHours(attendanceRecord);
            subtotal += overtimeHours * hourlyPaid;
          }

          totalPayslip += subtotal;

          console.log(totalPayslip);
          console.log(subtotal);

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
            subtotalAmount: subtotal,
          };
        });

        setPayslip(totalPayslip);
        setHourlyPaid(hourlyPaid);
        setdata(tempData);
      }
      console.log(result);
    }
  };

  const fetchListStaff = async () => {
    setLoading(true);
    if (businessData && userData) {
      const result = await getAllStaffsByBusinessId(businessData?.id);
      if (result?.success) {
        const { data } = result;
        setListStaff(data);
      }
      fetchDataRekap();
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    const businessDocRef = doc(firestore, `businesses/${businessData?.id}`);

    try {
      await updateDoc(businessDocRef, {
        hourlyPaid: hourlyPaid,
      });
      fetchDataRekap();
    } catch (error) {
      console.error("Error updating hourlyPaid: ", error);
    }
  };

  useEffect(() => {
    fetchListStaff();
  }, [businessData, date, selectedStaff]);

  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-full flex flex-col bg-gray-100 rounded-3xl px-10 p-5 overflow-y-auto gap-3">
        <h1 className="text-3xl font-urbanist font-semibold mb-2">Slip Gaji</h1>
        <DataTable
          date={date}
          setDate={setDate}
          hourlyPaid={hourlyPaid}
          setHourlyPaid={setHourlyPaid}
          handleUpdateHourlyPaid={handleUpdate}
          listStaff={listStaff}
          setSelectedStaff={setSelectedStaff}
          columns={getColumns(hourlyPaid)}
          data={data}
        />
        <div className="flex justify-end items-center pr-5">
          <h1 className="text-xl font-semibold">
            Total:{" "}
            <span className="text-first-color">{formatToIDR(payslip)}</span>
          </h1>
        </div>
      </div>
      {loading && <Loading />}
      <Toaster />
    </div>
  );
};

export default page;
