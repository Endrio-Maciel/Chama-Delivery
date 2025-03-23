import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


describe('AuthController (e2e)', () => {
  let app: NestApplication;
  let prisma: PrismaService;
  let userId: string;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
    await prisma.user.deleteMany(); 
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/auth/login (POST) - Deve fazer login e gerar tokens', async () => {

    const hashedPassword = await bcrypt.hash('123456', 10);   

    const user = await prisma.user.create({
      data: {
        name: 'Endrio',
        email: 'endrio@email.com',
        phone: '51 99999-9999',
        password: hashedPassword,
        role: 'CLIENT',
      },
    });

    userId = user.id;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'endrio@email.com',
        password: '123456', 
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });


  it('/auth/refresh (POST) - Deve gerar um novo accessToken usando o refreshToken', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        userId,
        refreshToken,
      });
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken; 
  });
  

  it('/auth/refresh (POST) - Deve falhar com refreshToken inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        userId,
        refreshToken: 'token-invalido',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token de refresh inválido ou expirado');
  });
});
