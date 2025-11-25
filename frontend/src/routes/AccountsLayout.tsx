// src/routes/AccountsLayout.tsx
import { Outlet } from "react-router-dom";
import { AccountsProvider } from "../contexts/AccountsProvider";

export function AccountsLayout() {
  return (
    <AccountsProvider>
      <Outlet />
    </AccountsProvider>
  );
}
