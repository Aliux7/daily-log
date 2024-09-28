import { deleteStaff } from "@/app/(pages)/karyawan/actions";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface ConfirmationKaryawanProps {
  setShowPopUp: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  selectedRowId?: string;
  businessId: string;
  fetchDataKaryawan: () => void;
}

function ConfirmationKaryawan(props: ConfirmationKaryawanProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    props.setLoading(true);

    if (props.selectedRowId == null) {
      toast({
        title: "Staff Gagal Menghapus ! !",
        description: "Mohon Maaf, silakan mencoba kembali.",
        type: "foreground",
      });
      return;
    }

    const result = await deleteStaff(props.businessId, props.selectedRowId);

    if (result.success) {
      props.setShowPopUp(false);
      toast({
        title: "Staff Berhasil Dihapus! !",
        description: "Staff telah berhasil dihapus.",
        type: "background",
      });
    } else {
      toast({
        title: "Staff Gagal Dihapus ! !",
        description: "Mohon Maaf, Silakan coba kembali.",
        type: "foreground",
      });
    }
    props.fetchDataKaryawan();
    props.setLoading(false);
  };

  return (
    <div
      className="fixed w-screen h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50"
      onClick={() => props.setShowPopUp(false)}
    >
      <div
        className="relative w-96 max-h-[85vh] h-fit bg-gray-100 rounded-xl p-5 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl">Konfirmasi Hapus Karyawan</h1>
        <hr className="bg-background-color w-full h-px my-2" />
        <h3>
          Apakah anda yakin ingin menghapus karyawan{" "}
          <span className="text-first-color underline">
            #{props.selectedRowId}
          </span>
        </h3>
        <div className="w-full flex justify-end gap-3 mt-2">
          <button
            className="text-gray-700 px-2 py-1 w-20 hover:underline"
            onClick={() => props.setShowPopUp(false)}
          >
            Batal
          </button>
          <button
            className="bg-red-300 text-red-700 hover:underline rounded-lg px-2 py-1 w-20"
            onClick={handleDelete}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationKaryawan;
