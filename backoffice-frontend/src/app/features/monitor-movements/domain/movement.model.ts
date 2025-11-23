export type MovementId = string;

export interface Movement {
  id: MovementId;
  amount: number;
  currency: 'MXN' | 'USD' | string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  createdAt: string; // ISO
  // campos “monitor-safe” (sin PII)
  customerMasked?: string; // ej: "AR****23"
}
