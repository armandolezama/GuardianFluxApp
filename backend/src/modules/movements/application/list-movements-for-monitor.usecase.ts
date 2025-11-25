import { Injectable, Inject } from '@nestjs/common';
import { MovementRepository } from '../domain/movement.repository';

export type MonitorMovementDto = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  originAccountId: string | null;
  destinationAccountId: string | null;
  createdAt: Date;
};

export class ListMovementsForMonitorUseCase {
  constructor(
    private readonly movementRepo: MovementRepository,
  ) {}

  async execute(): Promise<MonitorMovementDto[]> {
    const movements = await this.movementRepo.findAll();

    return movements.map((m) => ({
      id: m.id,
      type: m.type,
      amount: m.amount,
      currency: m.currency,
      originAccountId: m.relatedMovementId ?? null,
      destinationAccountId: m.counterpartyAccountId ?? null,
      createdAt: m.createdAt,
    }));
  }
}