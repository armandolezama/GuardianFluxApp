import {
  Body,
  Controller,
  Post,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/infrastructure/roles.decorator';
import { RolesGuard } from '../../auth/infrastructure/roles.guard';
import { CreateInvitationUseCase } from '../application/create-invitation.usecase';
import { InvalidInvitationExpirationError } from '../domain/errors';
import { Request } from 'express';
import { Role } from '../../users/domain/role.enum';

class CreateInvitationDto {
  email?: string;
  role!: Role;
  expiresAt!: string; // ISO string
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/invitations')
export class AdminInvitationsController {
  constructor(
    private readonly createInvitationUseCase: CreateInvitationUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateInvitationDto, @Req() req: Request) {
    try {
      const user = req.user as any; // si aún no hiciste augmentation Passport
      const createdByUserId = user.userId;

      if (!Object.values(Role).includes(body.role)) {
        throw new BadRequestException('Invalid role');
      }

      const result = await this.createInvitationUseCase.execute({
        email: body.email ?? null,
        role: body.role,
        expiresAt: new Date(body.expiresAt),
        createdByUserId,
      });

      return {
        invitation: result.invitation,
      };
    } catch (err) {
      if (err instanceof InvalidInvitationExpirationError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
