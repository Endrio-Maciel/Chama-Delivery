import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './shared/env/env';
import { EnvModule } from './shared/env/env.module';
import AuthoModule from './modules/auth/auth.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { ProductsModule } from './modules/product/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    UserModule,
    EnvModule,
    AuthoModule,
    RestaurantsModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [{
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  }],
})
export class AppModule {}
