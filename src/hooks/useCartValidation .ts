// hooks/useCartValidation.ts
import { useEffect } from 'react';
import { useCartStore } from '../store/CartStore';
import { useAuthStore } from '../store/UserStore';

export const useCartValidation = () => {
  const { clearExpiredCart, setUserId, isValidCart, clearCart } =
    useCartStore();
  const user = useAuthStore((state) => state.persona);

  useEffect(() => {
    if (!user) {
      // 🔹 Si no hay usuario, limpiar carrito
      clearCart();
      return;
    }

    // 🔹 Establecer usuario actual
    setUserId(user.id_persona);

    // 🔹 Validar carrito al cargar la aplicación
    const isCartValid = isValidCart(user.id_persona);

    if (!isCartValid) {
      console.log('Carrito inválido - limpiando...');
      clearCart();
    }

    // 🔹 Verificar expiración cada vez que se accede al carrito
    const wasExpired = clearExpiredCart();
    if (wasExpired) {
      console.log('Carrito expirado - limpiado automáticamente');
    }
  }, [user, setUserId, isValidCart, clearExpiredCart, clearCart]);

  return {
    isCartValid: user ? isValidCart(user.id_persona) : false,
  };
};
