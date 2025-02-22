import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import AuthoModule from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    UserModule,
    EnvModule,
    AuthoModule,
  ]
})
export class AppModule {}
