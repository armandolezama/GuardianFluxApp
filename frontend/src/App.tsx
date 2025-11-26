import { Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout.tsx";

import { HomePage } from "./pages/HomePage";
import ActivateInvitationPage from "./pages/ActivateInvitationPage.tsx";
import RegisterPage from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage.tsx";
import { WithdrawForm } from "./pages/WithdrawForm.tsx";
import { RequireAuth } from "./routes/RequireAuth.tsx";
import { AccountsLayout } from "./routes/AccountsLayout.tsx";
import { DepositForm } from "./pages/DepositForm.tsx";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activate" element={<ActivateInvitationPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route element={<RequireAuth />}>
          <Route element={<AccountsLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/movements/withdraw" element={<WithdrawForm />} />
            <Route path="/movements/deposit" element={<DepositForm />} />
          </Route>
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
