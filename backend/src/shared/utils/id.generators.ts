// backend/src/shared/utils/id.generators.ts
import { randomUUID } from 'crypto';

export class UuidIdGenerator {
  constructor(private readonly prefix?: string) {}

  nextId(): string {
    const id = randomUUID();
    return this.prefix ? `${this.prefix}-${id}` : id;
  }
}
