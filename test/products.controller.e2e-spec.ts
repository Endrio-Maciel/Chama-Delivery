import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Endrio',
        email: 'endrio@email.com',
        phone: '51 99999-9999',
        password: '123456',
      });

    expect(userResponse.status).toBe(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'endrio@email.com', password: '123456' });

    accessToken = loginResponse.body.accessToken;
    expect(loginResponse.status).toBe(201);

    const restaurantResponse = await request(app.getHttpServer())
      .post('/restaurants')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Chama Burger', description: 'Melhor hamburgueria' });

    restaurantId = restaurantResponse.body.id;
    expect(restaurantResponse.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/restaurants/:restaurantId/products (POST) - Deve criar um produto', async () => {
    const response = await request(app.getHttpServer())
      .post(`/restaurants/${restaurantId}/products`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hamburguer Clássico',
        price: 25.99,
        description: 'Delicioso hambúrguer artesanal',
        imageUrl: 'http://example.com/hamburguer.png',
      });

    const product: ProductResponse = response.body;
    productId = product.id;

    expect(response.status).toBe(201);
    expect(product.name).toBe('Hamburguer Clássico');
  });

  it('/restaurants/:restaurantId/products (GET) - Deve listar os produtos', async () => {
    const response = await request(app.getHttpServer())
      .get(`/restaurants/${restaurantId}/products`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('/restaurants/:restaurantId/products/:id (GET) - Deve buscar um produto pelo ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/restaurants/${restaurantId}/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  it('/restaurants/:restaurantId/products/:id (PATCH) - Deve atualizar um produto', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/restaurants/${restaurantId}/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Hamburguer Especial' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Hamburguer Especial');
  });

  it('/restaurants/:restaurantId/products/:id (DELETE) - Deve deletar um produto', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/restaurants/${restaurantId}/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });
});
