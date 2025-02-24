import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './shared/env/env';
import { EnvModule } from './shared/env/env.module';
import AuthoModule from './modules/auth/auth.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    UserModule,
    EnvModule,
    AuthoModule,
    RestaurantsModule
  ]
})
export class AppModule {}
