import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase/firebaseConfig";

export async function POST(req: NextRequest) {
  try {
    await auth.signOut();
    
    return NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed: " + error },
      { status: 500 }
    );
  }
}
