// backend/src/scripts/seed-invitations.ts

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import { InvitationRepository } from '../modules/invitations/domain/invitation.repository';
import { Invitation } from '../modules/invitations/domain/invitation.entity';
import { InvitationStatus } from '../modules/invitations/domain/invitation-status.enum';
import { Role } from '../modules/users/domain/role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const invitationRepo = app.get<InvitationRepository>('InvitationRepository');

    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

    const seeds = [
      {
        id: 'inv-1',
        code: 'INV-USER1',
        email: 'admin-1@example.com',
        role: Role.ADMIN,
      },
      {
        id: 'inv-2',
        code: 'INV-USER2',
        email: 'costumer-1@example.com',
        role: Role.CUSTOMER,
      },
      {
        id: 'inv-3',
        code: 'INV-USER3',
        email: 'monitor-1@example.com',
        role: Role.MONITOR,
      },
    ] as const;

    await Promise.all(
      seeds.map(async (seed) => {
        const existing = await invitationRepo.findByCode(seed.code);
        if (existing) {
          console.log(`Invitation ${seed.code} ya existe, se omite.`);
          return;
        }

        const invitation = new Invitation({
          id: seed.id,
          code: seed.code,
          email: seed.email,
          role: seed.role,
          status: InvitationStatus.PENDING,
          expiresAt: future,
          usedAt: null,
          createdByUserId: 'admin-1',
          createdAt: now,
        });

        await invitationRepo.save(invitation);
        console.log(`Invitation ${seed.code} creada.`);
      }),
    );

    console.log('Seed de invitaciones completado.');
  } catch (err) {
    console.error('Error al hacer seed de invitaciones:', err);
  } finally {
    await app.close();
  }
}

bootstrap();
