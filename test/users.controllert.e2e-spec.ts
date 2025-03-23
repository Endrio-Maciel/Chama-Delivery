import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { Role } from '@prisma/client';

interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

describe('UsersController (e2e)', () => {
  let app: NestApplication;
  let accessToken: string;
  let userId: string;
  let userEmail: string;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Endrio',
        email: 'endrio@email.com',
        phone: '51 99999-9999',
        password: '123456',
        role: Role.ADMIN
      });

     const user: UserResponse = userResponse.body
     userId = user.id
     userEmail = user.email
     
     expect(userResponse.status).toBe(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'endrio@email.com', password: '123456' });

    accessToken = loginResponse.body.access_token;
    expect(loginResponse.status).toBe(201);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/users/:email (GET)', () => {
    
    it('Deve buscar um usuário pelo email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userEmail}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const user: UserResponse = response.body;
      expect(user.email).toBe('johndoe@email.com');
    });
  
    it('Deve retornar erro ao buscar um usuário inexistente', async () => {
      await request(app.getHttpServer())
        .get('/users/inexistente@email.com')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  })

  describe('/users/:id (PATCH)', () => {
    it('Deve atualizar um usuário', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Novo Nome' })
        .expect(200);

      const updatedUser: UserResponse = response.body;
      expect(updatedUser.name).toBe('Novo Nome');
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('Deve deletar um usuário', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(deletedUser).toBeNull();
    });
  });
});
