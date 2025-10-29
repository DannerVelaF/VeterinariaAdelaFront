import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useCartStore } from '../../store/CartStore';
import { useAuthStore } from '../../store/UserStore';
import { getCategorias, getProductos } from '../../service/api';
import type { Categoria, Producto } from '../../util/Interfaces';
import { getImageUrl } from '../../util/helpers/getImageUrl ';

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(
    searchParams.get('categoria')
      ? parseInt(searchParams.get('categoria')!)
      : null
  );

  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.persona);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    // 🔹 VERIFICAR AUTENTICACIÓN
    if (!user) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Autenticación requerida',
        detail: 'Debes iniciar sesión para ver los productos',
        life: 3000,
      });
      navigate('/login');
      return;
    }

    loadData();
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      filterProductos();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategoria, user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error: any) {
      console.error('Error loading data:', error);

      if (error.response?.status === 401) {
        toast.current?.show({
          severity: 'error',
          summary: 'Sesión expirada',
          detail: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
          life: 4000,
        });
        navigate('/login');
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos',
          life: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProductos = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategoria)
        params.set('categoria', selectedCategoria.toString());
      setSearchParams(params);

      const filters = {
        search: searchTerm || undefined,
        categoria_id: selectedCategoria || undefined,
      };

      const filteredProductos = await getProductos(filters);
      setProductos(filteredProductos);
    } catch (error: any) {
      console.error('Error filtering productos:', error);

      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto: Producto) => {
    if (!user) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Inicia sesión',
        detail: 'Debes iniciar sesión para agregar productos al carrito',
        life: 3000,
      });
      navigate('/login');
      return;
    }

    addItem({
      id: producto.id_producto,
      nombre: producto.nombre_producto,
      precio: parseFloat(producto.precio_unitario), // ⚠️ Convertir string a number
      imagen: producto.ruta_imagen || '/placeholder-product.jpg',
      quantity: 1,
    });

    toast.current?.show({
      severity: 'success',
      summary: '¡Agregado!',
      detail: `${producto.nombre_producto} agregado al carrito`,
      life: 2000,
    });
  };

  const categoriaOptions = [
    { label: 'Todas las categorías', value: null },
    ...categorias.map((cat) => ({
      label: cat.nombre_categoria_producto,
      value: cat.id_categoria_producto,
    })),
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategoria(null);
    setSearchParams({});
  };

  const getStockSeverity = (stock: number) => {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return 'Sin stock';
    if (stock < 10) return 'Poco stock';
    return 'En stock';
  };

  // 🔹 MOSTRAR LOADING MIENTRAS VERIFICA AUTENTICACIÓN
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-4xl text-[#fd4c82] mb-4"></i>
            <p>Verificando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header y Filtros */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nuestros Productos
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {user.nombre} {user.apellido_paterno}
              </p>
            </div>

            <div className="flex gap-2">
              {(searchTerm || selectedCategoria) && (
                <Button
                  label="Limpiar filtros"
                  icon="pi pi-filter-slash"
                  className="p-button-outlined p-button-secondary"
                  onClick={clearFilters}
                />
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-search" />
              <InputText
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </IconField>

            <Dropdown
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.value)}
              options={categoriaOptions}
              optionLabel="label"
              placeholder="Filtrar por categoría"
              className="w-full"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading
              ? 'Cargando...'
              : `${productos.length} producto${
                  productos.length !== 1 ? 's' : ''
                } encontrado${productos.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Grid de Productos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="shadow-lg">
                <div className="p-4">
                  <Skeleton width="100%" height="200px" className="mb-3" />
                  <Skeleton width="80%" height="1.5rem" className="mb-2" />
                  <Skeleton width="100%" height="3rem" className="mb-3" />
                  <Skeleton width="60%" height="1.5rem" className="mb-3" />
                  <Skeleton width="100%" height="2.5rem" />
                </div>
              </Card>
            ))}
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <Card
                key={producto.id_producto}
                className="shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                header={
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(producto.ruta_imagen)}
                      alt={producto.nombre_producto}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/placeholder-product.jpg';
                      }}
                    />
                    <Tag
                      value={
                        producto.categoria_producto?.nombre_categoria_producto
                      }
                      className="absolute top-2 left-2"
                      style={{ backgroundColor: '#fd4c82' }}
                    />
                    <Tag
                      value={getStockLabel(producto.stock_actual)}
                      severity={getStockSeverity(producto.stock_actual)}
                      className="absolute top-2 right-2"
                    />
                  </div>
                }
                footer={
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xl font-bold text-[#fd4c82] whitespace-nowrap">
                      S/ {parseFloat(producto.precio_unitario).toFixed(2)}
                    </span>
                    <Button
                      icon="pi pi-shopping-cart"
                      label="Agregar"
                      className="p-button-sm whitespace-nowrap"
                      disabled={producto.stock_actual === 0}
                      style={{
                        backgroundColor:
                          producto.stock_actual === 0 ? '#6b7280' : '#fd4c82',
                        borderColor:
                          producto.stock_actual === 0 ? '#6b7280' : '#fd4c82',
                      }}
                      onClick={() => handleAddToCart(producto)}
                    />
                  </div>
                }
              >
                <div className="flex flex-col flex-1 min-h-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {producto.nombre_producto}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-1 min-h-[3.75rem]">
                    {producto.descripcion}
                  </p>
                  <div className="text-xs text-gray-500 mt-auto pt-2">
                    <p className="truncate">
                      Unidad: {producto.unidad?.nombre_unidad}
                    </p>
                    <p>Stock: {producto.stock_actual} unidades</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="pi pi-search text-6xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta con otros términos de búsqueda o categorías
            </p>
            <Button
              label="Limpiar filtros"
              icon="pi pi-refresh"
              onClick={clearFilters}
              className="p-button-outlined"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Productos;
