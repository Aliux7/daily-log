"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getStaffByBusinessId,
  insertStaff,
  updateStaff,
} from "@/app/(pages)/karyawan/actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PopUpKaryawanProps {
  setShowPopUp: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  selectedRowId?: string;
  businessId: string;
  fetchDataKaryawan: () => void;
}

function PopUpKaryawan(props: PopUpKaryawanProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [branch, setBranch] = useState("");
  const [errorBranch, setErrorBranch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorSelectedFile, setErrorSelectedFile] = useState("");
  const [gender, setGender] = useState("");
  const [errorGender, setErrorGender] = useState("");

  useEffect(() => {
    if (props.selectedRowId) {
      const getStaffToUpdate = async () => {
        const result = await getStaffByBusinessId(
          props.businessId as string,
          props.selectedRowId as string
        );

        if (result?.success) {
          setName(result.data.name);
          setBranch(result.data.branch);
          setGender(result.data.gender);
        }
      };

      getStaffToUpdate();
    }
  }, [props.selectedRowId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleValidationInput = () => {
    let valid = true;

    if (name.length < 3 || name.length > 30) {
      setErrorName("Harap memasukan 3 - 30 karakter.");
      valid = false;
    } else {
      setErrorName("");
    }

    if (branch.length < 3 || branch.length > 30) {
      setErrorBranch("Harap memasukan 3 - 30 karakter.");
      valid = false;
    } else {
      setErrorBranch("");
    }

    if (gender == "" || gender == null) {
      setErrorGender("Harap memilih salah satu gender");
      valid = false;
    } else {
      setErrorGender("");
    }

    if (
      selectedFile == null &&
      (props.selectedRowId == null || props.selectedRowId == undefined)
    ) {
      setErrorSelectedFile("Harap memasukan photo terbaru karyawan");
      valid = false;
    } else {
      setErrorSelectedFile("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    props.setLoading(true);

    const valid = handleValidationInput();
    if (!valid) {
      props.setLoading(false);
      return;
    }

    if (!props.businessId) {
      toast({
        title: "Staff Gagal Ditambahkan ! !",
        description: "Mohon Maaf, Silakan coba kembali.",
        type: "foreground",
      });
      return;
    }

    if (props.selectedRowId) await handleUpdate();
    else await handleAdd();

    props.fetchDataKaryawan();
    props.setLoading(false);
    setName("");
    setGender("");
    setBranch("");
  };

  const handleAdd = async () => {
    if (selectedFile == null) {
      toast({
        title: "Staff Gagal Ditambahkan ! !",
        description: "Mohon Maaf, Silakan memasukan gambar kembali.",
        type: "foreground",
      });
      return;
    }

    const result = await insertStaff(
      name,
      branch,
      gender,
      selectedFile,
      props.businessId
    );

    if (result.success) {
      props.setShowPopUp(false);
      toast({
        title: "Staff Berhasil Ditambahkan! !",
        description: "Staff baru telah berhasil terdaftar.",
        type: "background",
      });
    } else {
      toast({
        title: "Staff Gagal Ditambahkan ! !",
        description: "Mohon Maaf, Silakan coba kembali.",
        type: "foreground",
      });
    }
  };

  const handleUpdate = async () => {
    if (props.selectedRowId == null) {
      toast({
        title: "Staff Gagal Ditambahkan ! !",
        description: "Mohon Maaf, mencoba kembali.",
        type: "foreground",
      });
      return;
    }

    const result = await updateStaff(
      name,
      branch,
      gender,
      props.businessId,
      props.selectedRowId,
      selectedFile
    );

    if (result.success) {
      props.setShowPopUp(false);
      toast({
        title: "Staff Berhasil Diubah! !",
        description: "Staff telah berhasil diubah.",
        type: "background",
      });
    } else {
      toast({
        title: "Staff Gagal Diubah ! !",
        description: "Mohon Maaf, Silakan coba kembali.",
        type: "foreground",
      });
    }
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
          <div className="flex flex-col justify-center gap-3 items-start mb-5 mt-1">
            <Label className="text-primary-text">Nama:</Label>
            <Input
              type="text"
              placeholder="John Doe"
              maxLength={30}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errorName && (
              <p className="ml-1 text-xs text-red-600 dark:text-red-500">
                {errorName}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Cabang:</Label>
            <Input
              type="text"
              placeholder="Jakarta"
              maxLength={30}
              required
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
            {errorBranch && (
              <p className="ml-1 text-xs text-red-600 dark:text-red-500">
                {errorBranch}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Foto Terbaru:</Label>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
            {errorSelectedFile && (
              <p className="ml-1 text-xs text-red-600 dark:text-red-500">
                {errorSelectedFile}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-3 items-start my-5">
            <Label className="text-primary-text">Gender:</Label>
            <RadioGroup
              defaultValue="comfortable"
              className="flex gap-5 mx-1"
              value={gender}
              onValueChange={(value) => setGender(value)}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <RadioGroupItem value="Pria" id="r1" />
                <Label htmlFor="r1">Pria</Label>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer">
                <RadioGroupItem value="Wanita" id="r2" />
                <Label htmlFor="r2">Wanita</Label>
              </div>
            </RadioGroup>
            {errorGender && (
              <p className="ml-1 text-xs text-red-600 dark:text-red-500">
                {errorGender}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-first-color text-white w-full text-center rounded-xl py-2"
          >
            {props.selectedRowId ? "Ubah" : "Tambahkan"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopUpKaryawan;
