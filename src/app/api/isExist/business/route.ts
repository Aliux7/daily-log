import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { success: false, message: "Name parameter is required" },
      { status: 400 }
    );
  }

  try {
    const q = query(
      collection(firestore, "businesses"),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    const isNameExist = querySnapshot.size > 0;

    return NextResponse.json(
      { success: true, exists: isNameExist },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking business name:", error);
    return NextResponse.json(
      { success: false, message: "Error checking business name" },
      { status: 500 }
    );
  }
}
