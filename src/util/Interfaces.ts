export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio_unitario: number;
  ruta_imagen: string | null;
  codigo_barras: string;
  stock_actual: number;
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

export interface PerfilData {
  id_usuario: number;
  usuario: string;
  estado: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  ultimo_login: string;
  persona: {
    id_persona: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    numero_documento: string;
    correo_electronico_personal: string;
    correo_electronico_secundario: string;
    numero_telefono_personal: string;
    numero_telefono_secundario: string;
    fecha_nacimiento: string;
    sexo: string;
    nacionalidad: string;
  };
}

export interface ActualizarPerfilRequest {
  usuario?: string;
  persona?: {
    correo_electronico_personal?: string;
    correo_electronico_secundario?: string;
    numero_telefono_personal?: string;
    numero_telefono_secundario?: string;
  };
}

export interface ActualizarPerfilParcialRequest {
  usuario?: string;
  correo_electronico_personal?: string;
  correo_electronico_secundario?: string;
  numero_telefono_personal?: string;
  numero_telefono_secundario?: string;
}

export interface PerfilResponse {
  success: boolean;
  data: PerfilData;
  message: string;
}

export interface DireccionData {
  id_direccion?: number;
  zona: string;
  tipo_calle: string;
  nombre_calle: string;
  numero: string;
  codigo_postal: string;
  referencia: string;
  codigo_ubigeo: string;
  ubigeo?: {
    id_ubigeo: string;
    departamento: string;
    provincia: string;
    distrito: string;
  };
}
export interface UbigeoData {
  id_ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

// util/Interfaces.ts
export interface MetodoPago {
  id_metodo_pago: number;
  nombre_metodo: string;
  tipo_metodo: string;
  numero_cuenta?: string;
  nombre_titular?: string;
  entidad_financiera?: string;
  tipo_cuenta?: string;
  codigo_qr?: string;
  instrucciones?: string;
  estado: 'activo' | 'inactivo';
  orden: number;
  observacion?: string;
  fecha_registro: string;
  fecha_actualizacion?: string;
}
