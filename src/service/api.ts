// service/api.ts
import axios from 'axios';
import type {
  ActualizarPerfilParcialRequest,
  ActualizarPerfilRequest,
  Categoria,
  CategoriaConConteo,
  DireccionData,
  LoginRequest,
  MetodoPago,
  PerfilResponse,
  Producto,
  ProductoDestacado,
} from '../util/Interfaces';
import { useAuthStore } from '../store/UserStore';

const api = axios.create({
  baseURL: '/api/v1/',
  // baseURL: 'http://163.176.152.20/api/v1/',
  // baseURL: 'http://localhost:8000/api/v1/',
});

// 🔹 INTERCEPTOR PARA AGREGAR TOKEN AUTOMÁTICAMENTE
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 INTERCEPTOR PARA MANEJAR ERRORES DE AUTENTICACIÓN
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No redirigir para errores de login
    if (
      error.response?.status === 401 &&
      !error.config.url.includes('auth/login')
    ) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// Obtener todos los tipo documento
export const getTipoDocumento = async () => {
  try {
    const response = await api.get('tipoDocumento');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registrarUsuario = async (data: any) => {
  try {
    const response = await api.post('auth/registro', data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (request: LoginRequest) => {
  try {
    const response = await api.post('auth/login', request);
    const { data, token } = response.data;

    if (token) {
      useAuthStore.getState().setAuth(data, token);
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    } else {
      throw new Error('Error de conexión');
    }
  }
};

export const enviarCodigoVerificacion = async (correo: string) => {
  try {
    const response = await api.post('verificarCorreo', { correo });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  token: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await api.post('auth/reset-password', {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    console.log('Error resetting password:', error);
    throw error;
  }
};

export const verifyResetToken = async (email: string, token: string) => {
  try {
    const response = await api.post('auth/verify-reset-token', {
      email,
      token,
    });
    return response.data;
  } catch (error) {
    console.log('Error verifying token:', error);
    throw error;
  }
};

export const getProductos = async (filters?: {
  categoria_id?: number;
  search?: string;
}): Promise<Producto[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.categoria_id) {
      params.append('categoria_id', filters.categoria_id.toString());
    }

    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get(`/productos?${params}`);

    return response.data.data;
  } catch (error) {
    console.error('Error getting productos:', error);
    throw error;
  }
};

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categorias-productos');

    // Si el Resource Laravel envuelve en 'data'
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error('Error getting categorias:', error);
    throw error;
  }
};

export const getProductosPorCategoria = async (): Promise<
  CategoriaConConteo[]
> => {
  try {
    const response = await api.get('/productos-categorias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return [];
  }
};
export const getProductosDestacados = async (): Promise<
  ProductoDestacado[]
> => {
  try {
    const response = await api.get('/productos-destacados');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    return [];
  }
};

export const verificarDocumentoExistente = async (
  dni: string,
  tipoDocumentoId: number
) => {
  try {
    const response = await api.post('auth/verificar-documento', {
      dni,
      tipo_documento_id: tipoDocumentoId,
    });
    return response.data;
  } catch (error) {
    console.log('Error al verificar documento:', error);
    throw error;
  }
};

export const verificarUsuarioExistente = async (usuario: string) => {
  try {
    const response = await api.post('auth/verificar-usuario', {
      usuario: usuario,
    });
    return response.data;
  } catch (error) {
    console.log('Error al verificar usuario:', error);
    throw error;
  }
};

export const getPerfil = async (id_usuario: number) => {
  try {
    const response = await api.get(`/perfil/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.log('Error al obtener perfil:', error);
    throw error;
  }
};
export const updatePerfil = async (
  id_usuario: number,
  datos: ActualizarPerfilRequest
): Promise<PerfilResponse> => {
  try {
    const response = await api.put(`/perfil/${id_usuario}`, datos);
    return response.data;
  } catch (error: any) {
    console.log('Error al actualizar perfil:', error);

    if (error.response?.status === 422) {
      // Manejar errores de validación del PerfilRequest
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat();
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(error.response.data.message || 'Error de validación');
    }
    throw new Error('Error al actualizar el perfil');
  }
};

/**
 * Actualizar perfil parcial (método PATCH)
 * Estructura plana más simple
 */
export const updatePerfilParcial = async (
  id_usuario: number,
  datos: ActualizarPerfilParcialRequest
): Promise<PerfilResponse> => {
  try {
    const response = await api.patch(`/perfil/${id_usuario}`, datos);
    return response.data;
  } catch (error: any) {
    console.log('Error al actualizar perfil parcial:', error);

    if (error.response?.status === 422) {
      // Manejar errores de validación del PerfilRequest
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat();
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(error.response.data.message || 'Error de validación');
    }
    throw new Error('Error al actualizar el perfil');
  }
};

/**
 * Actualizar un campo específico del perfil
 * Maneja automáticamente la estructura correcta
 */
export const updateCampoPerfil = async (
  id_usuario: number,
  campo: string,
  valor: string
): Promise<PerfilResponse> => {
  try {
    // Si es un campo del usuario
    if (campo === 'usuario') {
      return await updatePerfilParcial(id_usuario, { usuario: valor });
    }

    // Si es un campo de la persona (usando PATCH simple)
    const camposPersona: {
      [key: string]: keyof ActualizarPerfilParcialRequest;
    } = {
      'persona.correo_electronico_personal': 'correo_electronico_personal',
      'persona.correo_electronico_secundario': 'correo_electronico_secundario',
      'persona.numero_telefono_personal': 'numero_telefono_personal',
      'persona.numero_telefono_secundario': 'numero_telefono_secundario',
    };

    if (camposPersona[campo]) {
      const campoSimple = camposPersona[campo];
      return await updatePerfilParcial(id_usuario, { [campoSimple]: valor });
    }

    throw new Error(`Campo no válido: ${campo}`);
  } catch (error: any) {
    console.log('Error al actualizar campo del perfil:', error);

    // Re-lanzar el error para que el componente lo maneje
    throw error;
  }
};

export const getDireccionUser = async (id_usuario: number): Promise<any> => {
  try {
    const response = await api.get(`/perfil/${id_usuario}/direccion`);
    return response.data;
  } catch (error: any) {
    console.log('Error al obtener dirección:', error);
    throw error;
  }
};

export const guardarDireccion = async (
  id_usuario: number,
  datos: DireccionData
): Promise<any> => {
  try {
    const response = await api.post(
      `/perfil/${id_usuario}/direccion/guardar`,
      datos
    );
    return response.data;
  } catch (error: any) {
    console.log('Error al guardar dirección:', error);

    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat();
        throw new Error(errorMessages.join(', '));
      }
    }
    throw error;
  }
};

export const getDepartamentos = async (): Promise<any> => {
  try {
    const response = await api.get('/ubigeos/departamentos');
    return response.data;
  } catch (error) {
    console.log('Error al obtener departamentos:', error);
    throw error;
  }
};

export const getProvincias = async (departamento: string): Promise<any> => {
  try {
    const response = await api.get(
      `/ubigeos/provincias/${encodeURIComponent(departamento)}`
    );
    return response.data;
  } catch (error) {
    console.log('Error al obtener provincias:', error);
    throw error;
  }
};

export const getDistritos = async (provincia: string): Promise<any> => {
  try {
    const response = await api.get(
      `/ubigeos/distritos/${encodeURIComponent(provincia)}`
    );
    return response.data;
  } catch (error) {
    console.log('Error al obtener distritos:', error);
    throw error;
  }
};

export const getMetodosPago = async (): Promise<MetodoPago[]> => {
  try {
    const response = await api.get('metodos-pago');
    console.log('Respuesta completa:', response);
    console.log('Response data:', response.data);

    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    throw error;
  }
};
