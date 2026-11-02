import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { getUserSession } from "@/lib/userAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Strict server-side ownership verification:
    // Extract authenticated session from cryptographic cookie
    const session = await getUserSession();
    if (!session || !session.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please log in to view your complaints.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const userEmail = session.email.toLowerCase().trim();

    // 2. Fetch only complaints owned by this citizen from MongoDB
    const complaints = await Complaint.find({ userEmail })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Error fetching citizen complaints:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch complaints",
      },
      { status: 500 }
    );
  }
}

