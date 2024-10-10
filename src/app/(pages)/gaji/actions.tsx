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
        hourlyPaid: result.hourlyPaid,
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const getAllStaffsByBusinessId = async (businessId: string) => {
  try {
    const response = await fetch(
      `/api/staff/getAllStaffsByBusiness?businessId=${businessId}`
    );
    const data = await response.json();

    if (data.success) {
      return { success: true, data: data.staffs };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};
