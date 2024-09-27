import { storage } from "@/lib/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const insertStaff = async (
  name: string,
  branch: string,
  gender: string,
  profile: File,
  businessId: string
) => {
  try {
    const staffData = {
      name: name,
      branch: branch,
      gender: gender,
      profileUrl: "",
    };

    const responseInsert = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId, staffData }),
    });

    const resultInsert = await responseInsert.json();

    if (resultInsert.success) {
      const staffId = resultInsert.staffId;
      const profileUrl = await uploadImageToFirebase(
        businessId,
        staffId,
        profile
      );

      const responseUpdate = await fetch("/api/staff", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          staffId,
          profileUrl,
        }),
      });

      const resultUpdate = await responseUpdate.json();

      if (resultUpdate.success) {
        return { success: true, message: "Insert Successful" };
      } else {
        return { success: false, message: resultUpdate.message };
      }
    } else {
      return { success: false, message: resultInsert.message };
    }
  } catch (error) {
    return { success: false, message: "Error checking company name: " + error };
  }
};

export const uploadImageToFirebase = async (
  businessId: string,
  userId: string,
  file: File
) => {
  const storageRef = ref(storage, `${businessId}/profiles/${userId}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  return downloadURL;
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

export const getStaffByBusinessId = async (
  businessId: string,
  staffId: string
) => {
  try {
    const response = await fetch(
      `/api/staff?businessId=${businessId}&staffId=${staffId}`
    );
    const data = await response.json();

    if (data.success) {
      return { success: true, data: data.staffData ? data.staffData : "" };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};

export const updateStaff = async (
  name: string,
  branch: string,
  gender: string,
  businessId: string,
  staffId: string,
  profile?: File | null
) => {
  let profileUrl = null;
  if (profile) {
    profileUrl = await uploadImageToFirebase(businessId, staffId, profile);
  }

  const responseUpdate = await fetch("/api/staff", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      businessId,
      staffId,
      profileUrl,
      branch,
      gender,
      name,
    }),
  });

  const resultUpdate = await responseUpdate.json();

  if (resultUpdate.success) {
    return { success: true, message: "Insert Successful" };
  } else {
    return { success: false, message: resultUpdate.message };
  }
};
