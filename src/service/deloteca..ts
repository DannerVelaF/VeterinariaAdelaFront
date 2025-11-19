// services/decolectaApi.ts
// const DECOLECTA_API_KEY = 'sk_10646.YwmGLGUlUdXLUFCDp8h3ZKOGonF1g2Ls';
// const DECOLECTA_BASE_URL = 'https://api.decolecta.com/v1';
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Interfaces para la respuesta de Decolecta
export interface PersonaDecolecta {
  document_number: string;
  first_name: string;
  first_last_name: string;
  second_last_name: string;
  full_name: string;
}

export interface DecolectaResponse {
  success: boolean;
  data?: PersonaDecolecta;
  error?: string;
}

// Función para consultar DNI en RENIEC
export const consultarDNI = async (dni: string): Promise<DecolectaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultar-dni?dni=${dni}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la consulta: ${response.status}`);
    }

    const result = await response.json();

    console.log('Resultado de la consulta:', result);

    // Tu backend Laravel ya retorna la estructura {success, data, error}
    return result;
  } catch (error: any) {
    console.error('Error consultando DNI:', error);
    return {
      success: false,
      error: error.message || 'Error al consultar el DNI',
    };
  }
};

// Función para consultar RUC a través de tu backend Laravel
export const consultarRUC = async (ruc: string): Promise<DecolectaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultar-ruc?ruc=${ruc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la consulta: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error consultando RUC:', error);
    return {
      success: false,
      error: error.message || 'Error al consultar el RUC',
    };
  }
};
