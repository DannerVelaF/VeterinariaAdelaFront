// pages/Home.tsx
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import {
  getProductosPorCategoria,
  getProductosDestacados,
} from '../../../service/api';
import { useCartStore } from '../../../store/CartStore';
import { useAuthStore } from '../../../store/UserStore';
import Logo from '../../../assets/images/logo.jpg';
import type {
  CategoriaConConteo,
  ProductoDestacado,
} from '../../../util/Interfaces';
import { getImageUrl } from '../../../util/helpers/getImageUrl ';

function Home() {
  const user = useAuthStore((state) => state.persona);
  const addToCart = useCartStore((state) => state.addItem);
  const [categorias, setCategorias] = useState<CategoriaConConteo[]>([]);
  const [productosDestacados, setProductosDestacados] = useState<
    ProductoDestacado[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Mapeo de íconos para categorías
  const getIconoPorCategoria = (nombreCategoria: string) => {
    const iconos: { [key: string]: string } = {
      Alimentos: 'pi pi-apple',
      Comida: 'pi pi-apple',
      Juguetes: 'pi pi-star',
      Higiene: 'pi pi-shield',
      Limpieza: 'pi pi-shield',
      Accesorios: 'pi pi-shopping-bag',
      Medicamentos: 'pi pi-heart',
      Farmacia: 'pi pi-heart',
      Paseo: 'pi pi-map-marker',
      Cuidado: 'pi pi-heart',
      default: 'pi pi-tag',
    };

    const categoriaLower = nombreCategoria.toLowerCase();
    for (const [key, value] of Object.entries(iconos)) {
      if (categoriaLower.includes(key.toLowerCase())) {
        return value;
      }
    }
    return iconos.default;
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [categoriasData, productosData] = await Promise.all([
          getProductosPorCategoria(),
          getProductosDestacados(),
        ]);

        setCategorias(categoriasData);
        setProductosDestacados(productosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleAddToCart = (producto: ProductoDestacado) => {
    addToCart({
      id: producto.id_producto,
      nombre: producto.nombre_producto,
      precio: Number(producto.precio_unitario),
      imagen: producto.ruta_imagen || '/placeholder-product.jpg',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <i className="pi pi-spin pi-spinner text-4xl text-[#fd4c82]"></i>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a{' '}
              <span className="text-[#fd4c82]">ADELA VETERINARIA & SPA</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre los mejores productos y servicios para el cuidado y
              bienestar de tu mascota. Calidad y amor en cada compra.
            </p>

            {user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block mb-8">
                <p className="text-green-800 text-lg">
                  👋 ¡Hola,{' '}
                  <strong>
                    {user.nombre} {user.apellido_paterno}
                  </strong>
                  ! Bienvenido de nuevo.
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/productos">
                <Button
                  label="Ver Productos"
                  icon="pi pi-shopping-bag"
                  className="p-button-lg"
                  style={{ backgroundColor: '#fd4c82', borderColor: '#fd4c82' }}
                />
              </Link>
              <Link to="/servicios">
                <Button
                  label="Nuestros Servicios"
                  icon="pi pi-spa"
                  className="p-button-outlined p-button-lg"
                  style={{ color: '#fd4c82', borderColor: '#fd4c82' }}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-lg text-gray-600">
              Todo lo que necesitas para tu mascota en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorias.map((categoria) => (
              <Card
                key={`categoria-${categoria.categoria_id}-${categoria.nombre_categoria}`}
                className="text-center cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4">
                  <i
                    className={`${getIconoPorCategoria(
                      categoria.nombre_categoria
                    )} text-3xl text-[#fd4c82] mb-3`}
                  ></i>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {categoria.nombre_categoria}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {categoria.cantidad_productos}{' '}
                    {categoria.cantidad_productos === 1
                      ? 'producto'
                      : 'productos'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Los favoritos de nuestros clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosDestacados.map((producto) => (
              <Card
                key={`producto-${producto.id_producto}-${producto.nombre_producto}`}
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
                        producto.categoria_producto
                          ?.nombre_categoria_producto || 'General'
                      }
                      className="absolute top-2 left-2"
                      style={{ backgroundColor: '#fd4c82' }}
                    />
                    <Tag
                      value={
                        producto.stock_actual > 0 ? 'Disponible' : 'Sin stock'
                      }
                      severity={
                        producto.stock_actual > 0 ? 'success' : 'danger'
                      }
                      className="absolute top-2 right-2"
                    />
                  </div>
                }
                footer={
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#fd4c82]">
                      S/ {Number(producto.precio_unitario).toFixed(2)}
                    </span>
                    <Button
                      icon="pi pi-shopping-cart"
                      label="Agregar"
                      className="p-button-sm"
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
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {producto.nombre_producto}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                    {producto.descripcion}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {productosDestacados.length === 0 && (
            <div className="text-center py-12">
              <i className="pi pi-inbox text-6xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 text-lg">
                No hay productos destacados disponibles
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/productos">
              <Button
                label="Ver Todos los Productos"
                icon="pi pi-arrow-right"
                className="p-button-outlined p-button-lg"
                style={{ color: '#fd4c82', borderColor: '#fd4c82' }}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <img
              src={Logo}
              alt="ADELA VETERINARIA"
              className="w-16 h-16 object-cover rounded-full"
            />
          </div>
          <h3 className="text-2xl font-bold mb-4">ADELA VETERINARIA & SPA</h3>
          <p className="text-gray-400 mb-6">
            Cuidando a tus mascotas con amor y profesionalismo desde 2020
          </p>
          <div className="flex justify-center gap-4">
            <i className="pi pi-facebook text-xl cursor-pointer hover:text-[#fd4c82]"></i>
            <i className="pi pi-instagram text-xl cursor-pointer hover:text-[#fd4c82]"></i>
            <i className="pi pi-whatsapp text-xl cursor-pointer hover:text-[#fd4c82]"></i>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
