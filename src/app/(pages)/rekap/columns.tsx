"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import PopUpKaryawan from "@/app/components/popup/karyawan/PopUpKaryawan";
import ConfirmationKaryawan from "@/app/components/popup/karyawan/ConfirmationKaryawan";
import ShiftKaryawan from "@/app/components/popup/karyawan/ShiftKaryawan";
import { format } from "date-fns";
import PopUpRekap from "@/app/components/popup/rekap/PopUpRekap";

export type Karyawan = {
  id: string;
  name: string;
  branch: string;
  gender: string;
  profileUrl: string;
  role: string;
};

export const getColumns = (
  selectedDate: Date | undefined,
  fetchDataRekap: () => void,
  businessData: any,
  userData: any,
  setLoading: (value: boolean) => void
) => {
  return [
    {
      accessorKey: "name",
      header: ({ column }: any) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "branch",
      header: "Cabang",
    },
    {
      accessorKey: "clockIn",
      header: () => {
        return <h1 className="text-center">Jam Masuk</h1>;
      },
      cell: ({ row }: any) => {
        const [showPopUp, setShowPopUp] = useState(false);
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.attendance?.clockIn) {
          const { seconds } = karyawan.attendance.clockIn;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        console.log(karyawan);

        return (
          <div>
            <h1
              className={`text-center ${
                userData.role == "Owner"
                  ? "border rounded-md cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                userData.role == "Owner" ? setShowPopUp(true) : null;
              }}
            >
              {!karyawan?.attendance?.clockIn ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
            {showPopUp && (
              <PopUpRekap
                selectedDate={selectedDate}
                setShowPopUp={setShowPopUp}
                setLoading={setLoading}
                selectedStaffId={karyawan.id}
                selectedStaffName={karyawan.name}
                selectedStaffBranch={karyawan.branch}
                businessId={businessData.id}
                fetchDataRekap={fetchDataRekap}
                selectedValue={date}
                selectedLabel="clockIn"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "clockOut",
      header: () => {
        return <h1 className="text-center">Jam Keluar</h1>;
      },
      cell: ({ row }: any) => {
        const [showPopUp, setShowPopUp] = useState(false);
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.attendance?.clockOut) {
          const { seconds } = karyawan.attendance.clockOut;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1
              className={`text-center ${
                userData.role == "Owner"
                  ? "border rounded-md cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                userData.role == "Owner" ? setShowPopUp(true) : null;
              }}
            >
              {!karyawan?.attendance?.clockOut ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
            {showPopUp && (
              <PopUpRekap
                selectedDate={selectedDate}
                setShowPopUp={setShowPopUp}
                setLoading={setLoading}
                selectedStaffId={karyawan.id}
                selectedStaffName={karyawan.name}
                selectedStaffBranch={karyawan.branch}
                businessId={businessData.id}
                fetchDataRekap={fetchDataRekap}
                selectedValue={date}
                selectedLabel="clockOut"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "overtimeClockIn",
      header: () => {
        return <h1 className="text-center">Masuk Lembur</h1>;
      },

      cell: ({ row }: any) => {
        const [showPopUp, setShowPopUp] = useState(false);
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.attendance?.overtimeClockIn) {
          const { seconds } = karyawan.attendance.overtimeClockIn;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1
              className={`text-center ${
                userData.role == "Owner"
                  ? "border rounded-md cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                userData.role == "Owner" ? setShowPopUp(true) : null;
              }}
            >
              {!karyawan?.attendance?.overtimeClockIn ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
            {showPopUp && (
              <PopUpRekap
                selectedDate={selectedDate}
                setShowPopUp={setShowPopUp}
                setLoading={setLoading}
                selectedStaffId={karyawan.id}
                selectedStaffName={karyawan.name}
                selectedStaffBranch={karyawan.branch}
                businessId={businessData.id}
                fetchDataRekap={fetchDataRekap}
                selectedValue={date}
                selectedLabel="overtimeClockIn"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "overtimeClockOut",
      header: () => {
        return <h1 className="text-center">Keluar Lembur</h1>;
      },
      cell: ({ row }: any) => {
        const [showPopUp, setShowPopUp] = useState(false);
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.attendance?.overtimeClockOut) {
          const { seconds } = karyawan.attendance.overtimeClockOut;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1
              className={`text-center ${
                userData.role == "Owner"
                  ? "border rounded-md cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                userData.role == "Owner" ? setShowPopUp(true) : null;
              }}
            >
              {!karyawan?.attendance?.overtimeClockOut ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
            {showPopUp && (
              <PopUpRekap
                selectedDate={selectedDate}
                setShowPopUp={setShowPopUp}
                setLoading={setLoading}
                selectedStaffId={karyawan.id}
                selectedStaffName={karyawan.name}
                selectedStaffBranch={karyawan.branch}
                businessId={businessData.id}
                fetchDataRekap={fetchDataRekap}
                selectedValue={date}
                selectedLabel="overtimeClockOut"
              />
            )}
          </div>
        );
      },
    },
  ];
};
