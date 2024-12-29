import { PrismaService } from '../src/database/prisma/prisma.service';
import { users } from './seed.config';

const prismaService = new PrismaService();

(async () => {
  for (const user of users) {
    await prismaService.user.upsert({
      where: {
        email: user.email
      },
      create: user,
      update: user
    });
  }
})();
