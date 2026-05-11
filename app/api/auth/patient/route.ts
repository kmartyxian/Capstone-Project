import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ valid: false }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({
    where: { email },
  });

  return Response.json({
    valid: !!patient,
    patientId: patient?.id,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, email, phoneNumber, dateOfBirth } = body;

  if (!email || typeof email !== "string") {
    return new Response("Email is required.", { status: 400 });
  }

  const existingPatient = await prisma.patient.findUnique({
    where: { email },
  });

  if (existingPatient) {
    return new Response("Patient already exists.", { status: 400 });
  }

  const patient = await prisma.patient.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00.000Z`) : undefined,
      status: "Active",
    },
  });

  return Response.json({ patientId: patient.id, email: patient.email });
}
