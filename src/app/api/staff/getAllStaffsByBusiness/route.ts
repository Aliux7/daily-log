import { NextRequest, NextResponse } from "next/server";
import { auth, firestore } from "@/lib/firebase/firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

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

    const staffsRef = collection(firestore, `businesses/${businessId}/staffs`);
    const staffsSnapshot = await getDocs(staffsRef);

    const staffs = staffsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Staffs retrieved successfully",
        staffs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching staff data: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve staff data: " + error },
      { status: 500 }
    );
  }
}
