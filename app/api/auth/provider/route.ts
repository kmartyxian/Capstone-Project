import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ valid: false }, { status: 400 });
  }

  const provider = await prisma.provider.findFirst({
    where: {
      OR: [
        { email },
        { name: email },
      ],
    },
  });

  return Response.json({ valid: !!provider });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, code } = body;

  if (code !== "1188") {
    return new Response("Invalid registration code.", { status: 400 });
  }

  if (!name || !email) {
    return new Response("Name and email are required.", { status: 400 });
  }

  const existingProvider = await prisma.provider.findFirst({
    where: { email },
  });

  if (existingProvider) {
    return new Response("Provider already exists.", { status: 400 });
  }

  const provider = await prisma.provider.create({
    data: {
      name,
      email,
      location: "",
    },
  });

  return Response.json({ providerId: provider.id, email: provider.email });
}
