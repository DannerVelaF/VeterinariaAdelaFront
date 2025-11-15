// store/CartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  userId: number | null;
  lastUpdated: string;
  addItem: (
    product: Omit<CartItem, 'quantity'>,
    availableStock: number,
    userId: number
  ) => void;
  removeItem: (id: number) => void;
  updateQuantity: (
    id: number,
    quantity: number,
    availableStock: number
  ) => void;
  // 🔹 NUEVAS FUNCIONES
  increaseQuantity: (id: number, availableStock: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  canAddItem: (
    productId: number,
    requestedQuantity: number,
    availableStock: number
  ) => boolean;
  setUserId: (userId: number) => void;
  clearExpiredCart: () => void;
  isValidCart: (currentUserId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      lastUpdated: new Date().toISOString(),

      addItem: (product, availableStock, userId) => {
        const { items, canAddItem, isValidCart } = get();

        if (!isValidCart(userId)) {
          set({ items: [], userId, lastUpdated: new Date().toISOString() });
        }

        const currentQuantity =
          items.find((item) => item.id === product.id)?.quantity || 0;
        const newQuantity = currentQuantity + 1;

        if (!canAddItem(product.id, newQuantity, availableStock)) {
          throw new Error(
            `No se puede agregar. Stock disponible: ${availableStock}`
          );
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          const newItems = existingItem
            ? state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.items, { ...product, quantity: 1 }];

          return {
            items: newItems,
            lastUpdated: new Date().toISOString(),
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          lastUpdated: new Date().toISOString(),
        }));
      },

      updateQuantity: (id, quantity, availableStock) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const { canAddItem } = get();
        if (!canAddItem(id, quantity, availableStock)) {
          throw new Error(
            `No se puede actualizar. Stock disponible: ${availableStock}`
          );
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
          lastUpdated: new Date().toISOString(),
        }));
      },

      // 🔹 NUEVA FUNCIÓN: Aumentar cantidad en 1
      increaseQuantity: (id, availableStock) => {
        const { items, updateQuantity } = get();
        const item = items.find((item) => item.id === id);

        if (item) {
          updateQuantity(id, item.quantity + 1, availableStock);
        }
      },

      // 🔹 NUEVA FUNCIÓN: Disminuir cantidad en 1
      decreaseQuantity: (id) => {
        const { items, updateQuantity } = get();
        const item = items.find((item) => item.id === id);

        if (item) {
          if (item.quantity <= 1) {
            get().removeItem(id);
          } else {
            // Para disminuir no necesitamos validar stock
            updateQuantity(id, item.quantity - 1, item.quantity - 1);
          }
        }
      },

      clearCart: () => {
        set({
          items: [],
          lastUpdated: new Date().toISOString(),
        });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      canAddItem: (productId, requestedQuantity, availableStock) => {
        const { items } = get();
        return requestedQuantity <= availableStock;
      },

      setUserId: (userId) => {
        set({ userId, lastUpdated: new Date().toISOString() });
      },

      clearExpiredCart: () => {
        const { lastUpdated } = get();
        const now = new Date();
        const lastUpdate = new Date(lastUpdated);
        const hoursDiff =
          (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
          set({ items: [], lastUpdated: new Date().toISOString() });
          return true;
        }
        return false;
      },

      isValidCart: (currentUserId) => {
        const { userId, lastUpdated } = get();
        const now = new Date();
        const lastUpdate = new Date(lastUpdated);
        const hoursDiff =
          (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

        if (userId !== currentUserId || hoursDiff > 24) {
          return false;
        }

        return true;
      },
    }),
    {
      name: 'cart-storage',
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            userId: null,
            lastUpdated: new Date().toISOString(),
          };
        }
        return persistedState;
      },
      version: 1,
    }
  )
);
