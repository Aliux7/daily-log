import { NextRequest, NextResponse } from "next/server";
import { firestore, storage } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const selectedDate = searchParams.get("date");

    if (!businessId) {
      return NextResponse.json(
        { success: false, message: "Missing businessId" },
        { status: 400 }
      );
    }

    if (!selectedDate) {
      return NextResponse.json(
        { success: false, message: "Missing selected date" },
        { status: 400 }
      );
    }

    // Get all staff members under this business
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
        `businesses/${businessId}/staffs/${staffDoc.id}/attendance/${selectedDate}`
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
        attendance: attendanceData,
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
    const body = await req.json();
    const { businessId, staffId, selectedDate, attendanceData } = body;

    if (!businessId || !staffId || !selectedDate || !attendanceData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const attendanceDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}/attendance/${selectedDate}`
    );

    await setDoc(attendanceDocRef, attendanceData, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Attendance data successfully updated or inserted",
    });
  } catch (error: any) {
    console.error("Error in POST: ", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
