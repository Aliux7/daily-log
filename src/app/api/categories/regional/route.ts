import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

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

    const businessesDocRef = doc(firestore, `businesses/${businessId}`);
    const businessesDocSnap = await getDoc(businessesDocRef);

    if (!businessesDocSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        businessData: businessesDocSnap.data(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching staff data: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch staff data: " + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, value } = body;

    if (!businessId || !value) {
      return NextResponse.json(
        { success: false, message: "Missing businessId or value" },
        { status: 400 }
      );
    }

    const businessDocRef = doc(firestore, `businesses/${businessId}`);
    await updateDoc(businessDocRef, {
      regional: arrayUnion(value),
    });

    return NextResponse.json({
      success: true,
      message: "Value added to Regional array",
    });
  } catch (error) {
    console.error("Error updating Regional array:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update Regional array" },
      { status: 500 }
    );
  }
}
