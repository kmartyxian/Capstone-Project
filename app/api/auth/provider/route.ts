import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ valid: false }, { status: 400 });
  }

  const provider = await prisma.provider.findFirst({
    where: { name: email },
  });

  return Response.json({ valid: !!provider });
}