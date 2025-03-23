import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient, Role } from '@prisma/client';

interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  restaurantId: string;
}

describe('ProductsController (e2e)', () => {
  let app: NestApplication;
  let accessToken: string;
  let restaurantId: string;
  let productId: string;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();
      
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await prisma.user.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.product.deleteMany();

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Endrio',
        email: 'endrio@email.com',
        phone: '51 99999-9999',
        password: '123456',
        role: Role.ADMIN
      });

    expect(userResponse.status).toBe(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'endrio@email.com', password: '123456' });

    accessToken = loginResponse.body.access_token;
    expect(loginResponse.status).toBe(201);

    const restaurantResponse = await request(app.getHttpServer())
      .post('/restaurants')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Chama Burger', description: 'Melhor hamburgueria', address: 'Rua X, 123' });

    restaurantId = restaurantResponse.body.id;
    expect(restaurantResponse.status).toBe(201);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/restaurants/:restaurantId/products (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/restaurants/${restaurantId}/products`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hamburguer Clássico',
        price: 25.99,
        description: 'Delicioso hambúrguer artesanal',
      });

    productId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Hamburguer Clássico');
  });

  it('/restaurants/:restaurantId/products (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/restaurants/${restaurantId}/products`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
