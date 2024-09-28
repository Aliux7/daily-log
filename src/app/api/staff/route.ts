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
import { deleteObject, ref } from "firebase/storage";

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

    return NextResponse.json(
      {
        success: true,
        staffData: staffDocSnap.data(),
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, staffId, profileUrl, branch, gender, name } = body;

    // Validate essential fields
    if (!businessId || !staffId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing businessId or staffId",
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (profileUrl !== null && profileUrl !== undefined) {
      updateData.profileUrl = profileUrl;
    }

    if (branch !== null && branch !== undefined) {
      updateData.branch = branch;
    }

    if (gender !== null && gender !== undefined) {
      updateData.gender = gender;
    }

    if (name !== null && name !== undefined) {
      updateData.name = name;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No data provided to update",
        },
        { status: 400 }
      );
    }

    // Reference to the staff document
    const staffDocRef = doc(
      firestore,
      `businesses/${businessId}/staffs/${staffId}`
    );

    await updateDoc(staffDocRef, updateData);

    return NextResponse.json(
      {
        success: true,
        message: "Staff profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating staff profile: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update staff profile: " + error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, staffId } = body;

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
    const profileUrl = staffData?.profileUrl;

    if (profileUrl) {
      const fileRef = ref(storage, profileUrl);

      try {
        await deleteObject(fileRef);
        console.log(`Deleted profile image: ${profileUrl}`);
      } catch (error) {
        console.error(`Error deleting profile image: ${error}`);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete profile image: " + error,
          },
          { status: 500 }
        );
      }
    }

    await deleteDoc(staffDocRef);

    return NextResponse.json(
      {
        success: true,
        message: "Staff deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting staff: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete staff: " + error },
      { status: 500 }
    );
  }
}
