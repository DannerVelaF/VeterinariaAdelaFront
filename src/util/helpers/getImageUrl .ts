export const getImageUrl = (rutaImagen: string | null): string => {
  if (!rutaImagen) return '/placeholder-product.jpg';

  // Si ya es una URL completa, devolverla tal cual
  if (rutaImagen.startsWith('http')) return rutaImagen;

  // Si es una ruta relativa, agregar la base URL del servidor
  return `http://163.176.152.20/storage/${rutaImagen}`;
};
