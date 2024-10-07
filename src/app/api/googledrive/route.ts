import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase/firebaseConfig"; // Adjust the import if necessary
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { drive } from "@/lib/googledrive/googledriveConfig"; // Ensure this file exports a configured `drive` object

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { file, fileName, mimeType } = body; // Correctly access the `body` object

    // Prepare metadata and media for Google Drive upload
    const fileMetadata = {
      name: fileName,
      parents: ["your_drive_folder_id"], // Specify your Google Drive folder ID
    };

    const media = {
      mimeType: mimeType,
      body: Buffer.from(file, "base64"), // Convert file data from base64
    };

    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink", // Retrieve the necessary fields
    });

    // You can also store metadata in Firestore if needed
    // await setDoc(doc(firestore, "uploads", response.data.id), {
    //   fileName: fileMetadata.name,
    //   fileId: response.data.id,
    //   downloadLink: response.data.webContentLink,
    //   viewLink: response.data.webViewLink,
    //   uploadedAt: Timestamp.now(),
    // });

    // Return a successful response
    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
