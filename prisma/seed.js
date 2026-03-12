import { prisma } from "../config/db.js";
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@primefleet.com' },
    update: {},
    create: {
      email: 'admin@primefleet.com',
      password: hashedPassword,
      fullName: 'System Admin',
      role: 'SUPER_ADMIN', // Matches your Role enum
    },
  });

  console.log('✅ Seed successful: admin@primefleet.com created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());


