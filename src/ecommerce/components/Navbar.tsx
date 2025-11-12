import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../store/UserStore';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { SplitButton } from 'primereact/splitbutton';
import { Sidebar } from 'primereact/sidebar';
import { useCartStore } from '../../store/CartStore';
import { useState } from 'react';
import { getImageUrl } from '../../util/helpers/getImageUrl ';
import type { Producto } from '../../util/Interfaces';

function Navbar() {
  const user = useAuthStore((state) => state.persona);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeItem);
  // const location = useLocation();

  const [cartVisible, setCartVisible] = useState(false);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Productos relacionados - vacío por ahora
  const relatedProducts: Producto[] = []; // Tipo explícito

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
  const shipping = 4.0;
  const tax = subtotal * 0.08; // 8% de impuesto estimado
  const total = subtotal + shipping + tax;

  const startContent = (
    <div className="flex items-center gap-4">
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
          onClick={() => setCartVisible(true)}
          icon="pi pi-shopping-cart"
          text
          severity="secondary"
          className="p-2"
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

        {/* Productos en el carrito */}
        {cartItems.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
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
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">
                      S/ {Number(item.precio || 0).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        icon="pi pi-minus"
                        className="p-button-text p-button-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      />
                      <span>{item.quantity}</span>
                      <Button
                        icon="pi pi-plus"
                        className="p-button-text p-button-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-text p-button-sm ml-2"
                        onClick={() => removeFromCart(item.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
              <span>s/{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>s/{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto Estimado</span>
              <span>s/{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
              <span>Total incl. IVA</span>
              <span>s/{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            label="Realizar Pedido"
            className="w-full mb-3"
            style={{ backgroundColor: '#fd4c82', borderColor: '#fd4c82' }}
            disabled={cartItems.length === 0}
          />
          <Button
            label="Agregar Cupón"
            className="w-full p-button-outlined"
            style={{ color: '#fd4c82', borderColor: '#fd4c82' }}
          />
        </div>

        {/* Productos relacionados - Vacío por ahora */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold mb-4">Productos Relacionados</h3>
            <div className="space-y-4">
              {relatedProducts.map((product) => (
                <div
                  key={product.id_producto}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <img
                    src={getImageUrl(product.ruta_imagen)}
                    alt={product.nombre_producto}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.nombre_producto}</h4>
                    <p className="text-sm text-gray-600">
                      {product.descripcion}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">
                        S/ {Number(product.precio_unitario ?? 0).toFixed(2)}
                      </span>
                      <Button
                        icon="pi pi-plus"
                        className="p-button-text p-button-sm"
                        onClick={() =>
                          addToCart({
                            id: product.id_producto,
                            nombre: product.nombre_producto,
                            precio: Number(product.precio_unitario),
                            imagen:
                              product.ruta_imagen || '/placeholder-product.jpg',
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
