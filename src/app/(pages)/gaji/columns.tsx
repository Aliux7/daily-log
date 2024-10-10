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
import { clockIn, clockOut } from "../absensi/actions";
import { Timestamp } from "firebase/firestore";

export type Karyawan = {
  id: string;
  name: string;
  branch: string;
  gender: string;
  profileUrl: string;
  role: string;
};

export const getColumns = (hourlyPaid: number) => {
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
        if (!karyawan.clockIn)
          return <h1 className={`text-center`}>0 jam : 0 menit</h1>;

        let hoursDifference = 0;
        let minutesDifference = 0;

        const convertFirestoreTimestampToDate = (timestamp: Timestamp) => {
          const milliseconds =
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
          return new Date(milliseconds);
        };

        if (karyawan.clockIn && karyawan.clockOut) {
          const clockInTime = convertFirestoreTimestampToDate(karyawan.clockIn);
          const clockOutTime = convertFirestoreTimestampToDate(
            karyawan.clockOut
          );
          const timeDifference = clockOutTime.getTime() - clockInTime.getTime();
          const hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );

          hoursDifference = hoursDifference + hours;
          minutesDifference = minutesDifference + minutes;
        }

        if (karyawan.overtimeClockIn && karyawan.overtimeClockOut) {
          const overtimeClockInTime = convertFirestoreTimestampToDate(
            karyawan.overtimeClockIn
          );
          const overtimeClockOutTime = convertFirestoreTimestampToDate(
            karyawan.overtimeClockOut
          );
          const overtimeDifference =
            overtimeClockOutTime.getTime() - overtimeClockInTime.getTime();
          const hours = Math.floor(overtimeDifference / (1000 * 60 * 60));
          const minutes = Math.floor(
            (overtimeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );

          hoursDifference = hoursDifference + hours;
          minutesDifference = minutesDifference + minutes;
        }

        return (
          <div>
            <h1 className={`text-center`}>
              {hoursDifference} jam : {minutesDifference} menit
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
        if (karyawan.subtotalAmount == 0)
          return <h1 className={`text-center`}>Rp. 0</h1>;

        const formatToIDR = (amount: number) => {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(amount);
        };

        const formattedSubtotal = formatToIDR(karyawan.subtotalAmount);
        return (
          <div>
            <h1 className={`text-center`}>{formattedSubtotal}</h1>
          </div>
        );
      },
    },
  ];
};
