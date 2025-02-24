import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from 'src/shared/env/env.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly envService: EnvService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envService.get('JWT_REFRESH_SECRET') || 'refresh_secret',
      passReqToCallback: true,
    });
  }

  async validate(req, payload: { sub: string }) {
    return { userId: payload.sub };
  }
}
