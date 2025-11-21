import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import AppLayout from './componentes/layout/AppLayout';

import { HomePage } from './pages/HomePage';
import { ActivateInvitationPage } from './pages/ActivateInvitationPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MonitorPage } from './pages/MonitorPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activate" element={<ActivateInvitationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
      </AppLayout>
    </Box>
  );
}

export default App;