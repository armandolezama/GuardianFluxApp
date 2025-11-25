// src/routes/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../auth/token';

export function RequireAuth() {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // opcional, por si luego quieres volver
      />
    );
  }

  return <Outlet />;
}
