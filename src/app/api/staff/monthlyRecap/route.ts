import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  startAt,
  endAt,
  doc,
  getDoc,
} from "firebase/firestore";
import dayjs from "dayjs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const staffId = searchParams.get("staffId");
    const selectedMonth = searchParams.get("month");

    if (!businessId) {
      return NextResponse.json(
        { success: false, message: "Missing businessId" },
        { status: 400 }
      );
    }

    if (!staffId) {
      return NextResponse.json(
        { success: false, message: "Missing staffId" },
        { status: 400 }
      );
    }

    if (!selectedMonth) {
      return NextResponse.json(
        { success: false, message: "Missing selected month" },
        { status: 400 }
      );
    }

    const startOfMonth = dayjs(`${selectedMonth}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = dayjs(`${selectedMonth}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    const attendanceCollectionRef = collection(
      firestore,
      `businesses/${businessId}/staffs/${staffId}/attendance`
    );

    const attendanceQuery = query(
      attendanceCollectionRef,
      where("__name__", ">=", startOfMonth),
      where("__name__", "<=", endOfMonth)
    );

    const attendanceDocsSnap = await getDocs(attendanceQuery);

    const attendanceDataArray: any[] = [];
    attendanceDocsSnap.forEach((doc) => {
      attendanceDataArray.push({ date: doc.id, ...doc.data() });
    });

    const businessDocRef = doc(firestore, `businesses/${businessId}`);
    const businessDocSnap = await getDoc(businessDocRef);
    let hourlyPaidTemp = 8000;
    if (businessDocSnap.exists()) {
      const { hourlyPaid } = businessDocSnap.data();
      hourlyPaidTemp = hourlyPaid;
    }

    return NextResponse.json({
      success: true,
      data: attendanceDataArray,
      start: startOfMonth,
      end: endOfMonth,
      hourlyPaid: hourlyPaidTemp,
    });
  } catch (error: any) {
    console.error("Error in GET: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
