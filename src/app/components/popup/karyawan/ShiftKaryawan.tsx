"use client";
import {
  deleteStaff,
  getStaffByBusinessId,
  updateStaffShift,
} from "@/app/(pages)/karyawan/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

interface ShiftKaryawanProps {
  setOpen: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  selectedRowId?: string;
  businessId: string;
}

function ShiftKaryawan(props: ShiftKaryawanProps) {
  const { toast } = useToast();
  const [name, setName] = useState("Loading . . .");

  const [clockInSenin, setClockInSenin] = useState("");
  const [clockOutSenin, setClockOutSenin] = useState("");

  const [clockInSelasa, setClockInSelasa] = useState("");
  const [clockOutSelasa, setClockOutSelasa] = useState("");

  const [clockInRabu, setClockInRabu] = useState("");
  const [clockOutRabu, setClockOutRabu] = useState("");

  const [clockInKamis, setClockInKamis] = useState("");
  const [clockOutKamis, setClockOutKamis] = useState("");

  const [clockInJumat, setClockInJumat] = useState("");
  const [clockOutJumat, setClockOutJumat] = useState("");

  const [clockInSabtu, setClockInSabtu] = useState("");
  const [clockOutSabtu, setClockOutSabtu] = useState("");

  const [clockInMinggu, setClockInMinggu] = useState("");
  const [clockOutMinggu, setClockOutMinggu] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    props.setLoading(true);

    if (props.selectedRowId == null) {
      toast({
        title: "Shift Staff Gagal Menyimpan ! !",
        description: "Mohon Maaf, silakan mencoba kembali.",
        type: "foreground",
      });
      return;
    }

    const shift = [
      { day: "Senin", clockIn: clockInSenin, clockOut: clockOutSenin },
      { day: "Selasa", clockIn: clockInSelasa, clockOut: clockOutSelasa },
      { day: "Rabu", clockIn: clockInRabu, clockOut: clockOutRabu },
      { day: "Kamis", clockIn: clockInKamis, clockOut: clockOutKamis },
      { day: "Jumat", clockIn: clockInJumat, clockOut: clockOutJumat },
      { day: "Sabtu", clockIn: clockInSabtu, clockOut: clockOutSabtu },
      { day: "Minggu", clockIn: clockInMinggu, clockOut: clockOutMinggu },
    ];

    const result = await updateStaffShift(
      props.businessId,
      props.selectedRowId,
      shift
    );

    if (result.success) {
      props.setOpen(false);
      toast({
        title: "Shift Staff Berhasil Disimpan! !",
        description: "Shift Staff telah berhasil disimpan.",
        type: "background",
      });
    } else {
      toast({
        title: "Shift Staff Gagal Disimpan ! !",
        description: "Mohon Maaf, Silakan coba kembali.",
        type: "foreground",
      });
    }
    props.setLoading(false);
  };

  useEffect(() => {
    if (props.selectedRowId) {
      const getStaffToUpdate = async () => {
        const result = await getStaffByBusinessId(
          props.businessId as string,
          props.selectedRowId as string
        );

        if (result?.success) {
          setName(result.data.name);
          const shifts = result.data.shift;

          setClockInSenin(shifts[0].clockIn);
          setClockOutSenin(shifts[0].clockOut);

          setClockInSelasa(shifts[1].clockIn);
          setClockOutSelasa(shifts[1].clockOut);

          setClockInRabu(shifts[2].clockIn);
          setClockOutRabu(shifts[2].clockOut);

          setClockInKamis(shifts[3].clockIn);
          setClockOutKamis(shifts[3].clockOut);

          setClockInJumat(shifts[4].clockIn);
          setClockOutJumat(shifts[4].clockOut);

          setClockInSabtu(shifts[5].clockIn);
          setClockOutSabtu(shifts[5].clockOut);

          setClockInMinggu(shifts[6].clockIn);
          setClockOutMinggu(shifts[6].clockOut);
        }
      };

      getStaffToUpdate();
    }
  }, [props.selectedRowId]);

  return (
    <div
      className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50"
      onClick={() => props.setOpen(false)}
    >
      <div
        className="relative w-96 max-h-[85vh] h-fit bg-gray-100 rounded-xl p-5 flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center gap-3 items-start mb-5 mt-1">
            <Label className="text-primary-text">Nama:</Label>
            <Input type="text" value={name} readOnly />
          </div>
          {/* Shift Senin */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Senin:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInSenin}
                onChange={(e) => setClockInSenin(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutSenin}
                onChange={(e) => setClockOutSenin(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Selasa */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Selasa:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInSelasa}
                onChange={(e) => setClockInSelasa(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutSelasa}
                onChange={(e) => setClockOutSelasa(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Rabu */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Rabu:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInRabu}
                onChange={(e) => setClockInRabu(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutRabu}
                onChange={(e) => setClockOutRabu(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Kamis */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Kamis:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInKamis}
                onChange={(e) => setClockInKamis(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutKamis}
                onChange={(e) => setClockOutKamis(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Jumat */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Jumat:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInJumat}
                onChange={(e) => setClockInJumat(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutJumat}
                onChange={(e) => setClockOutJumat(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Sabtu */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Sabtu:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInSabtu}
                onChange={(e) => setClockInSabtu(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutSabtu}
                onChange={(e) => setClockOutSabtu(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Minggu */}
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Shift Minggu:</Label>
            <div className="w-full flex justify-between items-center gap-5">
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockInMinggu}
                onChange={(e) => setClockInMinggu(e.target.value)}
              />
              -
              <Input
                type="time"
                className="flex justify-center items-center"
                value={clockOutMinggu}
                onChange={(e) => setClockOutMinggu(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-first-color text-white w-full text-center rounded-xl py-2"
          >
            Simpan Shift
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShiftKaryawan;
