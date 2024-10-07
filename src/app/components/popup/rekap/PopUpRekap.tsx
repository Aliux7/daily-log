"use client";
import { updateRekap } from "@/app/(pages)/rekap/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";

interface PopUpRekapProps {
  selectedDate: Date | undefined;
  selectedLabel: string;
  selectedValue: Date | undefined;
  setShowPopUp: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  selectedStaffId: string;
  selectedStaffName: string;
  selectedStaffBranch: string;
  businessId: string;
  fetchDataRekap: () => void;
}

function PopUpRekap(props: PopUpRekapProps) {
  const getDateTimeValue = () => {
    if (!props.selectedValue) return "";
    const formattedDate = format(props.selectedValue, "yyyy-MM-dd");
    const timeValue = format(props.selectedValue, "HH:mm");
    return `${formattedDate}T${timeValue}:00`;
  };

  const { toast } = useToast();
  const [datetimelocalValue, setDatetimelocalValue] = useState(
    getDateTimeValue()
  );

  const translations: Record<string, string> = {
    clockIn: "Jam Masuk",
    clockOut: "Jam Keluar",
    overtimeClockIn: "Jam Lembur Masuk",
    overtimeClockOut: "Jam Lembur Keluar",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!props.selectedDate) return;

    props.setLoading(true);
    const dateObject = new Date(datetimelocalValue);
    const valueTimestamp =
      datetimelocalValue != "" ? Timestamp.fromDate(dateObject) : "";

    const attendanceData = {
      [props.selectedLabel]: valueTimestamp,
      date: format(props.selectedDate, "yyyy-MM-dd"),
    };

    const result = await updateRekap(
      props.businessId,
      props.selectedStaffId,
      format(props.selectedDate, "yyyy-MM-dd"),
      attendanceData
    );

    if (result.success) {
      toast({
        title: "Perubahan Jam Berhasil ! !",
        description: `Perubahan Jam untuk ${props.selectedStaffName} telah berhasil diubah.`,
        type: "background",
      });
    } else {
      toast({
        title: "Perubahan Jam Gagal ! !",
        description: `Perubahan Jam untuk ${props.selectedStaffName} telah gagal diubah.`,
        type: "foreground",
      });
    }

    props.fetchDataRekap();
    props.setShowPopUp(false);
    props.setLoading(false);
  };

  return (
    <div
      className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50"
      onClick={() => props.setShowPopUp(false)}
    >
      <div
        className="relative w-96 max-h-[85vh] h-fit bg-gray-100 rounded-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-end pb-3 gap-2 mt-1 border-b">
            <Label className="text-primary-text">
              {props.selectedDate
                ? format(props.selectedDate, "MMMM d, yyyy")
                : ""}
            </Label>
            <div className="flex justify-start items-start w-full">
              <Label className="text-primary-text">
                {props.selectedStaffName} - {props.selectedStaffBranch}
              </Label>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start gap-3 mb-5 mt-5">
            <Label className="text-primary-text">
              {translations[props.selectedLabel] || "Unknown"}:
            </Label>
            <Input
              type="datetime-local"
              className="flex justify-center items-center"
              min={
                props.selectedDate
                  ? format(props.selectedDate, "yyyy-MM-dd'T'" + "00:00:00")
                  : ""
              }
              value={datetimelocalValue}
              onChange={(e) => setDatetimelocalValue(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-first-color text-white w-full text-center rounded-xl py-2"
          >
            Ubah
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default PopUpRekap;
