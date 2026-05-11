const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const providers = await prisma.provider.findMany({ select: { id: true, name: true, username: true, location: true } });
    const patients = await prisma.patient.findMany({ select: { id: true, email: true, username: true } });
    console.log('PROVIDERS');
    console.log(JSON.stringify(providers, null, 2));
    console.log('PATIENTS');
    console.log(JSON.stringify(patients, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();