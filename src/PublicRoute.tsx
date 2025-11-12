// PublicRoute.tsx
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from './store/UserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useLocation } from 'react-router';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          className="w-16 h-16 border-4 border-t-[#fd4c82] border-gray-300 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  // Si ya está autenticado, redirigir al inicio
  if (token) {
    const from = location.state?.from?.pathname || '/inicio';
    return <Navigate to={from} replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="public-page"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PublicRoute;
