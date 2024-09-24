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

export type Absensi = {
  id: string;
  name: string;
  branch: string;
  ongoing?: string;
};

export const columns: ColumnDef<Absensi>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
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
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Aktif
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
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
              {absensi.ongoing}
            </span>
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const absensi = row.original;
      return (
        <div className="text-center">
          <Link
            href={`/face-recognition/${absensi.id}`}
            className="text-first-color bg-blue-100 px-2 py-1 rounded-xl"
          >
            Buka Pemindaian Wajah
          </Link>
        </div>
      );
      // navigator.clipboard.writeText(Absensi.id)
    },
  },
];
