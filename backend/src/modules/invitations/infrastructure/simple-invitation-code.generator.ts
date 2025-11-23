export class SimpleInvitationCodeGenerator {
  generate(): string {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `INV-${rand}`;
  }
}
