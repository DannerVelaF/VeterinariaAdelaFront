/**
 * Formatea una fecha a formato legible en español
 * @param fecha - String o Date object
 * @returns Fecha formateada en español
 */
export const formatFecha = (fecha: string | Date): string => {
  const date = new Date(fecha);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha y hora a formato legible en español
 * @param fecha - String o Date object
 * @returns Fecha y hora formateada en español
 */
export const formatFechaHora = (fecha: string | Date): string => {
  const date = new Date(fecha);

  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calcula la edad a partir de la fecha de nacimiento
 * @param fechaNacimiento - String o Date object de la fecha de nacimiento
 * @returns Edad en años
 */
export const calcularEdad = (fechaNacimiento: string | Date): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  // Verificar si la fecha es válida
  if (isNaN(nacimiento.getTime())) {
    return 0;
  }

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};

/**
 * Obtiene el texto descriptivo de la edad
 * @param fechaNacimiento - String o Date object de la fecha de nacimiento
 * @returns Texto con la edad (ej: "25 años")
 */
export const getTextoEdad = (fechaNacimiento: string | Date): string => {
  const edad = calcularEdad(fechaNacimiento);
  return `${edad} ${edad === 1 ? 'año' : 'años'}`;
};

/**
 * Formatea un número de teléfono
 * @param telefono - Número de teléfono
 * @returns Teléfono formateado
 */
export const formatTelefono = (telefono: string): string => {
  if (!telefono) return 'No especificado';

  // Eliminar espacios y caracteres especiales
  const numeroLimpio = telefono.replace(/\D/g, '');

  // Formatear según la longitud
  if (numeroLimpio.length === 9) {
    return numeroLimpio.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  return telefono;
};

/**
 * Capitaliza la primera letra de un texto
 * @param texto - Texto a capitalizar
 * @returns Texto capitalizado
 */
export const capitalizar = (texto: string): string => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};
