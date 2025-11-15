// components/Layout.tsx
import { useLocation } from 'react-router';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // Rutas donde no queremos mostrar el Navbar
  const hideNavbarRoutes = ['/login', '/register', '/recuperar-contrasena'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {shouldShowNavbar && <Navbar />}
      <main className={shouldShowNavbar ? '' : ''}>{children}</main>
    </div>
  );
}

export default Layout;
