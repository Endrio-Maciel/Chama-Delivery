import { NestApplication } from "@nestjs/core"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from "supertest"
import { AppModule } from "../src/app.module"

describe('RestaurantsController (e2e)', ()=> {
    let app: NestApplication
    let accessToken: string

    beforeAll(async ()=> {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
          }).compile();
      
          app = moduleFixture.createNestApplication();
          await app.init();

          const existingUser = await request(app.getHttpServer())
            .post('/auth/login') 
            .send({
            email: "admin@email.com",
            phone: '51 99999-9999',
            });

          if(existingUser.status !== 201) {
            await request(app.getHttpServer())
            .post('/users') 
            .send({
            name: "Admin",
            email: "admin@email.com",
            phone: '51 99999-9999',
            password: "123456",
            });
          }  
      
          const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@email.com', password: '123456' });
      
            console.log('Login response:', loginResponse.body)

          accessToken = loginResponse.body.accessToken;
            console.log('token JWT:', accessToken)

    })

    afterAll(async ()=> {
        await app.close()
    })

    it('/restaurants (POST)', async () => {
        return request(app.getHttpServer())
        .post('/restaurants')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Chama Burger',
            restaurantPhone: '51 99999-9999',
            description: 'O melhor hamburguer da cidade',
            address: 'Rua dos burgers, 71',
        })
        .expect(201)
        .expect((res) => {
            expect(res.body).toHaveProperty('id')
            expect(res.body.name).toBe('Chama Burger')
        })
    })
})