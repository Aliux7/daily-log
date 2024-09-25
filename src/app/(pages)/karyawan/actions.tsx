export const insertStaff = async (
  name: string,
  branch: string,
  gender: string,
  businessId: string
) => {
  try {
    const staffData = {
      name: name,
      branch: branch,
      gender: gender,
    };
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId, staffData }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, exists: result.exists };
    } else {
      return { success: false, message: "Failed to check company name." };
    }
  } catch (error) {
    return { success: false, message: "Error checking company name: " + error };
  }
};

export const getAllStaffsByBusinessId = async (businessId: string) => {
  try {
    const response = await fetch(`/api/staff/getAllStaffsByBusiness?businessId=${businessId}`);
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
