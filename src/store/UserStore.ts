import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './CartStore';

interface Usuario {
  id_usuario: number;
  usuario: string;
  estado: string;
}

interface Cliente {
  id_cliente: number;
}

interface Persona {
  id_persona: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  usuario: Usuario;
  cliente: Cliente;
}

interface AuthState {
  persona: Persona | null;
  token: string | null;
  setAuth: (persona: Persona, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      persona: null,
      token: null,
      setAuth: (persona, token) => set({ persona, token }),
      logout: () => {
        set({ persona: null, token: null });
        useCartStore.getState().clearCart();
      },
    }),
    {
      name: 'auth-storage', // nombre de la clave en localStorage
    }
  )
);
