export const getActiveAttendanceByBusinessId = async (businessId: string) => {
  try {
    const response = await fetch(
      `/api/staff/attendance?businessId=${businessId}`
    );
    const result = await response.json();

    if (result.success) {
      return { success: true, data: result.data ? result.data : "" };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const clockIn = async (businessId: string, staffId: string) => {
  try {
    const responseClockIn = await fetch("/api/staff/attendance/clockin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId, staffId }),
    });

    const resultClockIn = await responseClockIn.json();

    if (resultClockIn.success) {
      return { success: true, message: "ClockIn Successful" };
    } else {
      return { success: false, message: resultClockIn.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const clockOut = async (businessId: string, staffId: string) => {
  try {
    const responseClockOut = await fetch("/api/staff/attendance/clockout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId, staffId }),
    });

    const resultClockOut = await responseClockOut.json();

    if (resultClockOut.success) {
      return { success: true, message: "ClockOut Successful" };
    } else {
      return { success: false, message: resultClockOut.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const addCategory = async (businessId: string, value: string) => {
  try {
    const responeAddCategory = await fetch("/api/categories/regional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId, value }),
    });

    const resultAddCategory = await responeAddCategory.json();

    if (resultAddCategory.success) {
      return { success: true, message: "Add Successful" };
    } else {
      return { success: false, message: resultAddCategory.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const getAllCategories = async (businessId: string) => {
  try {
    const responeCategories = await fetch(
      `/api/categories/regional?businessId=${businessId}`
    );

    const resultCategories = await responeCategories.json(); 
    if (resultCategories.success) {
      return { success: true, data: resultCategories.businessData.regional };
    } else {
      return { success: false, message: resultCategories.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};
