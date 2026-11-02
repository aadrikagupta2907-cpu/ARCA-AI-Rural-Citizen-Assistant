import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getUserSession } from "@/lib/userAuth";
import { sanitizeText } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();

    let json: any;
    try {
      json = await req.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid request payload" },
        { status: 400 }
      );
    }

    const authority = sanitizeText(json.authority) || "General Administration";
    const subject = sanitizeText(json.subject);
    const body = sanitizeText(json.body);
    const userInput = sanitizeText(json.userInput);

    if (!subject || !body) {
      return Response.json(
        { success: false, message: "Subject and complaint description are required." },
        { status: 400 }
      );
    }

    let priority = "Medium";
    let category = "General";
    let estimatedResolution = "3-5 Days";

    const text = `${subject} ${body} ${userInput}`.toLowerCase();

    // High Priority
    if (
      text.includes("fire") ||
      text.includes("gas leak") ||
      text.includes("accident") ||
      text.includes("hospital") ||
      text.includes("crime") ||
      text.includes("danger")
    ) {
      priority = "High";
      estimatedResolution = "24 Hours";
    }
    // Low Priority
    else if (
      text.includes("suggestion") ||
      text.includes("feedback") ||
      text.includes("request")
    ) {
      priority = "Low";
      estimatedResolution = "7 Days";
    }

    // Category Detection
    if (text.includes("water")) {
      category = "Water Supply";
    } else if (text.includes("electricity")) {
      category = "Electricity";
    } else if (text.includes("road") || text.includes("pothole")) {
      category = "Road Infrastructure";
    } else if (text.includes("garbage") || text.includes("waste")) {
      category = "Sanitation";
    } else if (text.includes("hospital")) {
      category = "Healthcare";
    } else if (text.includes("police") || text.includes("crime")) {
      category = "Public Safety";
    }

    // Associate complaint with logged-in citizen if authenticated
    const session = await getUserSession();
    const userEmail = session?.email
      ? session.email.toLowerCase().trim()
      : (typeof json.userEmail === "string" && json.userEmail.trim()
          ? json.userEmail.toLowerCase().trim()
          : undefined);

    const complaint = await Complaint.create({
      complaintId: `CMP-${Date.now()}`,
      userEmail,
      authority,
      subject,
      body,
      userInput: userInput || subject,
      status: "Pending",
      priority,
      category,
      estimatedResolution,
    });

    return Response.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Complaint creation error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to save complaint",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    // Strict server-side verification: Only admin and officer accounts can retrieve all complaints
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

    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Fetch complaints error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch complaints",
      },
      {
        status: 500,
      }
    );
  }
}
