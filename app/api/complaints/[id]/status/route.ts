import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sanitizeText } from "@/lib/security";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Strict server-side role check
    if (!(await isAdminAuthenticated())) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized: Administrative or Officer access required.",
        },
        {
          status: 403,
        }
      );
    }

    await connectDB();

    const { id } = await params;
    let json: any;
    try {
      json = await req.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const rawStatus = sanitizeText(json.status);
    const validStatuses = ["Pending", "Under Review", "Resolved"];

    if (!validStatuses.includes(rawStatus)) {
      return Response.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: id },
      { status: rawStatus },
      { new: true }
    );

    if (!complaint) {
      return Response.json(
        { success: false, message: "Complaint not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Complaint status update error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update status",
      },
      {
        status: 500,
      }
    );
  }
}
