import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InvitationPort } from '../application/ports/invitation.port';
import { CreateInvitationCommand, Invitation } from '../domain/invitation.model';
import { InvitationDto } from './invitation.dto';
import { InvitationMapper } from './invitation.mapper';

@Injectable()
export class InvitationApiAdapter implements InvitationPort {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000'; // luego a environment

  async create(cmd: CreateInvitationCommand): Promise<Invitation> {
    const dto = await firstValueFrom(
      this.http.post<InvitationDto>(`${this.baseUrl}/admin/invitations`, cmd)
    );
    return InvitationMapper.toDomain(dto);
  }

  async list(): Promise<Invitation[]> {
    const dtos = await firstValueFrom(
      this.http.get<InvitationDto[]>(`${this.baseUrl}/admin/invitations`)
    );
    return InvitationMapper.toDomainList(dtos);
  }
}
