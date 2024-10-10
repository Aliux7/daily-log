import { NextRequest, NextResponse } from "next/server";
import { auth, firestore } from "@/lib/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

async function createFirestoreDoc(
  collectionPath: string,
  docId: string,
  data: object
) {
  const docRef = doc(firestore, collectionPath, docId);
  await setDoc(docRef, data);
}

async function createUserCredentialAndStoreData(
  companyId: string,
  role: string,
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = credential.user;
  const userData = {
    email,
    role,
  };

  await createFirestoreDoc(
    `businesses/${companyId}/accounts`,
    user.uid,
    userData
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    company,
    emailOwner,
    passwordOwner,
    emailAdmin,
    passwordAdmin,
    phone,
  } = body;

  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0");
  const day = String(todayDate.getDate()).padStart(2, "0");
  const companyId = `${company}-${year}${month}${day}`;

  try {
    const companyData = {
      name: company,
      phone: phone,
      hourlyPaid: 8000,
      active: todayDate,
    };

    await createFirestoreDoc("businesses", companyId, companyData);
    await createUserCredentialAndStoreData(
      companyId,
      "Owner",
      emailOwner,
      passwordOwner
    );
    await createUserCredentialAndStoreData(
      companyId,
      "Admin",
      emailAdmin,
      passwordAdmin
    );

    return NextResponse.json(
      { success: true, message: "Company registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 400 }
    );
  }
}
