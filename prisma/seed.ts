import { PrismaService } from '../src/database/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prismaService = new PrismaService();

(async () => {
  const users = [
    {
      firstName: 'wsi',
      lastName: 'wsi',
      email: 'wsi.admin@wsi.com',
      password: await bcrypt.hash('vFx5fjDQoX@2&8cX', 10),
      role: Role.ADMIN
    },
    {
      firstName: 'wsi',
      lastName: 'wsi',
      email: 'wsi.user@wsi.com',
      password: await bcrypt.hash('Jz4fvB@T$2GVbX48xY', 10),
      role: Role.USER
    },
    {
      firstName: 'wsi',
      lastName: 'wsi',
      email: 'wsi.manager@wsi.com',
      password: await bcrypt.hash('WJ4B@T$ghsg24TRY', 10),
      role: Role.MANAGER
    }
  ];

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
