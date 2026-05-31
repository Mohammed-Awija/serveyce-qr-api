import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demoHotel = await prisma.hotel.upsert({
    where: { slug: 'demo-hotel' },
    update: {},
    create: {
      slug: 'demo-hotel',
      name: 'Demo Hotel Istanbul',
      address: 'Istiklal Caddesi 1, Beyoğlu, Istanbul',
      timezone: 'Europe/Istanbul',
    },
  });

  console.log('Seeded:', demoHotel);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });