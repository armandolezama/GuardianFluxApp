import { Route, Routes } from 'react-router-dom';

import AppLayout from './componentes/layout/AppLayout.tsx';

import { HomePage } from './pages/HomePage';
import  ActivateInvitationPage  from './pages/ActivateInvitationPage.tsx';
import  RegisterPage  from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage.tsx';
import { RequireAuth } from './routes/RequireAuth.tsx';

function App() {
  return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activate" element={<ActivateInvitationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AppLayout>
  );
}

export default App;