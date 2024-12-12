import { storage } from "@/lib/firebase/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

export const uploadFile = async (file: File) => {
  try {
    const storageRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);

    console.log(snapshot);
    // if (result.success) {
    //   console.log("File uploaded successfully:", snapshot.metadata);
    //   return {
    //     success: true,
    //     dataAttendance: result.data,
    //     start: result.start,
    //     end: result.end,
    //     hourlyPaid: result.hourlyPaid,
    //   };
    // } else {
    //   return { success: false, message: result.message };
    // }
  } catch (error: any) {
    console.error("API call failed:", error.message);
  }
};
