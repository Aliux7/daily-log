import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import {
  getAllStaffsByBusinessId,
  getMonthlyAttendanceByStaff,
} from "@/app/(pages)/gaji/actions";
import { Timestamp } from "firebase/firestore";

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

  const totalAmount = staffData.reduce(
    (sum, row) => sum + row.subtotalAmount,
    0
  );
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

const convertFirestoreTimestampToDate = (timestamp: Timestamp) => {
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  return new Date(milliseconds);
};

const calculateWorkingHours = (attendanceRecord: any) => {
  const clockInTime = convertFirestoreTimestampToDate(attendanceRecord.clockIn);
  const clockOutTime = convertFirestoreTimestampToDate(
    attendanceRecord.clockOut
  );
  const timeDifference = clockOutTime.getTime() - clockInTime.getTime();
  return timeDifference / (1000 * 60 * 60); // Convert to hours
};

const fetchListStaff = async (businessId: string) => {
  if (businessId && businessId != "") {
    const result = await getAllStaffsByBusinessId(businessId);
    if (result?.success) {
      const { data } = result;
      return {
        status: "success",
        data: data,
      };
    }
    return {
      status: "failed",
    };
  }
};

const fetchDataRekap = async (
  businessId: string,
  staffId: string,
  date: string
) => {
  if (businessId && businessId != "") {
    const result = await getMonthlyAttendanceByStaff(businessId, staffId, date);

    if (result?.success) {
      const { start, end, dataAttendance, hourlyPaid } = result;

      const startDate = new Date(start);
      const endDate = new Date(end);
      const allDates = [];

      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d).toISOString().split("T")[0]);
      }

      let totalPayslip = 0;

      const tempData = allDates.map((date) => {
        const attendanceRecord = dataAttendance.find(
          (record: { date: string }) => record.date == date
        );

        let subtotal = 0;
        let workingHours = 0;

        if (attendanceRecord?.clockIn && attendanceRecord?.clockOut) {
          workingHours = calculateWorkingHours(attendanceRecord);
          subtotal = workingHours * hourlyPaid;
        }

        // Kalau ada Overtime
        // if (
        //   attendanceRecord?.overtimeClockIn &&
        //   attendanceRecord?.overtimeClockOut
        // ) {
        //   const overtimeHours = calculateOvertimeHours(attendanceRecord);
        // workingHours = workingHours + overtimeHours;
        //   subtotal += overtimeHours * hourlyPaid;
        // }

        totalPayslip += subtotal;

        return {
          date,
          clockIn: attendanceRecord ? attendanceRecord.clockIn : null,
          clockOut: attendanceRecord ? attendanceRecord.clockOut : null,
          workingHours: workingHours,
          // Kalau ada Overtime
          // overtimeClockIn: attendanceRecord
          //   ? attendanceRecord.overtimeClockIn
          //   : null,
          // overtimeClockOut: attendanceRecord
          //   ? attendanceRecord.overtimeClockOut
          //   : null,
          subtotalAmount: subtotal,
        };
      });

      return {
        status: "success",
        totalAmount: totalPayslip,
        data: tempData,
      };
    }

    return {
      status: "failed",
    };
  }
};

export const exportExcelAll = async (businessId: string, date: string) => {
  const listStaffByBusiness = await fetchListStaff(businessId);

  if (!listStaffByBusiness) return { status: "failed" };

  const staffDataArray = await Promise.all(
    listStaffByBusiness.data.map(async (staff: Karyawan) => {
      const rekapData = await fetchDataRekap(businessId, staff.id, date);

      if (rekapData?.status === "success") {
        return {
          staff,
          data: rekapData.data,
          totalAmount: rekapData.totalAmount,
        };
      }
      return null;
    })
  );

  const workbook = XLSX.utils.book_new();

  staffDataArray.forEach((staffData: any) => {
    const { staff, data, totalAmount } = staffData;

    const dataToExport = data.map((row: any) => ({
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
      Tanggal: "Total",
      "Jam Masuk": "",
      "Jam Keluar": "",
      "Jam Kerja": "",
      Total: formatToIDR(totalAmount),
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const colWidths = [
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
    ];

    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, staff.name);
  });
  
  const formattedDate = format(date, "MMMM yyyy");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Rekap_Semua_Karyawan_${formattedDate}.xlsx`);
};
