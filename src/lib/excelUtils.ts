import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

export type Karyawan = {
  id: string;
  name: string;
  branch: string;
  gender: string;
  profileUrl: string;
  role: string;
};

const formatToIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const exportExcel = (selectedStaff: Karyawan, staffData: any[]) => {
  if (!selectedStaff) return;

  const totalAmount = staffData.reduce((sum, row) => sum + row.subtotalAmount, 0);
  const dataToExport = staffData.map((row) => ({
    Tanggal: row.date,
    "Jam Masuk": row.clockIn
      ? format(new Date(row.clockIn.seconds * 1000), "dd MMM yyyy, HH:mm") 
      : "-- : --",
    "Jam Keluar": row.clockOut
      ? format(new Date(row.clockOut.seconds * 1000), "dd MMM yyyy, HH:mm")  
      : "-- : --",
    "Jam Kerja": `${Math.floor(row.workingHours)} jam : ${Math.floor(
      (row.workingHours - Math.floor(row.workingHours)) * 60
    )} menit`,
    Total: `${formatToIDR(row.subtotalAmount)}`,
  }));

  dataToExport.push({
    Tanggal: "",
    "Jam Masuk": "",
    "Jam Keluar": "",
    "Jam Kerja": "Total",
    Total: `${formatToIDR(totalAmount)}`,
  });

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const colWidths = [
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 200 },
  ];

  // Add column widths to the worksheet
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Karyawan");

  const clockInDate = staffData[7].clockIn
    ? new Date(staffData[7].clockIn.seconds * 1000)
    : new Date();
  const formattedDate = format(clockInDate, "MMMM yyyy");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Rekap_${selectedStaff.name}_${formattedDate}.xlsx`);
};
