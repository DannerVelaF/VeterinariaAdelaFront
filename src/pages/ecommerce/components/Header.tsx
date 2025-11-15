import { Link } from 'react-router';
import { useCartStore } from '../../../store/CartStore';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y Buscador */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <i className="pi pi-paw text-3xl text-[#fd4c82]"></i>
              <div>
                <h1 className="text-2xl font-bold text-[#fd4c82] m-0">
                  ADELA VETERINARIA
                </h1>
                <p className="text-sm text-gray-600 m-0">
                  Tu spa mascotero de confianza
                </p>
              </div>
            </Link>

            {/* Buscador */}
            <div className="hidden md:block flex-1 max-w-md">
              <IconField iconPosition="left" className="w-full">
                <InputIcon className="pi pi-search" />
                <InputText
                  placeholder="Buscar productos..."
                  className="w-full"
                />
              </IconField>
            </div>
          </div>

          {/* Carrito y Acciones */}
          <div className="flex items-center gap-4">
            {/* Botón Carrito */}
            <Link to="/carrito" className="no-underline">
              <Button
                label="Carrito"
                icon="pi pi-shopping-cart"
                className="p-button-outlined p-button-secondary relative"
              >
                {cartItemCount > 0 && (
                  <Badge
                    value={cartItemCount}
                    className="absolute -top-2 -right-2 min-w-[20px] h-5"
                    style={{ backgroundColor: '#fd4c82' }}
                  />
                )}
              </Button>
            </Link>

            {/* Botón móvil carrito */}
            <Link to="/carrito" className="md:hidden no-underline">
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-outlined p-button-secondary relative"
              >
                {cartItemCount > 0 && (
                  <Badge
                    value={cartItemCount}
                    className="absolute -top-2 -right-2 min-w-[20px] h-5"
                    style={{ backgroundColor: '#fd4c82' }}
                  />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Buscador móvil */}
        <div className="md:hidden pb-4">
          <IconField iconPosition="left" className="w-full">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Buscar productos..." className="w-full" />
          </IconField>
        </div>
      </div>
    </header>
  );
}

export default Header;
