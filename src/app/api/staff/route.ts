import { NextRequest, NextResponse } from "next/server";
import { auth, firestore } from "@/lib/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, staffData } = body;

    if (!businessId || !staffData) {
      return NextResponse.json(
        { success: false, message: "Missing businessId or staffData" },
        { status: 400 }
      );
    }

    const staffsRef = collection(firestore, `businesses/${businessId}/staffs`);
    const docRef = await addDoc(staffsRef, staffData);

    return NextResponse.json(
      {
        success: true,
        message: "Staff added successfully",
        staffId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding staff: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to add staff: " + error },
      { status: 500 }
    );
  }
}
