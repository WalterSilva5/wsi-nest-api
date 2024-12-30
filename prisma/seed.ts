import { PrismaService } from '../src/database/prisma/prisma.service';
import { users } from './user-seed.config';

const prismaService = new PrismaService();

(async () => {
  for (const user of await users) {
    console.log(`Creating user ${user.email}`);
    await prismaService.user.upsert({
      where: {
        email: user.email
      },
      create: user,
      update: user
    });
  }
})();
