import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    return NextResponse.json(
      { success: true, message: "Login successful", idToken },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Email atau Password tidak valid" },
      { status: 400 }
    );
  }
}
