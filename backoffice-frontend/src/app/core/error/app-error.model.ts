export type AppError = {
  status: number;
  code?: string;
  message: string;
  details?: any;
  url?: string;
};
