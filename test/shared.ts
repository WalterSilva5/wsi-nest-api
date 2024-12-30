import { RegisterDto } from 'src/cruds/auth/dto/register.dto';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const getUserMock = (): RegisterDto => {
  return {
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
  };
};


export const createUser = async (): Promise<[User, RegisterDto]> => {
  const userMock = getUserMock();

  const prisma = new PrismaClient();
  const user = await prisma.user.create({
    data: {
      password: await bcrypt.hash(userMock.password, 10),
      firstName: userMock.firstName,
      lastName: userMock.lastName,
      email: userMock.email
    }
  });

  return [user, userMock];
};

