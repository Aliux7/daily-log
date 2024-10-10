"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxNameProps {
  listStaff: { id: string; name: string; branch: string }[];
  setSelectedStaff: (staff: string) => void;
}

export function ComboboxName({
  listStaff,
  setSelectedStaff,
}: ComboboxNameProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const selectedStaff = listStaff.find((staff) => staff.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-96 max-w-96 justify-between h-full shadow-xl bg-background-color rounded-md"
        >
          {selectedStaff
            ? `${selectedStaff.name} - ${selectedStaff.branch}`
            : "Pilih Karyawan..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-96  max-w-96 p-0">
        <Command>
          <CommandInput placeholder="Cari karyawan..." />
          <CommandList>
            <CommandEmpty>Karyawan Tidak Ditemukan.</CommandEmpty>
            <CommandGroup>
              {listStaff.map((staff) => (
                <CommandItem
                  key={staff.id}
                  value={staff.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setSelectedStaff(
                      currentValue === value ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === staff.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {staff.name} - {staff.branch}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
