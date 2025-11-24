export type InvitationDto = {
  id: string;
  email: string;
  role: string;
  status?: string;
  code: string;

  // soporta camel o snake
  expiresAt?: string;
  expires_at?: string;

  createdAt?: string;
  created_at?: string;
};
