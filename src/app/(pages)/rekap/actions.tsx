export const getAllAttendanceByDate = async (
  businessId: string,
  selectedDate: string
) => {
  try {
    const response = await fetch(
      `/api/staff/recap?businessId=${businessId}&date=${selectedDate}`
    );
    const result = await response.json();

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const updateRekap = async (
  businessId: string,
  staffId: string,
  selectedDate: string,
  attendanceData: any
) => {
  try {
    console.log(businessId, staffId, selectedDate, attendanceData);

    const response = await fetch("/api/staff/recap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessId,
        staffId,
        selectedDate,
        attendanceData: attendanceData,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, message: "Update Successful" };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    return { success: false, message: "Error: " + error };
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
