export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio_unitario: number; // ✅ Ahora será number porque el Resource lo convierte
  ruta_imagen: string | null;
  codigo_barras: string;
  stock_actual: number; // ✅ Ahora vendrá del backend
  categoria_producto?: {
    id_categoria_producto: number;
    nombre_categoria_producto: string;
  };
  unidad?: {
    id_unidad: number;
    nombre_unidad: string;
  };
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface Categoria {
  id_categoria_producto: number;
  nombre_categoria_producto: string;
  descripcion: string;
  estado: string;
  fecha_registro: string;
  fecha_actualizacion: string;
}
export interface CategoriaConConteo {
  categoria_id: number;
  nombre_categoria: string;
  cantidad_productos: number;
  icono?: string;
}

export interface ProductoDestacado {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio_unitario: number;
  ruta_imagen: string | null;
  categoria_producto?: {
    id_categoria_producto: number;
    nombre_categoria_producto: string;
  };
  stock_actual: number;
}
