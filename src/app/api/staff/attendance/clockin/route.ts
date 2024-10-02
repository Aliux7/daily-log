import { NextRequest, NextResponse } from "next/server";
import { firestore, storage } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";

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

    const now = new Date();
    const timestampNow = Timestamp.fromDate(now);

    const formattedDate = now.toISOString().split("T")[0];

    const attendanceDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}/attendance/unfinished`
    );

    await setDoc(attendanceDocRef, {
      clockIn: timestampNow,
      date: formattedDate,
    });

    return NextResponse.json({
      success: true,
      message: "Attendance record inserted successfully",
    });
  } catch (error: any) {
    console.error("Error inserting attendance: ", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
