import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { EnvService } from './shared/env/env.service';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { Env } from './shared/env/env';
import { ZodValidationPipe } from 'nestjs-zod';

  const configService = new ConfigService<Env, true>();
  const envService = new EnvService(configService);

  async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.useGlobalPipes(new ZodValidationPipe())
    app.useWebSocketAdapter(new IoAdapter(app)) 
    
    const config = new DocumentBuilder()
    .setTitle("Chama Delivery API")
    .setDescription("API para o sistema de pedidos de restaurante")
    .setVersion('1.0')
    .addBearerAuth()
    .build()
    
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
    
    console.log("🚀 Servidor rodando em http://localhost:3000")
    
    await app.listen(envService.get('PORT'))
  }
  bootstrap();
