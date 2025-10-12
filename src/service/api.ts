import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});

// Obtener todos los tipo documento
export const getTipoDocumento = async () => {
  try {
    const response = await api.get('tipoDocumento');
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUbigeos = async () => {
  try {
    const response = await api.get('ubigeos');
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener ubigeos:', error);
    return [];
  }
};

export const registrarUsuario = async (data: any) => {
  try {
    const response = await api.post('auth/registro', data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const enviarCodigoVerificacion = async (correo: string) => {
  try {
    const response = await api.post('verificarCorreo', { correo });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
