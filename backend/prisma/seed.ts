import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.currency.count();
    if (count > 0) {
      console.log('Currency already seeded, skipping.');
      return;
    }
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === 'P2021') {
      console.error('Currency table does not exist. Run: npx prisma migrate deploy');
      process.exit(1);
    }
    throw e;
  }
  await prisma.currency.create({
    data: {
      symbol: 'USDT',
      name: 'Tether',
      network: 'ERC20',
    },
  });
  console.log('Seeded Currency: USDT (required for registration)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
