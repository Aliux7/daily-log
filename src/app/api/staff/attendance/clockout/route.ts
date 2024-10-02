import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, staffId } = body;

    if (!businessId || !staffId) {
      return NextResponse.json(
        { success: false, message: "Missing businessId or staffId" },
        { status: 400 }
      );
    }

    const unfinishedDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}/attendance/unfinished`
    );

    const unfinishedDocSnap = await getDoc(unfinishedDocRef);

    if (!unfinishedDocSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "No unfinished attendance record found" },
        { status: 404 }
      );
    }

    const unfinishedData = unfinishedDocSnap.data();
    const { clockIn, date } = unfinishedData;

    const now = new Date();
    const clockOut = Timestamp.fromDate(now);

    // Reference to the document with date as the ID
    const attendanceDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}/attendance/${date}`
    );

    const attendanceDocSnap = await getDoc(attendanceDocRef);

    if (attendanceDocSnap.exists()) {
      await updateDoc(attendanceDocRef, {
        overtimeClockIn: clockIn,
        overtimeClockOut: clockOut,
      });
    } else {
      await setDoc(attendanceDocRef, {
        clockIn: clockIn,
        clockOut: clockOut,
        date: date,
      });
    }

    await deleteDoc(unfinishedDocRef);

    return NextResponse.json({
      success: true,
      message: "Attendance record updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating attendance record: ", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
