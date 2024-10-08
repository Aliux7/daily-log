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
  selectedDate: string,
  fetchDataRekap: () => void,
  businessData: any,
  userData: any,
  setLoading: (value: boolean) => void
) => {
  return [
    {
      accessorKey: "date",
      header: "Tanggal",
    },
    {
      accessorKey: "clockIn",
      header: () => {
        return <h1 className="text-center">Jam Masuk</h1>;
      },
      cell: ({ row }: any) => {
        const karyawan = row.original; 
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.clockIn) {
          const { seconds } = karyawan.clockIn;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {!karyawan?.clockIn ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
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
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.clockOut) {
          const { seconds } = karyawan.clockOut;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {!karyawan?.clockOut ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
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
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.overtimeClockIn) {
          const { seconds } = karyawan.overtimeClockIn;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {!karyawan?.overtimeClockIn ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
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
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.overtimeClockOut) {
          const { seconds } = karyawan.overtimeClockOut;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {!karyawan?.overtimeClockOut ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
          </div>
        );
      },
    },
    {
      accessorKey: "workingHours",
      header: () => {
        return <h1 className="text-center">Jam Kerja</h1>;
      },
      cell: ({ row }: any) => {
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.overtimeClockOut) {
          const { seconds } = karyawan.overtimeClockOut;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {!karyawan?.overtimeClockOut ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
          </div>
        );
      },
    },
    {
      accessorKey: "subtotalAmount",
      header: () => {
        return <h1 className="text-center">Rp.</h1>;
      },
      cell: ({ row }: any) => {
        const karyawan = row.original;
        let formattedTime = "";
        let date = undefined;
        let dd = "";
        let mm = "";
        if (karyawan?.overtimeClockOut) {
          const { seconds } = karyawan.overtimeClockOut;
          date = new Date(seconds * 1000);
          dd = format(date, "dd");
          mm = format(date, "MM");
          formattedTime = format(date, "HH:mm");
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {!karyawan?.overtimeClockOut ? (
                "-- : --"
              ) : (
                <div>
                  <sup className="font-semibold">{dd}</sup>/
                  <sub className="font-semibold">{mm}</sub> ({formattedTime})
                </div>
              )}
            </h1>
          </div>
        );
      },
    },
  ];
};
