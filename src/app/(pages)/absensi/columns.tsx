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
import FaceScanner from "@/app/components/scanner/FaceScanner";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";

export type Absensi = {
  id: string;
  name: string;
  branch: string;
  profileUrl: string;
  ongoing?: any;
};

const formatTimestamp = (timestamp: any) => {
  if (
    timestamp &&
    typeof timestamp === "object" &&
    "seconds" in timestamp &&
    "nanoseconds" in timestamp
  ) {
    const date = new Date(timestamp.seconds * 1000);

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Format the time
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }

  return "N/A";
};

export const getColumns = (
  fetchDataAbsensi: () => void,
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
      accessorKey: "ongoing",
      header: ({ column }: any) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Aktif
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }: any) => {
        const absensi = row.original;
        if (absensi.ongoing == null) {
          return (
            <div className="flex items-center justify-center w-full">
              <span className="bg-red-100 text-red-700 rounded-xl px-2 py-0.5">
                Tidak Aktif
              </span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center w-full">
              <span className="bg-green-100 text-green-700 rounded-xl px-2 py-0.5">
                {absensi.ongoing
                  ? formatTimestamp(absensi.ongoing.clockIn)
                  : "N/A"}
              </span>
            </div>
          );
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const absensi = row.original;
        const [showCamera, setShowCamera] = useState(false);
        return (
          <div className="flex justify-center items-center">
            <div
              onClick={() => setShowCamera(true)}
              className="text-first-color bg-blue-100 px-2 py-1 rounded-xl w-fit cursor-pointer"
            >
              Buka Pemindaian Wajah
            </div>
            {showCamera && (
              <div
                className="fixed z-50 w-screen h-screen flex justify-center items-start top-0 left-0 bg-black/50"
                onClick={() => setShowCamera(false)}
              >
                <FaceScanner
                  setShowCamera={setShowCamera}
                  id={absensi.id}
                  name={absensi.name}
                  profileUrl={absensi.profileUrl}
                  typeAbsen={absensi?.ongoing?.clockIn ? "Keluar" : "Masuk"}
                  fetchDataAbsensi={fetchDataAbsensi}
                  setLoading={setLoading}
                />
              </div>
            )}
          </div>
        );
      },
    },
  ];
};
