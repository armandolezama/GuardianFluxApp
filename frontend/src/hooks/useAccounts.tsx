import { useContext } from 'react';
import { AccountsContext } from '../contexts/AccountsContext';

export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) {
    throw new Error('useAccounts debe usarse dentro de AccountsProvider');
  }
  return ctx;
}
