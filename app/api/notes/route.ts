import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");

  if (!patientId) {
    return Response.json({ error: "patientId required" }, { status: 400 });
  }

  const notes = await prisma.note.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(notes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { patientId, content } = body;

  if (!patientId || !content) {
    return Response.json({ error: "patientId and content required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      patientId,
      content,
    },
  });

  return Response.json(note);
}