// service/api.ts
import axios from 'axios';
import type {
  Categoria,
  CategoriaConConteo,
  LoginRequest,
  Producto,
  ProductoDestacado,
} from '../util/Interfaces';
import { useAuthStore } from '../store/UserStore';

const api = axios.create({
  // baseURL: 'http://163.176.152.20/api/v1/',
  baseURL: 'http://localhost:8000/api/v1/',
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

export const getUbigeos = async () => {
  try {
    const response = await api.get('ubigeos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener ubigeos:', error);
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
    // Manejar específicamente errores de autenticación
    if (error.response?.status === 401) {
      throw new Error('Credenciales incorrectas');
    } else if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado');
    } else {
      throw new Error('Error al iniciar sesión');
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

// service/api.ts - Versión corregida
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
    console.log(response.data.data);

    // 🔹 CORRECCIÓN: Acceder a response.data.data
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


export const verificarDocumentoExistente = async (dni: string, tipoDocumentoId: number) => {
    try {
        const response = await api.post('auth/verificar-documento', {
            dni,
            tipo_documento_id: tipoDocumentoId
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
            usuario: usuario
        });
        return response.data;
    } catch (error) {
        console.log('Error al verificar usuario:', error);
        throw error;
    }
};