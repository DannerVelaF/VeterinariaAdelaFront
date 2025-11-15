import { useLocation } from 'react-router';
import Layout from './Layout';

interface LayoutRouteProps {
  children: React.ReactNode;
}

function LayoutRoute({ children }: LayoutRouteProps) {
  const location = useLocation();

  // Rutas donde no queremos mostrar el Layout (con Navbar)
  const noLayoutRoutes = [
    '/login',
    '/registro',
    '/olvideMiContrasena',
    '/reset-password',
    '/',
  ];
  const shouldShowLayout = !noLayoutRoutes.includes(location.pathname);

  return shouldShowLayout ? <Layout>{children}</Layout> : <>{children}</>;
}

export default LayoutRoute;
