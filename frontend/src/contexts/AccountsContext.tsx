import { createContext } from "react";

export type AccountProps = {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  createdAt: string;
};


export type AccountsContextValue = {
  accounts: AccountProps[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const AccountsContext = createContext<AccountsContextValue | undefined>(
  undefined,
);