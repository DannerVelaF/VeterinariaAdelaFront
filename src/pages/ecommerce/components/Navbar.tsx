import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../../store/UserStore';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { SplitButton } from 'primereact/splitbutton';
import { Sidebar } from 'primereact/sidebar';
import { useCartStore } from '../../../store/CartStore';
import { useState } from 'react';
import { getImageUrl } from '../../../util/helpers/getImageUrl ';
import type { Producto } from '../../../util/Interfaces';
import { useCartValidation } from '../../../hooks/useCartValidation ';
import { getProductos } from '../../../service/api';

function Navbar() {
  useCartValidation();
  const user = useAuthStore((state) => state.persona);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);
  // const addToCart = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeItem);

  const [cartVisible, setCartVisible] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // 🔹 OBTENER PRODUCTOS ACTUALIZADOS AL ABRIR EL CARRITO
  const handleOpenCart = async () => {
    setCartVisible(true);
    setLoadingProducts(true);

    try {
      const productosActualizados = await getProductos();
      setProductos(productosActualizados);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 🔹 OBTENER STOCK DISPONIBLE DE UN PRODUCTO
  const getAvailableStock = (productId: number): number => {
    const producto = productos.find((p) => p.id_producto === productId);
    return producto?.stock_actual || 0;
  };

  // 🔹 MANEJAR AUMENTO DE CANTIDAD CON VALIDACIÓN DE STOCK
  const handleIncreaseQuantity = (item: any) => {
    const availableStock = getAvailableStock(item.id);
    const currentQuantity = item.quantity;

    if (currentQuantity >= availableStock) {
      // Mostrar toast de stock insuficiente
      return;
    }

    try {
      updateQuantity(item.id, currentQuantity + 1, availableStock);
    } catch (error: any) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  // 🔹 MANEJAR DISMINUCIÓN DE CANTIDAD
  const handleDecreaseQuantity = (item: any) => {
    const availableStock = getAvailableStock(item.id);
    const currentQuantity = item.quantity;

    if (currentQuantity <= 1) {
      removeFromCart(item.id);
      return;
    }

    try {
      updateQuantity(item.id, currentQuantity - 1, availableStock);
    } catch (error: any) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Productos relacionados - vacío por ahora
  // const relatedProducts: Producto[] = []; // Tipo explícito

  const hasInsufficientStock = cartItems.some((item) => {
    const availableStock = getAvailableStock(item.id);
    return item.quantity > availableStock;
  });

  // 🔹 VERIFICAR SI HAY PRODUCTOS SIN STOCK
  const hasOutOfStock = cartItems.some((item) => {
    const availableStock = getAvailableStock(item.id);
    return availableStock === 0;
  });

  const menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      url: '/',
    },
    {
      label: 'Productos',
      icon: 'pi pi-shopping-bag',
      url: '/productos',
    },
  ];

  const navigate = useNavigate();

  const userMenuItems = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        navigate('/perfil');
      },
    },
    {
      separator: true,
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => logout(),
    },
  ];

  // Calcular totales - usando las propiedades correctas del store
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.precio || 0) * item.quantity,
    0
  );
  // const shipping = 4.0;
  const tax = subtotal * 0.08; // 8% de impuesto estimado
  // const total = subtotal + shipping + tax;
  const total = subtotal + tax;
  const startContent = (
    <div className="flex items-center gap-4">
      {/* Agregar esto después del título del carrito */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <i className="pi pi-paw text-2xl text-[#fd4c82]"></i>
        <span className="text-xl font-bold text-[#fd4c82] hidden md:inline">
          ADELA VETERINARIA
        </span>
      </Link>
    </div>
  );

  const endContent = (
    <div className="flex items-center gap-3">
      {/* Carrito con icono de PrimeReact */}
      <div className="relative">
        <Button
          onClick={handleOpenCart} // 🔹 Usar la nueva función
          icon="pi pi-shopping-cart"
          text
          severity="secondary"
          className="p-2"
          tooltip="Ver carrito"
          tooltipOptions={{ position: 'bottom' }}
        />
        {cartItemCount > 0 && (
          <Badge
            value={cartItemCount}
            className="absolute -top-1 -right-1 min-w-[20px] h-5"
            style={{ backgroundColor: '#fd4c82' }}
          />
        )}
      </div>

      {/* Usuario */}
      {user ? (
        <SplitButton
          label={user.nombre + ' ' + user.apellido_paterno}
          icon="pi pi-user"
          model={userMenuItems}
          className="p-button-text"
        >
          <Avatar
            label={user.nombre.charAt(0)}
            className="mr-2"
            style={{ backgroundColor: '#fd4c82', color: '#ffffff' }}
            shape="circle"
          />
        </SplitButton>
      ) : (
        <Link to="/login">
          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            className="p-button-text"
          />
        </Link>
      )}
    </div>
  );

  // Contenido del carrito lateral
  const cartContent = (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tu Carrito</h2>
        {(hasInsufficientStock || hasOutOfStock) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <i className="pi pi-exclamation-triangle text-yellow-600"></i>
              <span className="text-yellow-800 text-sm font-medium">
                {hasOutOfStock
                  ? 'Algunos productos están agotados'
                  : 'Algunas cantidades exceden el stock disponible'}
              </span>
            </div>
            <p className="text-yellow-700 text-xs mt-1">
              Ajusta las cantidades antes de proceder con el pedido
            </p>
          </div>
        )}
        {/* Loading state */}
        {loadingProducts && (
          <div className="text-center py-4">
            <i className="pi pi-spin pi-spinner text-2xl text-[#fd4c82]"></i>
            <p className="text-gray-600 mt-2">Actualizando stock...</p>
          </div>
        )}

        {/* Productos en el carrito */}
        {cartItems.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const availableStock = getAvailableStock(item.id);
              const canIncrease = item.quantity < availableStock;
              const stockMessage =
                availableStock === 0
                  ? 'Sin stock'
                  : availableStock < 5
                  ? `Solo ${availableStock} disponibles`
                  : 'En stock';

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <img
                    src={getImageUrl(item.imagen) || '/images/placeholder.jpg'}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.nombre}</h3>

                    {/* 🔹 INDICADOR DE STOCK */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          availableStock === 0
                            ? 'bg-red-100 text-red-800'
                            : availableStock < 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {stockMessage}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">
                        S/ {Number(item.precio || 0).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          icon="pi pi-minus"
                          className="p-button-text p-button-sm"
                          onClick={() => handleDecreaseQuantity(item)}
                          disabled={item.quantity <= 1}
                        />
                        <span className="min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          icon="pi pi-plus"
                          className="p-button-text p-button-sm"
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={!canIncrease}
                          tooltip={
                            !canIncrease
                              ? `Máximo ${availableStock} unidades disponibles`
                              : 'Aumentar cantidad'
                          }
                          tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                          icon="pi pi-trash"
                          className="p-button-text p-button-sm ml-2"
                          onClick={() => removeFromCart(item.id)}
                          tooltip="Eliminar del carrito"
                          tooltipOptions={{ position: 'top' }}
                        />
                      </div>
                    </div>

                    {/* 🔹 MENSAJE DE STOCK INSUFICIENTE */}
                    {!canIncrease && availableStock > 0 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Has alcanzado el máximo disponible ({availableStock}{' '}
                        unidades)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="pi pi-shopping-cart text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Tu carrito está vacío</p>
          </div>
        )}

        {/* Resumen de compra */}
        <div className="border-t pt-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Envío</span>
              <span>S/ {shipping.toFixed(2)}</span>
            </div> */}
            <div className="flex justify-between">
              <span>Impuesto Estimado</span>
              <span>S/ {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
              <span>Total incl. IGV</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            label={
              hasInsufficientStock
                ? 'Ajustar cantidades'
                : hasOutOfStock
                ? 'Productos sin stock'
                : 'Realizar Pedido'
            }
            className="w-full mb-3"
            style={{
              backgroundColor:
                hasInsufficientStock || hasOutOfStock ? '#6b7280' : '#fd4c82',
              borderColor:
                hasInsufficientStock || hasOutOfStock ? '#6b7280' : '#fd4c82',
            }}
            disabled={
              cartItems.length === 0 || hasInsufficientStock || hasOutOfStock
            }
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              setCartVisible(false);
              navigate('/checkout'); // 🔹 Redirigir a checkout
            }}
            tooltip={
              hasInsufficientStock
                ? 'Algunos productos exceden el stock disponible'
                : hasOutOfStock
                ? 'Algunos productos están agotados'
                : cartItems.length === 0
                ? 'Agrega productos al carrito'
                : 'Proceder al checkout'
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="card sticky top-0 z-50 shadow-md">
        <Menubar
          model={menuItems}
          start={startContent}
          end={endContent}
          className="border-0 rounded-none"
          style={{
            backgroundColor: 'white',
            borderBottom: '2px solid #fd4c82',
          }}
        />
      </div>

      {/* Sidebar del carrito */}
      <Sidebar
        visible={cartVisible}
        onHide={() => setCartVisible(false)}
        position="right"
        style={{ width: '450px' }}
        className="p-sidebar-lg"
      >
        {cartContent}
      </Sidebar>
    </>
  );
}

export default Navbar;
