export enum Role {
  ADMIN = 'ADMIN',
  MONITOR = 'MONITOR',
  CUSTOMER = 'CUSTOMER',
  CUSTOMER_DEMO = 'CUSTOMER_DEMO',
}
export type BackofficeRole = `${Role}`; // "ADMIN" | "MONITOR"
