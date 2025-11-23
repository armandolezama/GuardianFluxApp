export enum Role {
  ADMIN = 'ADMIN',
  MONITOR = 'MONITOR',
}
export type BackofficeRole = `${Role}`; // "ADMIN" | "MONITOR"
