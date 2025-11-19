// pages/Checkout.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCartStore } from '../../../store/CartStore';
import { useAuthStore } from '../../../store/UserStore';
import { getMetodosPago } from '../../../service/api';
import type { MetodoPago } from '../../../util/Interfaces';
import { getImageUrl } from '../../../util/helpers/getImageUrl ';

// Importar imágenes
import yapeIcon from '../../../assets/images/metodoPago/yape.png';
import plinIcon from '../../../assets/images/metodoPago/plin.png';
import transferenciaIcon from '../../../assets/images/metodoPago/transferencia.png';
import efectivoIcon from '../../../assets/images/metodoPago/efectivo.png';

function Checkout() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeItem);
  const user = useAuthStore((state) => state.persona);

  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(
    null
  );
  const [metodoExpandido, setMetodoExpandido] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  // const [productosStock, setProductosStock] = useState<{
  //   [key: number]: number;
  // }>({});

  // Calcular totales
  const subtotal = cartItems.reduce(
    (total, item) => total + item.precio * item.quantity,
    0
  );
  // const envio = 4.0;
  const impuesto = subtotal * 0.08;
  // const total = subtotal + envio + impuesto;
  const total = subtotal + impuesto;

  // Obtener icono según el método de pago
  const getMetodoIcon = (nombreMetodo: string) => {
    const nombre = nombreMetodo.toLowerCase();
    if (nombre.includes('yape')) return yapeIcon;
    if (nombre.includes('plin')) return plinIcon;
    if (nombre.includes('transferencia')) return transferenciaIcon;
    if (nombre.includes('contra entrega') || nombre.includes('efectivo'))
      return efectivoIcon;
    return efectivoIcon; // default
  };

  // Formatear instrucciones (convertir \n en <br />)
  const formatInstrucciones = (instrucciones: string) => {
    return instrucciones.split('\n').map((linea, index) => (
      <p key={index} className="mb-1">
        {linea}
      </p>
    ));
  };

  // Manejar aumento de cantidad
  const handleIncreaseQuantity = (item: any) => {
    // Para el checkout, asumimos stock suficiente o usamos un valor alto
    const availableStock = 100; // O podrías obtener el stock real de la API
    updateQuantity(item.id, item.quantity + 1, availableStock);
  };

  // Manejar disminución de cantidad
  const handleDecreaseQuantity = (item: any) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
    } else {
      const availableStock = 100;
      updateQuantity(item.id, item.quantity - 1, availableStock);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/productos');
      return;
    }

    const cargarMetodosPago = async () => {
      try {
        const response = await getMetodosPago();
        console.log(response);
        setMetodosPago(response);
        if (response.length > 0) {
          setMetodoSeleccionado(response[0].id_metodo_pago);
          setMetodoExpandido(response[0].id_metodo_pago); // Expandir el primero por defecto
        }
      } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
      }
    };

    cargarMetodosPago();
  }, [user, cartItems, navigate]);

  const handleSeleccionarMetodo = (metodoId: number) => {
    setMetodoSeleccionado(metodoId);
    setMetodoExpandido(metodoId); // Expandir automáticamente al seleccionar
  };

  const handleToggleExpandir = (metodoId: number) => {
    if (metodoExpandido === metodoId) {
      setMetodoExpandido(null);
    } else {
      setMetodoExpandido(metodoId);
    }
  };

  const handleProcesarPedido = async () => {
    if (!metodoSeleccionado) return;

    setLoading(true);
    try {
      // const ventaData = {
      //   id_cliente: user?.id_persona,
      //   items: cartItems.map((item) => ({
      //     id_producto: item.id,
      //     cantidad: item.quantity,
      //     precio_unitario: item.precio,
      //   })),
      //   total: total,
      //   id_metodo_pago: metodoSeleccionado,
      // };

      // TODO: Llamar a la API para crear la venta
      // const response = await crearVenta(ventaData);

      const pedidoId = Math.floor(Math.random() * 10000);

      navigate('/procesar-pago', {
        state: {
          pedidoId,
          metodoPago: metodosPago.find(
            (m) => m.id_metodo_pago === metodoSeleccionado
          ),
          total,
        },
      });
    } catch (error) {
      console.error('Error al procesar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Redirigiendo...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-[#fd4c82]">
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Resumen e información */}
        <div>
          {/* Resumen del pedido COMPLETO */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resumen de tu pedido</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 border-b pb-4"
                >
                  {/* Imagen del producto */}
                  <img
                    src={getImageUrl(item.imagen)}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/placeholder-product.jpg';
                    }}
                  />

                  {/* Información del producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      S/ {item.precio.toFixed(2)} c/u
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <i className="pi pi-minus text-sm text-gray-600"></i>
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <i className="pi pi-plus text-sm text-gray-600"></i>
                      </button>
                    </div>
                  </div>

                  {/* Precio total y eliminar */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800 mb-2">
                      S/ {(item.precio * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Línea divisoria */}
            <div className="border-t my-4"></div>

            {/* Resumen de precios */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal (
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}{' '}
                  productos):
                </span>
                <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Costo de envío:</span>
                <span className="font-medium">S/ {envio.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (8%):</span>
                <span className="font-medium">S/ {impuesto.toFixed(2)}</span>
              </div>

              {/* Línea divisoria antes del total */}
              <div className="border-t my-3"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total a pagar:</span>
                <span className="text-[#fd4c82]">S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {/* Información del cliente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Información de contacto
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Nombre:</strong> {user?.nombre} {user?.apellido_paterno}{' '}
                {user?.apellido_materno}
              </p>
              <p>
                <strong>Email:</strong> {user?.correo} {/* Cambiado aquí */}
              </p>
              <p>
                <strong>Teléfono:</strong>{' '}
                {user?.numero_telefono_personal || 'No disponible'}{' '}
                {/* Agregado manejo de posible undefined */}
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Método de pago (sin cambios) */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Método de pago</h2>

            <div className="space-y-3">
              {metodosPago.map((metodo) => (
                <div
                  key={metodo.id_metodo_pago}
                  className={`border rounded-lg transition-all ${
                    metodoSeleccionado === metodo.id_metodo_pago
                      ? 'border-[#fd4c82] bg-pink-50'
                      : 'border-gray-300'
                  }`}
                >
                  {/* Header del método - Siempre visible */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => handleToggleExpandir(metodo.id_metodo_pago)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getMetodoIcon(metodo.nombre_metodo)}
                          alt={metodo.nombre_metodo}
                          className="w-8 h-8 object-contain"
                        />
                        <div>
                          <h3 className="font-semibold">
                            {metodo.nombre_metodo}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {metodoExpandido === metodo.id_metodo_pago
                              ? 'Haz click para contraer'
                              : 'Haz click para más información'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Radio button para selección */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            metodoSeleccionado === metodo.id_metodo_pago
                              ? 'border-[#fd4c82] bg-[#fd4c82]'
                              : 'border-gray-400'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeleccionarMetodo(metodo.id_metodo_pago);
                          }}
                        >
                          {metodoSeleccionado === metodo.id_metodo_pago && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        {/* Flecha para expandir/contraer */}
                        <i
                          className={`pi ${
                            metodoExpandido === metodo.id_metodo_pago
                              ? 'pi-chevron-up'
                              : 'pi-chevron-down'
                          } text-gray-500`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {metodoExpandido === metodo.id_metodo_pago && (
                    <div className="px-4 pb-4 border-t pt-4">
                      {/* Información específica del método */}
                      {metodo.instrucciones && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2 text-sm text-gray-700">
                            Instrucciones:
                          </h4>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {formatInstrucciones(metodo.instrucciones)}
                          </div>
                        </div>
                      )}

                      {/* Información de cuenta para métodos digitales/transferencia */}
                      {(metodo.tipo_metodo === 'digital' ||
                        metodo.tipo_metodo === 'transferencia') && (
                        <div className="space-y-2 text-sm">
                          {metodo.numero_cuenta && (
                            <div className="flex justify-between">
                              <span className="font-medium">Número:</span>
                              <span className="text-gray-700">
                                {metodo.numero_cuenta}
                              </span>
                            </div>
                          )}
                          {metodo.nombre_titular && (
                            <div className="flex justify-between">
                              <span className="font-medium">Titular:</span>
                              <span className="text-gray-700">
                                {metodo.nombre_titular}
                              </span>
                            </div>
                          )}
                          {metodo.entidad_financiera && (
                            <div className="flex justify-between">
                              <span className="font-medium">Entidad:</span>
                              <span className="text-gray-700">
                                {metodo.entidad_financiera}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* QR para métodos digitales */}
                      {metodo.tipo_metodo === 'digital' && metodo.codigo_qr && (
                        <div className="mt-4 text-center">
                          <h4 className="font-semibold mb-2 text-sm text-gray-700">
                            Escanea el código QR:
                          </h4>
                          <div className="bg-white p-4 rounded-lg border inline-block">
                            <img
                              src={getImageUrl(metodo.codigo_qr)}
                              alt={`QR ${metodo.nombre_metodo}`}
                              className="w-32 h-32 object-contain mx-auto"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleProcesarPedido}
              disabled={!metodoSeleccionado || loading}
              className="w-full bg-[#fd4c82] hover:bg-[#e63b6f] text-white font-semibold py-3 px-6 rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Procesando...' : 'Continuar con el pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
