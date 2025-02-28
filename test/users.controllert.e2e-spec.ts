import { NestApplication } from "@nestjs/core"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from "supertest"
import { AppModule } from "../src/app.module"

interface UserResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    password?: string; 
  }

describe('UsersController (e2e)', ()=> {
    let app: NestApplication
    let accessToken: string
    let userId: string 
    let userEmail: string

    beforeAll(async ()=> {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
          }).compile();
      
          app = moduleFixture.createNestApplication();
          await app.init();

         const userResponse = await request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'John doe',
            email: 'johndoe@johndoe.com',
            phone: '51 9997159897',
            password: '123456',
          })

          const user: UserResponse = userResponse.body

          userId = user.id
          userEmail = user.email

          expect(userResponse.status).toBe(201)

          const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'endrio@endrio.com', password: '123456' })

         accessToken = loginResponse.body.accessToken;
         expect(loginResponse.status).toBe(201);
    })

    afterAll(async ()=> {
        await app.close()
    })

    it('/users/:email (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${userEmail}`)
            .set('Authorization', `Bearer ${accessToken}` )
            .expect(200)

        const user: UserResponse = response.body
        expect(user.email).toBe('johndoe@johndoe.com')    
    })
    it('/users (PATCH) - Deve atualizar um usuário', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/users/${userId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'Novo Nome' })
          .expect(200);
    
        const updatedUser: UserResponse = response.body;
        expect(updatedUser.name).toBe('Novo Nome');
      });
    
      it('/users (DELETE) - Deve deletar um usuário', async () => {
        await request(app.getHttpServer())
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
      });
})