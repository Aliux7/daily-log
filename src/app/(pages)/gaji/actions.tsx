export const getMonthlyAttendanceByStaff = async (
  businessId: string,
  staffId: string,
  selectedDate: string
) => {
  try {
    const response = await fetch(
      `/api/staff/monthlyRecap?businessId=${businessId}&staffId=${staffId}&month=${selectedDate}`
    );
    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        dataAttendance: result.data,
        start: result.start,
        end: result.end,
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};
