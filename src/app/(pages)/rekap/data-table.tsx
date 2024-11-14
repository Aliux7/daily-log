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

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/app/components/ui/DatePicker";
import { addCategory, getAllCategories } from "./actions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  businessId?: string;
  role?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  date,
  setDate,
  businessId,
  role,
}: DataTableProps<TData, TValue>) {
  const [allRegionals, setAllRegionals] = React.useState([]);
  const [regionalValue, setRegionalValue] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleRegionFilter = (region: string) => {
    setSelectedRegion(region);
    if (region) {
      table.getColumn("branch")?.setFilterValue(region);
    } else {
      table.getColumn("branch")?.setFilterValue(undefined);
    }
  };

  const fetchCategories = async () => {
    if (businessId != "" && businessId != null && businessId != undefined) {
      const result = await getAllCategories(businessId);
      if (result?.success) {
        setAllRegionals(result.data);
      }
    }
  };

  const handleAddCategory = async () => {
    if (
      businessId != "" &&
      businessId != null &&
      businessId != undefined &&
      regionalValue != ""
    ) {
      const result = await addCategory(businessId, regionalValue);
      setRegionalValue("");
      fetchCategories();
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 h-12">
        <div className="flex items-center justify-end space-x-2 h-full">
          <Input
            placeholder="Cari Nama..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm shadow-xl text-base py-6 rounded-md bg-background-color h-full"
          />
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="flex items-center justify-end space-x-2 h-full">
          <Button
            className="h-full shadow-xl"
            variant="outline"
            size="lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="h-full shadow-xl"
            variant="outline"
            size="lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mb-4 flex justify-start items-center gap-3">
        <ul className="flex justify-start items-center border p-2 w-fit bg-background-color rounded-xl gap-4 shadow-xl">
          <li
            onClick={() => (
              table.getColumn("branch")?.setFilterValue(undefined),
              setSelectedRegion("")
            )}
          >
            <div
              className={`text-sm p-1 rounded-sm h-full hover:text-black cursor-pointer ${
                selectedRegion == "" ? "text-black" : "text-gray-500"
              }`}
            >
              Semua
            </div>
          </li>
          {allRegionals.map((region) => (
            <li onClick={() => handleRegionFilter(region)}>
              <div
                className={`text-sm p-1 rounded-sm h-full text-gray-500 hover:text-black cursor-pointer ${
                  selectedRegion == region ? "text-black" : "text-gray-500"
                }`}
              >
                {region}
              </div>
            </li>
          ))}
        </ul>
        {role == "Owner" && (
          <div className="relative flex justify-center items-center">
            <Input
              placeholder="Tambahkan Kategori . . ."
              value={regionalValue}
              onChange={(e) => setRegionalValue(e.target.value)}
              className="w-72 shadow-lg text-sm py-[0.8rem] rounded-xl bg-background-color h-full pr-28 focus:outline-none"
            />
            <button
              className="absolute right-2 bg-blue-300 text-blue-700 text-sm rounded-lg px-2 py-1"
              onClick={handleAddCategory}
            >
              Tambahkan
            </button>
          </div>
        )}
      </div>
      <div className="shadow-xl rounded-xl">
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
