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

export type Karyawan = {
  id: string;
  name: string;
  branch: string;
  gender: string;
  profileUrl: string;
  role: string;
};

export const getColumns = (
  fetchDataKaryawan: () => void,
  businessData: any,
  setLoading: (value: boolean) => void
) => {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => {
        const karyawan = row.original;
        return <h1 className="text-first-color">#{karyawan.id}</h1>;
      },
    },
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
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "profile",
      header: "Profil",
      cell: ({ row }: any) => {
        const [open, setOpen] = useState(false);
        const karyawan = row.original;

        return (
          <div>
            {open && (
              <div
                className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50"
                onClick={() => setOpen(false)}
              >
                <img
                  src={karyawan.profileUrl}
                  className="max-h-[90vh] max-w-[90vw] h-auto w-auto"
                />
                {/* {karyawan.profileUrl} */}
              </div>
            )}
            <h1
              className="text-first-color underline cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Buka Foto
            </h1>
          </div>
        );
      },
    },
    {
      accessorKey: "shift",
      header: "Shift",
      cell: ({ row }: any) => {
        const [open, setOpen] = useState(false);
        const karyawan = row.original;

        return (
          <div>
            {open && (
              <ShiftKaryawan
                setOpen={setOpen}
                setLoading={setLoading}
                selectedRowId={karyawan.id}
                businessId={businessData?.id ? businessData.id : ""}
              />
            )}
            <h1
              className="text-first-color underline cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Atur Shift
            </h1>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const karyawan = row.original;
        const [showEditPopUp, setShowEditPopUp] = useState(false);
        const [showDeletePopUp, setShowDeletePopUp] = useState(false);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-5 w-5 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>ID: {karyawan.id}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowEditPopUp(true)}>
                Ubah Data Karyawan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeletePopUp(true)}>
                Hapus Karyawan
              </DropdownMenuItem>
            </DropdownMenuContent>
            {showEditPopUp && (
              <PopUpKaryawan
                fetchDataKaryawan={fetchDataKaryawan}
                setShowPopUp={setShowEditPopUp}
                selectedRowId={karyawan.id}
                setLoading={setLoading}
                businessId={businessData?.id ? businessData.id : ""}
              />
            )}
            {showDeletePopUp && (
              <ConfirmationKaryawan
                fetchDataKaryawan={fetchDataKaryawan}
                setShowPopUp={setShowDeletePopUp}
                selectedRowId={karyawan.id}
                setLoading={setLoading}
                businessId={businessData?.id ? businessData.id : ""}
              />
            )}
          </DropdownMenu>
        );
      },
    },
  ];
};
