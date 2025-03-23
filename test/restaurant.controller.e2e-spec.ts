import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaClient, Role } from '@prisma/client';

describe('RestaurantsController (e2e)', () => {
  let app: NestApplication;
  let accessToken: string;
  let restaurantId: string;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await prisma.user.deleteMany();
    await prisma.restaurant.deleteMany();

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: "Admin",
        email: "admin@email.com",
        phone: '51 99999-9999',
        password: "123456",
        role: Role.ADMIN 
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@email.com', password: '123456' });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/restaurants (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/restaurants')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Chama Burger',
        restaurantPhone: '51 99999-9999',
        description: 'Melhor hamburgueria',
        address: 'Rua X, 123'
      });

    restaurantId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Chama Burger');
  });
});
