"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/app/components/ui/DatePicker";
import { ComboboxName } from "@/app/components/ui/ComboboxName";
import { exportExcel } from "@/lib/excelUtils";
import { Karyawan } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hourlyPaid: number;
  setHourlyPaid: (value: number) => void;
  date: string;
  setDate: (date: string) => void;
  handleUpdateHourlyPaid: () => void;
  listStaff: any;
  selectedStaff: string;
  setSelectedStaff: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  date,
  setDate,
  hourlyPaid,
  setHourlyPaid,
  handleUpdateHourlyPaid,
  listStaff,
  selectedStaff,
  setSelectedStaff,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="">
      <div className="flex items-center justify-start space-x-2 mb-4 h-12 ">
        <ComboboxName
          listStaff={listStaff}
          setSelectedStaff={setSelectedStaff}
        />
        <Input
          type="month"
          className="w-48 shadow-xl text-base py-6 rounded-md bg-background-color h-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="h-full w-96 relative flex justify-center items-center">
          <div className="absolute top-[0.1rem] left-1 bg-background-color w-fit h-[calc(100%-5px)] border-e rounded-md px-2 flex justify-center items-center text-sm text-gray-500">
            Gaji Per Jam
          </div>
          <Input
            type="number"
            step={100}
            className=" w-96 shadow-xl text-base py-6 rounded-md bg-background-color h-full ps-28 pe-24"
            placeholder="Masukan Gaji Per Jam"
            value={hourlyPaid}
            onChange={(e) => setHourlyPaid(e.target.valueAsNumber)}
          />
          <Button
            className="absolute right-2 h-3/4 shadow-xl bg-first-color hover:bg-first-color/90 px-3"
            onClick={handleUpdateHourlyPaid}
          >
            Simpan
          </Button>
        </div>
      </div>
      <div className="flex gap-3 mb-4 justify-end">
        <button
          className={`${
            selectedStaff == "" ? "bg-gray-500" : "bg-green-600"
          } text-white py-2 px-5 rounded-md shadow-xl`}
          disabled={selectedStaff == ""}
          onClick={() => exportExcel(listStaff.find((staff: Karyawan) => staff.id === selectedStaff), data)}
        >
          Export Seorang
        </button>
        <button className="bg-purple-600 text-white py-2 px-5 rounded-md shadow-xl">
          Export Semua
        </button>
      </div>

      <div className="shadow-xl rounded-xl ">
        <Table className="bg-background-color rounded-xl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
