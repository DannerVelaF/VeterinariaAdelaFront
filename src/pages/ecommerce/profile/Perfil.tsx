import { TabPanel, TabView } from 'primereact/tabview';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/UserStore';
import {
  getDepartamentos,
  getDireccionUser,
  getDistritos,
  getPerfil,
  getProvincias,
  guardarDireccion,
  updateCampoPerfil,
} from '../../../service/api';
import {
  calcularEdad,
  capitalizar,
  formatFecha,
  formatTelefono,
} from '../../../util/formatters/dateFormatter';
import { Skeleton } from 'primereact/skeleton';
import type {
  DireccionData,
  PerfilData,
  UbigeoData,
} from '../../../util/Interfaces';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

export default function Perfil() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
  const [direccionData, setDireccionData] = useState<DireccionData | null>(
    null
  );
  const [editing, setEditing] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const { persona, setAuth } = useAuthStore();
  const toast = useRef<Toast>(null);

  // Estados para la direccion
  const [direccionDialog, setDireccionDialog] = useState(false);
  const [guardandoDireccion, setGuardandoDireccion] = useState(false);
  const [direccionForm, setDireccionForm] = useState<DireccionData>({
    zona: '',
    tipo_calle: '',
    nombre_calle: '',
    numero: '',
    codigo_postal: '',
    referencia: '',
    codigo_ubigeo: '',
  });

  // Estados para el ubigeo
  const [departamentos, setDepartamentos] = useState<UbigeoData[]>([]);
  const [provincias, setProvincias] = useState<UbigeoData[]>([]);
  const [distritos, setDistritos] = useState<UbigeoData[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    useState<string>('');
  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState<string>('');

  // Función para cargar datos según el tab activo
  const cargarDatosTab = async (index: number) => {
    if (!persona?.usuario.id_usuario) {
      console.error('No hay usuario autenticado');
      return;
    }
    setEditing(false);
    setLoading(true);
    try {
      switch (index) {
        case 0: {
          const response = await getPerfil(persona.usuario.id_usuario);
          if (response.success) {
            setPerfilData(response.data);
          }
          break;
        }
        case 1: {
          const response = await getDireccionUser(persona.usuario.id_usuario);
          console.log(response);

          if (response.data != null) {
            setDireccionData(response.data.direccion || null);
          }
          break;
        }
        case 2: {
          console.log('Cargando direcciones...');
          break;
        }
        case 3: {
          console.log('Cargando mascotas...');
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los datos',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el diálogo de edición
  const openEditDialog = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditDialog(true);
  };

  // Función para validar el campo antes de guardar
  const validarCampo = (field: string, value: string): string | null => {
    const validaciones: { [key: string]: (val: string) => string | null } = {
      'persona.correo_electronico_personal': (val) => {
        if (!val) return 'El correo principal es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return 'Ingrese un correo electrónico válido';

        // Validar que no sea igual al correo secundario
        const correoSecundarioActual =
          perfilData?.persona.correo_electronico_secundario;
        if (val && correoSecundarioActual && val === correoSecundarioActual) {
          return 'El correo principal no puede ser igual al secundario';
        }
        return null;
      },
      'persona.correo_electronico_secundario': (val) => {
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return 'Ingrese un correo electrónico válido';

        // Validar que no sea igual al correo principal
        const correoPrincipalActual =
          perfilData?.persona.correo_electronico_personal;
        if (val && val === correoPrincipalActual) {
          return 'El correo secundario no puede ser igual al principal';
        }
        return null;
      },
      'persona.numero_telefono_personal': (val) => {
        if (!val) return 'El teléfono principal es obligatorio';
        if (!/^9\d{8}$/.test(val))
          return 'El teléfono debe tener 9 dígitos y comenzar con 9';

        // Validar que no sea igual al teléfono secundario
        const telefonoSecundarioActual =
          perfilData?.persona.numero_telefono_secundario;
        if (
          val &&
          telefonoSecundarioActual &&
          val === telefonoSecundarioActual
        ) {
          return 'El número telefónico principal no puede ser igual al secundario';
        }
        return null;
      },
      'persona.numero_telefono_secundario': (val) => {
        if (val && !/^9\d{8}$/.test(val))
          return 'El teléfono debe tener 9 dígitos y comenzar con 9';

        // Validar que no sea igual al teléfono principal
        const telefonoPrincipalActual =
          perfilData?.persona.numero_telefono_personal;
        if (val && val === telefonoPrincipalActual) {
          return 'El número telefónico secundario no puede ser igual al principal';
        }
        return null;
      },
      usuario: (val) => {
        if (!val) return 'El nombre de usuario es obligatorio';
        if (val.length > 50)
          return 'El usuario no puede exceder los 50 caracteres';
        return null;
      },
    };

    return validaciones[field] ? validaciones[field](value) : null;
  };

  // Función para guardar los cambios
  const guardarCambios = async () => {
    // Validación local primero
    const errorValidacion = validarCampo(editField, editValue);
    if (errorValidacion) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: errorValidacion,
        life: 3000,
      });
      return;
    }

    // Validar que persona existe
    if (!persona?.usuario.id_usuario) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay usuario autenticado',
        life: 3000,
      });
      return;
    }

    // Validación adicional: si el nuevo valor es igual al actual, no hacer nada
    const valorActual = obtenerValorActual(editField);
    if (valorActual === editValue) {
      toast.current?.show({
        severity: 'info',
        summary: 'Sin cambios',
        detail: 'El valor ingresado es igual al actual',
        life: 3000,
      });
      setEditDialog(false);
      return;
    }

    setSaving(true);
    try {
      const response = await updateCampoPerfil(
        persona.usuario.id_usuario,
        editField,
        editValue
      );

      if (response.success) {
        // Actualizar el estado local con los nuevos datos
        setPerfilData(response.data);

        // Actualizar el store de autenticación si se cambió el usuario
        if (editField === 'usuario' && persona) {
          setAuth(
            {
              ...persona,
              usuario: { ...persona.usuario, usuario: editValue },
            },
            persona.token || ''
          );
        }

        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Información actualizada correctamente',
          life: 3000,
        });

        setEditDialog(false);
      }
    } catch (error: any) {
      console.error('Error:', error);

      // Mostrar el mensaje de error que viene del PerfilRequest
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: error.message || 'Error al actualizar la información',
        life: 5000, // Más tiempo para leer los mensajes
      });
    } finally {
      setSaving(false);
    }
  };

  // Función auxiliar para obtener el valor actual del campo
  const obtenerValorActual = (field: string): string => {
    if (!perfilData) return '';

    const campos: { [key: string]: string } = {
      'persona.correo_electronico_personal':
        perfilData.persona.correo_electronico_personal,
      'persona.correo_electronico_secundario':
        perfilData.persona.correo_electronico_secundario || '',
      'persona.numero_telefono_personal':
        perfilData.persona.numero_telefono_personal,
      'persona.numero_telefono_secundario':
        perfilData.persona.numero_telefono_secundario || '',
      usuario: perfilData.usuario,
    };

    return campos[field] || '';
  };

  // Obtener el label del campo que se está editando
  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      'persona.correo_electronico_personal': 'Correo principal',
      'persona.correo_electronico_secundario': 'Correo secundario',
      'persona.numero_telefono_personal': 'Teléfono principal',
      'persona.numero_telefono_secundario': 'Teléfono secundario',
      usuario: 'Usuario',
    };
    return labels[field] || field;
  };

  // Obtener el tipo de input según el campo
  const getInputType = (field: string) => {
    if (field.includes('correo')) return 'email';
    if (field.includes('telefono')) return 'tel';
    return 'text';
  };

  // Obtener el placeholder según el campo
  const getPlaceholder = (field: string) => {
    const placeholders: { [key: string]: string } = {
      'persona.correo_electronico_personal': 'ejemplo@correo.com',
      'persona.correo_electronico_secundario': 'ejemplo@correo.com (opcional)',
      'persona.numero_telefono_personal': '912345678',
      'persona.numero_telefono_secundario': '912345678 (opcional)',
      usuario: 'Nombre de usuario',
    };
    return placeholders[field] || '';
  };

  // Cargar datos cuando cambia el tab
  useEffect(() => {
    cargarDatosTab(activeIndex);
  }, [activeIndex]);

  // Cargar datos iniciales
  useEffect(() => {
    if (persona?.usuario.id_usuario) {
      cargarDatosTab(0);
    }
  }, [persona]);

  const handleTabChange = (event: any) => {
    setActiveIndex(event.index);
  };

  // Tipos de calle
  const tiposCalle = [
    { label: 'Avenida', value: 'AV' },
    { label: 'Jirón', value: 'JR' },
    { label: 'Calle', value: 'CL' },
    { label: 'Paseo', value: 'PS' },
    { label: 'Carretera', value: 'CT' },
    { label: 'Manzana', value: 'MZ' },
    { label: 'Lote', value: 'LT' },
    { label: 'Urbanización', value: 'URB' },
    { label: 'Asentamiento Humano', value: 'AAHH' },
    { label: 'Pasaje', value: 'PJ' },
    { label: 'Grupo', value: 'GD' },
    { label: 'Sector', value: 'SM' },
    { label: 'Kilómetro', value: 'KM' },
    { label: 'Otro', value: 'OTRO' },
  ];

  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const response = await getDepartamentos();
        if (response.success) {
          setDepartamentos(response.data);
        }
      } catch (error) {
        console.error('Error cargando departamentos:', error.message);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los departamentos',
          life: 3000,
        });
      }
    };
    cargarDepartamentos();
  }, []);

  useEffect(() => {
    if (departamentoSeleccionado) {
      const cargarProvincias = async () => {
        try {
          const response = await getProvincias(departamentoSeleccionado);
          if (response.success) {
            setProvincias(response.data);
            setProvinciaSeleccionada('');
            setDistritos([]);
          }
        } catch (error) {
          console.error('Error cargando provincias:', error);
        }
      };
      cargarProvincias();
    }
  }, [departamentoSeleccionado]);

  useEffect(() => {
    if (provinciaSeleccionada) {
      const cargarDistritos = async () => {
        try {
          const response = await getDistritos(provinciaSeleccionada);
          if (response.success) {
            setDistritos(response.data);
          }
        } catch (error) {
          console.error('Error cargando distritos:', error);
        }
      };
      cargarDistritos();
    }
  }, [provinciaSeleccionada]);

  const abrirDireccionDialog = () => {
    if (direccionData) {
      // Si ya tiene dirección, cargar los datos en el formulario
      setDireccionForm({
        zona: direccionData.zona || '',
        tipo_calle: direccionData.tipo_calle || '',
        nombre_calle: direccionData.nombre_calle || '',
        numero: direccionData.numero || '',
        codigo_postal: direccionData.codigo_postal || '',
        referencia: direccionData.referencia || '',
        codigo_ubigeo: direccionData.codigo_ubigeo || '',
      });

      // También cargar los ubigeos si existen
      if (direccionData.ubigeo) {
        setDepartamentoSeleccionado(direccionData.ubigeo.departamento);
        // Nota: Necesitarías lógica adicional para cargar provincia y distrito
      }
    } else {
      // Limpiar formulario para nueva dirección
      setDireccionForm({
        zona: '',
        tipo_calle: '',
        nombre_calle: '',
        numero: '',
        codigo_postal: '',
        referencia: '',
        codigo_ubigeo: '',
      });
    }
    setDireccionDialog(true);
  };

  const guardarDireccionUsuario = async () => {
    if (!persona?.usuario.id_usuario) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay usuario autenticado',
        life: 3000,
      });
      return;
    }

    // Validaciones básicas
    if (
      !direccionForm.tipo_calle ||
      !direccionForm.nombre_calle ||
      !direccionForm.numero ||
      !direccionForm.codigo_ubigeo
    ) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor complete los campos obligatorios (*)',
        life: 3000,
      });
      return;
    }

    // Validar que se haya seleccionado un distrito
    if (!direccionForm.codigo_ubigeo) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor seleccione un distrito',
        life: 3000,
      });
      return;
    }

    setGuardandoDireccion(true);
    try {
      const response = await guardarDireccion(
        persona.usuario.id_usuario,
        direccionForm
      );

      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message || 'Dirección guardada correctamente',
          life: 3000,
        });

        setDireccionData(response.data.direccion);
        setDireccionDialog(false);

        // Recargar los datos de dirección
        cargarDatosTab(1);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al guardar la dirección',
        life: 5000,
      });
    } finally {
      setGuardandoDireccion(false);
    }
  };

  const onDistritoChange = (idUbigeo: string) => {
    setDireccionForm({
      ...direccionForm,
      codigo_ubigeo: idUbigeo,
    });
  };

  return (
    <div className="flex">
      <Toast ref={toast} />

      <div className="vertical-tabview-container">
        <TabView
          className="vertical-tabview"
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
        >
          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <i className="pi pi-user"></i>
                <span>Mi Perfil</span>
                {loading && activeIndex === 0 && (
                  <i className="pi pi-spin pi-spinner ml-2 text-sm"></i>
                )}
              </div>
            }
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => cargarDatosTab(0)}
                    className="p-button p-button-outlined p-button-sm"
                    disabled={loading}
                  >
                    <i className="pi pi-refresh"></i>
                  </button>
                  {loading && activeIndex === 0 ? (
                    <Button
                      label={editing ? 'Cancelar' : 'Editar'}
                      icon={editing ? 'pi pi-times' : 'pi pi-pencil'}
                      className="p-button-sm"
                      onClick={() => setEditing(!editing)}
                      disabled
                    />
                  ) : (
                    <Button
                      label={editing ? 'Cancelar' : 'Editar'}
                      icon={editing ? 'pi pi-times' : 'pi pi-pencil'}
                      className="p-button-sm"
                      onClick={() => setEditing(!editing)}
                    />
                  )}
                </div>
              </div>

              {loading && activeIndex === 0 ? (
                <div className="space-y-4">
                  <Skeleton width="100%" height="120px" />
                  <Skeleton width="100%" height="120px" />
                  <Skeleton width="100%" height="120px" />
                </div>
              ) : perfilData ? (
                <div className="space-y-6">
                  {/* Tarjeta de Información Personal */}
                  <Card title="Información Personal" className="shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-gray-600">
                          Nombre completo
                        </label>
                        <p className="text-gray-800">
                          {perfilData.persona.nombre}{' '}
                          {perfilData.persona.apellido_paterno}{' '}
                          {perfilData.persona.apellido_materno}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Documento
                        </label>
                        <p className="text-gray-800">
                          {perfilData.persona.numero_documento}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Fecha de nacimiento
                        </label>
                        <p className="text-gray-800">
                          {formatFecha(perfilData.persona.fecha_nacimiento)}
                          <span className="ml-2 text-sm text-gray-500">
                            ({calcularEdad(perfilData.persona.fecha_nacimiento)}{' '}
                            años)
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Sexo
                        </label>
                        <p className="text-gray-800">
                          {perfilData.persona.sexo === 'M'
                            ? 'Masculino'
                            : 'Femenino'}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Nacionalidad
                        </label>
                        <p className="text-gray-800">
                          {capitalizar(perfilData.persona.nacionalidad)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Tarjeta de Contacto */}
                  <Card title="Información de Contacto" className="shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-gray-600">
                          Correo principal
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800">
                            {perfilData.persona.correo_electronico_personal}
                          </p>
                          {editing && (
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-text p-button-sm"
                              onClick={() =>
                                openEditDialog(
                                  'persona.correo_electronico_personal',
                                  perfilData.persona.correo_electronico_personal
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Correo secundario
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800">
                            {perfilData.persona.correo_electronico_secundario ||
                              'No especificado'}
                          </p>
                          {editing && (
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-text p-button-sm"
                              onClick={() =>
                                openEditDialog(
                                  'persona.correo_electronico_secundario',
                                  perfilData.persona
                                    .correo_electronico_secundario || ''
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Teléfono principal
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800">
                            {formatTelefono(
                              perfilData.persona.numero_telefono_personal
                            )}
                          </p>
                          {editing && (
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-text p-button-sm"
                              onClick={() =>
                                openEditDialog(
                                  'persona.numero_telefono_personal',
                                  perfilData.persona.numero_telefono_personal
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Teléfono secundario
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800">
                            {formatTelefono(
                              perfilData.persona.numero_telefono_secundario
                            ) || 'No especificado'}
                          </p>
                          {editing && (
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-text p-button-sm"
                              onClick={() =>
                                openEditDialog(
                                  'persona.numero_telefono_secundario',
                                  perfilData.persona
                                    .numero_telefono_secundario || ''
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Tarjeta de Cuenta */}
                  <Card title="Información de la Cuenta" className="shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-gray-600">
                          Usuario
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800">{perfilData.usuario}</p>
                          {editing && (
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-text p-button-sm"
                              onClick={() =>
                                openEditDialog('usuario', perfilData.usuario)
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Estado
                        </label>
                        <Tag
                          value={capitalizar(perfilData.estado)}
                          severity={
                            perfilData.estado === 'activo'
                              ? 'success'
                              : 'danger'
                          }
                          className="ml-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Fecha de registro
                        </label>
                        <p className="text-gray-800">
                          {formatFecha(perfilData.fecha_registro)}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Última actualización
                        </label>
                        <p className="text-gray-800">
                          {formatFecha(perfilData.fecha_actualizacion)}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600">
                          Último acceso
                        </label>
                        <p className="text-gray-800">
                          {formatFecha(perfilData.ultimo_login)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="text-center py-8">
                  <i className="pi pi-exclamation-circle text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No se pudieron cargar los datos
                  </h3>
                  <p className="text-gray-500">
                    Haz clic en el botón de actualizar para intentar nuevamente
                  </p>
                </Card>
              )}
            </div>
          </TabPanel>
          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <i className="pi pi-map"></i>
                <span>Mi Dirección</span>
                {loading && activeIndex === 1 && (
                  <i className="pi pi-spin pi-spinner ml-2 text-sm"></i>
                )}
              </div>
            }
            className="p-fluid"
          >
            <div className="p-6">
              {/* ELIMINADO: El header duplicado con el botón */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Mi Dirección
                </h2>
              </div>

              {loading && activeIndex === 1 ? (
                <div className="space-y-4">
                  <Skeleton width="100%" height="200px" />
                </div>
              ) : direccionData != null ? (
                <Card title="Dirección Registrada" className="shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-gray-600">
                        Tipo de calle
                      </label>
                      <p className="text-gray-800 capitalize">
                        {tiposCalle.find(
                          (t) => t.value === direccionData.tipo_calle
                        )?.label || direccionData.tipo_calle}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">
                        Calle/Avenida
                      </label>
                      <p className="text-gray-800">
                        {direccionData.nombre_calle}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">
                        Número
                      </label>
                      <p className="text-gray-800">{direccionData.numero}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">
                        Zona
                      </label>
                      <p className="text-gray-800">
                        {direccionData.zona || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">
                        Código Postal
                      </label>
                      <p className="text-gray-800">
                        {direccionData.codigo_postal || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">
                        Ubicación
                      </label>
                      <p className="text-gray-800">
                        {direccionData.ubigeo
                          ? `${direccionData.ubigeo.departamento} - ${direccionData.ubigeo.provincia} - ${direccionData.ubigeo.distrito}`
                          : 'No especificado'}
                      </p>
                    </div>
                    {direccionData.referencia && (
                      <div className="md:col-span-2">
                        <label className="font-semibold text-gray-600">
                          Referencia
                        </label>
                        <p className="text-gray-800">
                          {direccionData.referencia}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Botón de editar cuando SÍ hay dirección */}
                  <div className="flex justify-end mt-6">
                    <Button
                      label="Editar Dirección"
                      icon="pi pi-pencil"
                      className="p-button-outlined p-button-sm"
                      onClick={abrirDireccionDialog}
                    />
                  </div>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <i className="pi pi-map-marker text-6xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No tienes dirección registrada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Para completar tu perfil, necesitamos que agregues tu
                    dirección
                  </p>
                  <Button
                    label="Agregar Dirección"
                    icon="pi pi-plus"
                    onClick={abrirDireccionDialog}
                  />
                </Card>
              )}
            </div>
          </TabPanel>
          {/* ... otros tabs sin cambios ... */}
        </TabView>
      </div>

      {/* Diálogo de edición */}
      <Dialog
        header={`Editar ${getFieldLabel(editField)}`}
        visible={editDialog}
        style={{ width: '450px' }}
        onHide={() => setEditDialog(false)}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setEditDialog(false)}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              loading={saving}
              onClick={guardarCambios}
              disabled={editValue === obtenerValorActual(editField)}
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="mb-3">
            <label className="font-semibold text-gray-600">Valor actual:</label>
            <p className="text-gray-800 bg-gray-50 p-2 rounded mt-1">
              {obtenerValorActual(editField) || 'No especificado'}
            </p>
          </div>

          <label htmlFor="editValue" className="block font-semibold mb-2">
            Nuevo valor:
          </label>
          <InputText
            id="editValue"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            type={getInputType(editField)}
            placeholder={getPlaceholder(editField)}
          />
          <small className="text-gray-500 mt-2 block">
            {editField.includes('telefono') &&
              'Formato: 9 dígitos comenzando con 9'}
            {editField.includes('correo') && 'Formato: ejemplo@correo.com'}
            {editField.includes('correo_electronico_secundario') &&
              ' - No puede ser igual al correo principal'}
            {editField.includes('correo_electronico_personal') &&
              ' - No puede ser igual al correo secundario'}
            {editField.includes('numero_telefono_secundario') &&
              ' - No puede ser igual al teléfono principal'}
            {editField.includes('numero_telefono_personal') &&
              ' - No puede ser igual al teléfono secundario'}
          </small>

          {/* Mostrar advertencias para todas las combinaciones posibles */}
          {editField === 'persona.correo_electronico_personal' &&
            editValue === perfilData?.persona.correo_electronico_secundario && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <i className="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                <span className="text-yellow-700 text-sm">
                  El correo principal no puede ser igual al secundario
                </span>
              </div>
            )}

          {editField === 'persona.correo_electronico_secundario' &&
            editValue === perfilData?.persona.correo_electronico_personal && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <i className="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                <span className="text-yellow-700 text-sm">
                  El correo secundario no puede ser igual al principal
                </span>
              </div>
            )}

          {editField === 'persona.numero_telefono_personal' &&
            editValue === perfilData?.persona.numero_telefono_secundario && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <i className="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                <span className="text-yellow-700 text-sm">
                  El teléfono principal no puede ser igual al secundario
                </span>
              </div>
            )}

          {editField === 'persona.numero_telefono_secundario' &&
            editValue === perfilData?.persona.numero_telefono_personal && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <i className="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                <span className="text-yellow-700 text-sm">
                  El teléfono secundario no puede ser igual al principal
                </span>
              </div>
            )}
        </div>
      </Dialog>

      {/* Diálogo para editar/agregar dirección */}
      <Dialog
        header={direccionData ? 'Editar Dirección' : 'Agregar Dirección'}
        visible={direccionDialog}
        style={{ width: '750px' }}
        onHide={() => setDireccionDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text p-button-secondary"
              onClick={() => setDireccionDialog(false)}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              loading={guardandoDireccion}
              onClick={guardarDireccionUsuario}
              className="p-button-primary"
            />
          </div>
        }
      >
        <div className="p-fluid mt-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Fila 1: Tipo de calle, Nombre de calle y Número */}
            <div className="md:col-span-3">
              <label
                htmlFor="tipo_calle"
                className="font-semibold block mb-2 required-field"
              >
                Tipo de calle
              </label>
              <Dropdown
                id="tipo_calle"
                value={direccionForm.tipo_calle}
                onChange={(e) =>
                  setDireccionForm({ ...direccionForm, tipo_calle: e.value })
                }
                options={tiposCalle}
                optionLabel="label"
                placeholder="Seleccione tipo"
                className="w-full"
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="nombre_calle"
                className="font-semibold block mb-2 required-field"
              >
                Nombre de calle
              </label>
              <InputText
                id="nombre_calle"
                value={direccionForm.nombre_calle}
                onChange={(e) =>
                  setDireccionForm({
                    ...direccionForm,
                    nombre_calle: e.target.value,
                  })
                }
                className="w-full"
                placeholder="Av. Ejemplo, Jr. Principal, etc."
              />
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor="numero"
                className="font-semibold block mb-2 required-field"
              >
                Número
              </label>
              <InputText
                id="numero"
                value={direccionForm.numero}
                onChange={(e) =>
                  setDireccionForm({ ...direccionForm, numero: e.target.value })
                }
                className="w-full"
                placeholder="123"
              />
            </div>

            {/* Fila 2: Zona y Código Postal */}
            <div className="md:col-span-8">
              <label htmlFor="zona" className="font-semibold block mb-2">
                Zona
              </label>
              <InputText
                id="zona"
                value={direccionForm.zona}
                onChange={(e) =>
                  setDireccionForm({ ...direccionForm, zona: e.target.value })
                }
                className="w-full"
                placeholder="Urbanización, Sector, etc."
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="codigo_postal"
                className="font-semibold block mb-2"
              >
                Código Postal
              </label>
              <InputText
                id="codigo_postal"
                value={direccionForm.codigo_postal}
                onChange={(e) =>
                  setDireccionForm({
                    ...direccionForm,
                    codigo_postal: e.target.value,
                  })
                }
                className="w-full"
                placeholder="15001"
              />
            </div>

            {/* Fila 3: Departamento, Provincia y Distrito */}
            <div className="md:col-span-4">
              <label
                htmlFor="departamento"
                className="font-semibold block mb-2 required-field"
              >
                Departamento
              </label>
              <Dropdown
                id="departamento"
                value={departamentoSeleccionado}
                onChange={(e) => {
                  setDepartamentoSeleccionado(e.value);
                  setProvinciaSeleccionada('');
                  setDistritos([]);
                  setDireccionForm({ ...direccionForm, codigo_ubigeo: '' });
                }}
                options={departamentos}
                optionLabel="departamento"
                optionValue="departamento"
                placeholder="Seleccione departamento"
                className="w-full"
                filter
                showClear
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="provincia"
                className="font-semibold block mb-2 required-field"
              >
                Provincia
              </label>
              <Dropdown
                id="provincia"
                value={provinciaSeleccionada}
                onChange={(e) => {
                  setProvinciaSeleccionada(e.value);
                  setDistritos([]);
                  setDireccionForm({ ...direccionForm, codigo_ubigeo: '' });
                }}
                options={provincias}
                optionLabel="provincia"
                optionValue="provincia"
                placeholder="Seleccione provincia"
                className="w-full"
                disabled={!departamentoSeleccionado}
                filter
                showClear
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="distrito"
                className="font-semibold block mb-2 required-field"
              >
                Distrito
              </label>
              <Dropdown
                id="distrito"
                value={direccionForm.codigo_ubigeo}
                onChange={(e) => onDistritoChange(e.value)}
                options={distritos}
                optionLabel="distrito"
                optionValue="codigo_ubigeo"
                placeholder="Seleccione distrito"
                className="w-full"
                disabled={!provinciaSeleccionada}
                filter
                showClear
              />
            </div>

            {/* Información del ubigeo seleccionado */}
            {direccionForm.codigo_ubigeo && (
              <div className="col-span-12">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <i className="pi pi-check-circle text-green-600 mr-2"></i>
                    <span className="text-green-700 font-semibold">
                      Ubicacicón seleccionado:
                    </span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    {(() => {
                      const distritoSeleccionado = distritos.find(
                        (d) => d.codigo_ubigeo === direccionForm.codigo_ubigeo
                      );
                      return distritoSeleccionado
                        ? `${distritoSeleccionado.departamento} - ${distritoSeleccionado.provincia} - ${distritoSeleccionado.distrito}`
                        : 'Cargando...';
                    })()}
                  </p>
                </div>
              </div>
            )}

            {/* Fila 4: Referencia */}
            <div className="col-span-12">
              <label htmlFor="referencia" className="font-semibold block mb-2">
                Referencia adicional
              </label>
              <InputTextarea
                id="referencia"
                value={direccionForm.referencia}
                onChange={(e) =>
                  setDireccionForm({
                    ...direccionForm,
                    referencia: e.target.value,
                  })
                }
                className="w-full"
                rows={3}
                placeholder="Cerca de..., frente a..., color de casa, punto de referencia, etc."
              />
            </div>

            {/* Nota de campos obligatorios */}
            <div className="col-span-12">
              <div className="flex items-center text-sm text-gray-500">
                <span className="required-asterisk mr-1">*</span>
                <span>Campos obligatorios</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <style>{`
        .vertical-tabview-container {
          display: flex;
          width: 100%;
          background: #ffffff;
          border-right: 2px solid #fd4c82;
          height: calc(100vh - 69px);
          min-height: calc(100vh - 69px);
        }
        
        .vertical-tabview {
          display: flex;
          width: 100%;
          height: 100%;
        }
        
        .vertical-tabview .p-tabview-nav {
          display: flex;
          flex-direction: column;
          width: 280px;
          background: #f8f9fa;
          height: 100%;
        }
        
        .vertical-tabview .p-tabview-nav-link {
          padding: 1rem 1.5rem;
          border: none !important;
          border-radius: 0;
          justify-content: flex-start;
          border-right: 3px solid transparent;
        }
        
        .vertical-tabview .p-tabview-nav-link:hover {
          background-color: #e9ecef;
        }
        
        .vertical-tabview .p-highlight .p-tabview-nav-link {
          background-color: #e9ecef;
          border-right-color: #fd4c82;
          color: #fd4c82;
        }
        
        .vertical-tabview .p-tabview-panels {
          flex: 1;
          background: white;
          height: 100%;
          overflow-y: auto;
        }
        
        .vertical-tabview .p-tabview-panel {
          padding: 0;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
