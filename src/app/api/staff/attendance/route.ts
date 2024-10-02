import { NextRequest, NextResponse } from "next/server";
import { firestore, storage } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { success: false, message: "Missing businessId" },
        { status: 400 }
      );
    }

    const staffsCollectionRef = collection(
      firestore,
      `businesses/${businessId}/staffs`
    );
    const staffDocsSnap = await getDocs(staffsCollectionRef);

    if (staffDocsSnap.empty) {
      return NextResponse.json(
        { success: false, message: "No staff found" },
        { status: 404 }
      );
    }

    const staffDataArray: any[] = [];

    for (const staffDoc of staffDocsSnap.docs) {
      const staffData = staffDoc.data();
      const id = staffDoc.id;
      const name = staffData?.name;
      const branch = staffData?.branch;
      const profileUrl = staffData?.profileUrl;

      const attendanceDocRef = doc(
        firestore,
        `businesses/${businessId}/staffs/${staffDoc.id}/attendance`,
        "unfinished"
      );
      const attendanceDocSnap = await getDoc(attendanceDocRef);

      let attendanceData = null;
      if (attendanceDocSnap.exists()) {
        attendanceData = attendanceDocSnap.data();
      }

      staffDataArray.push({
        id,
        name,
        branch,
        profileUrl,
        ongoing: attendanceData,
      });
    }

    return NextResponse.json({
      success: true,
      data: staffDataArray,
    });
  } catch (error: any) {
    console.error("Error in GET: ", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
 
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { businessId, staffId, shift, profileUrlToDelete } = body;

    if (!businessId || !staffId || !shift) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the staff shift in Firestore
    const staffDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}`
    );
    await updateDoc(staffDocRef, { shift });

    // If there is a profile URL to delete, delete the file from Firebase Storage
    if (profileUrlToDelete) {
      const storageRef = ref(storage, profileUrlToDelete);
      await deleteObject(storageRef);
    }

    return NextResponse.json({
      success: true,
      message: "Shift updated successfully",
    });
  } catch (error: any) {
    console.error("Error in POST: ", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
