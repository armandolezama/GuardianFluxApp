// src/modules/auth/infrastructure/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../domain/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'guardianflux-dev-secret', // TODO: mover a env
    });
  }

  async validate(payload: JwtPayload) {
    // Lo que retornes aquí será request.user
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
