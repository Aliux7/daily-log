import { storage } from "@/lib/firebase/firebaseConfig";
import { drive } from "@/lib/googledrive/googledriveConfig";
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
      shift: [
        { day: "Senin", clockIn: "", clockOut: "" },
        { day: "Selasa", clockIn: "", clockOut: "" },
        { day: "Rabu", clockIn: "", clockOut: "" },
        { day: "Kamis", clockIn: "", clockOut: "" },
        { day: "Jumat", clockIn: "", clockOut: "" },
        { day: "Sabtu", clockIn: "", clockOut: "" },
        { day: "Minggu", clockIn: "", clockOut: "" },
      ],
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
  // try {
  //   const fileMetadata = {
  //     name: `${businessId}-${userId}-${file.name}`,
  //     parents: ["your-google-drive-folder-id"],
  //   };

  //   const media = {
  //     mimeType: file.type,
  //     body: file.stream(),
  //   };

  //   const response = await drive.files.create({
  //     requestBody: fileMetadata,
  //     media: media,
  //     fields: "id, webViewLink, webContentLink",
  //   });

  //   const { id, webViewLink, webContentLink } = response.data;
 
  //   return {
  //     fileId: id,
  //     viewLink: webViewLink,
  //     downloadLink: webContentLink,
  //   };
  // } catch (error) {
  //   console.error("Error uploading file to Google Drive:", error);
  //   throw error;
  // }
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
    return { success: true, message: "Update Successful" };
  } else {
    return { success: false, message: resultUpdate.message };
  }
};

export const deleteStaff = async (businessId: string, staffId: string) => {
  const response = await fetch("/api/staff", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      businessId,
      staffId,
    }),
  });

  const result = await response.json();

  if (result.success) {
    return { success: true, message: "Delete Successful" };
  } else {
    return { success: false, message: result.message };
  }
};

export const updateStaffShift = async (
  businessId: string,
  staffId: string,
  shift: any
) => {
  const responseUpdate = await fetch("/api/staff/shift", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      businessId,
      staffId,
      shift,
    }),
  });

  const resultUpdate = await responseUpdate.json();

  if (resultUpdate.success) {
    return { success: true, message: "Update Shift Successful" };
  } else {
    return { success: false, message: resultUpdate.message };
  }
};
