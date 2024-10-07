import { NextRequest, NextResponse } from "next/server";
import { firestore, storage } from "@/lib/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const staffId = searchParams.get("staffId");

    if (!businessId || !staffId) {
      return NextResponse.json(
        { success: false, message: "Missing businessId or staffId" },
        { status: 400 }
      );
    }

    const staffDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}`
    );

    const staffDocSnap = await getDoc(staffDocRef);

    if (!staffDocSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Staff not found" },
        { status: 404 }
      );
    }

    const staffData = staffDocSnap.data();

    return NextResponse.json(
      {
        success: true,
        shift: staffData.shift,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shift data: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shift data: " + error },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, staffId, shift } = body;

    if (!businessId || !staffId || !shift) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing businessId, staffId, or shift data",
        },
        { status: 400 }
      );
    }

    const staffDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}`
    );

    await updateDoc(staffDocRef, { shift });

    return NextResponse.json(
      {
        success: true,
        message: "Staff shift updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating staff shift: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update staff shift: " + error,
      },
      { status: 500 }
    );
  }
}
