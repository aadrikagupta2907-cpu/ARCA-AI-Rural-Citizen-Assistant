import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { sanitizeText } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const cleanId = sanitizeText(id);

    if (!cleanId) {
      return Response.json(
        { success: false, message: "Complaint ID is required" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findOne({
      complaintId: cleanId,
    });

    if (!complaint) {
      return Response.json(
        {
          success: false,
          message: "Complaint not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Fetch complaint by ID error:", error);

    return Response.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
