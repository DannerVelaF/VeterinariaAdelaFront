// PublicRoute.tsx
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from './store/UserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        // si ya hay token, redirige al inicio
        navigate('/inicio', { replace: true });
      } else {
        setLoading(false);
      }
    }, 600); // loader corto
    return () => clearTimeout(timer);
  }, [token, navigate]);

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
