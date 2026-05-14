import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { role, email, username } = await request.json();

    if (!role || !email || !username) {
      return Response.json({ error: "Role, email, and username are required" }, { status: 400 });
    }

    if (!["provider", "patient"].includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check uniqueness within the respective table
    let existingRecord = null;
    if (role === "provider") {
      existingRecord = await prisma.provider.findFirst({
        where: { name: email },
      });
    } else {
      existingRecord = await prisma.patient.findFirst({
        where: { email },
      });
    }

    if (existingRecord) {
      return Response.json({ error: "Email or username already exists" }, { status: 400 });
    }

    if (role === "provider") {
      await prisma.provider.create({
        data: {
          name: email,
          location: "Default",
        },
      });
    } else {
      await prisma.patient.create({
        data: {
          email,
          // Other fields set to null
        },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
