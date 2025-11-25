// src/contexts/AccountsContext.tsx
import {
  useEffect,
  useState,
} from 'react';
import { type ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../auth/token';
import { AccountsContext } from './AccountsContext';
import { type AccountProps } from './AccountsContext';
import { type AccountsContextValue } from './AccountsContext';


export type AccountsResponse = {
  accounts: { props: AccountProps }[];
};

type AccountsProviderProps = {
  children: ReactNode;
};

export function AccountsProvider({ children }: AccountsProviderProps) {
  const [accounts, setAccounts] = useState<AccountProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay sesión activa.');
      }

      const response = await fetch(`${API_BASE_URL}/accounts/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = 'Error al cargar las cuentas';
        try {
          const body = await response.json();
          if (body?.message) {
            message = Array.isArray(body.message)
              ? body.message.join(', ')
              : body.message;
          }
        } catch {
          /* ignore parse error */
        }
        throw new Error(message);
      }

      const json: AccountsResponse = await response.json();
      const mapped = (json.accounts || []).map((a) => a.props);
      setAccounts(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAccounts();
  }, []);

  const value: AccountsContextValue = {
    accounts,
    loading,
    error,
    refresh: fetchAccounts,
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}
