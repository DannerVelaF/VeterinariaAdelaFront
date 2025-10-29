import { useEffect, useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputOtp } from 'primereact/inputotp';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from 'primereact/message';

import {
  User,
  FileText,
  Hash,
  Users,
  MapPin,
  Mail,
  Phone,
  UserCircle,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import {
  getTipoDocumento,
  enviarCodigoVerificacion,
  registrarUsuario,
} from '../service/api';
import { useAuthStore } from '../store/UserStore';
import { useNavigate } from 'react-router';

interface TipoDocumento {
  id_tipo_documento: number;
  nombre_tipo_documento: string;
}

function Register() {
  const stepperRef = useRef<any>(null);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  // Estados generales
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState<string>('');
  const [codigoIngresado, setCodigoIngresado] = useState<string>('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [fechaInvalida, setFechaInvalida] = useState(false);
  const [contrasenasCoinciden, setContrasenasCoinciden] = useState(true);

  const tokenF = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    id_tipo_documento: null as number | null,
    numeroDocumento: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    sexo: '',
    nacionalidad: '',
    correo: '',
    telefono: '',
    usuario: '',
    contrasena: '',
    confirmar: '',
    fechaNacimiento: null as Date | null,
    // Campos de dirección
    zona: '',
    tipoCalle: '',
    nombreCalle: '',
    numero: '',
    codigoPostal: '',
    referencia: '',
    departamento: '',
    provincia: '',
    distrito: '',
    codigoUbigeo: '',
  });

  const sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'Otro' },
  ];

  useEffect(() => {
    if (tokenF) {
      navigate('/inicio', { replace: true });
    }
  }, [tokenF, navigate]);

  useEffect(() => {
    getTipoDocumento().then((response) => {
      if (response) {
        setTiposDocumento(response);
      }
    });
  }, []);

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimeout]);

  const showToast = (
    severity: 'success' | 'error',
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const enviarCodigo = async (correo: string) => {
    try {
      const response = await enviarCodigoVerificacion(correo);
      setCodigoVerificacion(response.code);
      setResendTimeout(60);
      showToast(
        'success',
        'Código enviado',
        'Se ha enviado un código de verificación a tu correo'
      );
    } catch (error) {
      showToast(
        'error',
        'Error',
        'No se pudo enviar el código de verificación'
      );
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validar coincidencia de contraseñas
    if (field === 'contrasena' || field === 'confirmar') {
      const nuevaContrasena =
        field === 'contrasena' ? value : formData.contrasena;
      const nuevaConfirmacion =
        field === 'confirmar' ? value : formData.confirmar;
      setContrasenasCoinciden(nuevaContrasena === nuevaConfirmacion);
    }
  };

  const submit = async () => {
    try {
      const data = {
        ...formData,
        id_tipo_documento: tipoSeleccionado,
        fechaNacimiento: formData.fechaNacimiento
          ? new Date(formData.fechaNacimiento as Date)
              .toISOString()
              .split('T')[0]
          : null,
      };

      const response = await registrarUsuario(data);
      if (response) {
        showToast(
          'success',
          'Registro exitoso',
          'Tu cuenta ha sido creada exitosamente'
        );
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      showToast('error', 'Error', 'No se pudo completar el registro');
    }
  };

  const verificarFecha = (fecha: Date | null) => {
    if (!fecha) {
      setFechaInvalida(true);
      return;
    }

    const hoy = new Date();
    const fechaNacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }

    setFechaInvalida(edad < 18);
  };

  const isPaso1Valido = () => {
    return (
      tipoSeleccionado &&
      formData.numeroDocumento.trim() &&
      formData.nombre.trim() &&
      formData.apellidoPaterno.trim() &&
      formData.apellidoMaterno.trim() &&
      formData.sexo &&
      formData.nacionalidad.trim() &&
      formData.fechaNacimiento &&
      !fechaInvalida
    );
  };

  const isPaso2Valido = () => {
    return (
      formData.correo.trim() &&
      formData.telefono.trim() &&
      formData.usuario.trim() &&
      formData.contrasena.trim() &&
      formData.confirmar.trim() &&
      contrasenasCoinciden
    );
  };

  const isPaso3Valido = () => {
    return (
      codigoIngresado.length === 6 && codigoIngresado === codigoVerificacion
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Toast ref={toast} />
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-[95%] md:w-[70%] max-w-3xl">
        {/* Header con logo */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-[#fd4c82]">
            Registro de Usuario
          </h2>
          <p className="text-sm">
            Ya tienes una cuenta?{' '}
            <a href="/login" className="font-bold text-[#fd4c82]">
              Inicia sesión
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Completa tu información en 3 simples pasos
          </p>
        </div>

        <div>
          <Stepper
            ref={stepperRef}
            headerPosition="bottom"
            className="w-full"
            linear
          >
            {/* PASO 1: DATOS PERSONALES */}
            <StepperPanel header="Datos personales">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Información Personal
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ingresa tus datos personales
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de documento */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Tipo de documento
                    </label>
                    <Dropdown
                      placeholder="Selecciona un tipo"
                      options={tiposDocumento.map((tipo) => ({
                        label: tipo.nombre_tipo_documento,
                        value: tipo.id_tipo_documento,
                      }))}
                      value={tipoSeleccionado}
                      onChange={(e) => setTipoSeleccionado(e.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Número de documento */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      Número de documento
                    </label>
                    <InputText
                      placeholder="Ej: 12345678"
                      value={formData.numeroDocumento}
                      onChange={(e) =>
                        handleChange('numeroDocumento', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Nombre */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Nombre
                    </label>
                    <InputText
                      placeholder="Ingresa tu nombre"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Apellido paterno */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Apellido paterno
                    </label>
                    <InputText
                      placeholder="Apellido paterno"
                      value={formData.apellidoPaterno}
                      onChange={(e) =>
                        handleChange('apellidoPaterno', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Apellido materno */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Apellido materno
                    </label>
                    <InputText
                      placeholder="Apellido materno"
                      value={formData.apellidoMaterno}
                      onChange={(e) =>
                        handleChange('apellidoMaterno', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Sexo */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      Sexo
                    </label>
                    <Dropdown
                      placeholder="Selecciona"
                      options={sexoOptions}
                      value={formData.sexo}
                      onChange={(e) => handleChange('sexo', e.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Fecha de nacimiento */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      Fecha de nacimiento
                    </label>
                    <Calendar
                      placeholder="Selecciona"
                      value={formData.fechaNacimiento}
                      onChange={(e) => {
                        const fecha = e.value instanceof Date ? e.value : null;
                        handleChange('fechaNacimiento', fecha);
                        verificarFecha(fecha);
                      }}
                      className="w-full"
                    />
                    {fechaInvalida && (
                      <Message
                        severity="error"
                        text="Debes ser mayor de 18 años para registrarte"
                        className="w-full text-xs"
                      />
                    )}
                  </div>

                  {/* Nacionalidad */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Nacionalidad
                    </label>
                    <InputText
                      placeholder="Ej: Peruana"
                      value={formData.nacionalidad}
                      onChange={(e) =>
                        handleChange('nacionalidad', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  disabled={!isPaso1Valido()}
                  onClick={() => stepperRef.current?.nextCallback()}
                  className="disabled:opacity-50 flex gap-2 bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white items-center justify-center rounded-lg px-5 py-3"
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  Siguiente
                </button>
              </div>
            </StepperPanel>

            {/* PASO 2: DATOS DE CUENTA */}
            <StepperPanel header="Cuenta de usuario">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Credenciales de Acceso
                    </h3>
                    <p className="text-xs text-gray-500">
                      Configura tu cuenta de usuario
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Correo */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Correo electrónico
                    </label>
                    <InputText
                      placeholder="correo@ejemplo.com"
                      type="email"
                      value={formData.correo}
                      onChange={(e) => handleChange('correo', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      Teléfono
                    </label>
                    <InputText
                      placeholder="999 999 999"
                      value={formData.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Usuario */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      Nombre de usuario
                    </label>
                    <InputText
                      placeholder="Ej: usuario123"
                      value={formData.usuario}
                      onChange={(e) => handleChange('usuario', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-500" />
                      Contraseña
                    </label>
                    <InputText
                      placeholder="••••••••"
                      type="password"
                      value={formData.contrasena}
                      onChange={(e) =>
                        handleChange('contrasena', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gray-500" />
                      Confirmar contraseña
                    </label>
                    <InputText
                      placeholder="••••••••"
                      type="password"
                      value={formData.confirmar}
                      onChange={(e) =>
                        handleChange('confirmar', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {!contrasenasCoinciden && (
                  <Message
                    severity="error"
                    text="Las contraseñas no coinciden"
                    className="w-full"
                  />
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => stepperRef.current?.prevCallback()}
                  className="flex gap-2 border-[#fd4c82] text-[#fd4c82] border items-center justify-center rounded-lg px-5 py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </button>

                <button
                  onClick={() => {
                    enviarCodigo(formData.correo);
                    stepperRef.current?.nextCallback();
                  }}
                  className="disabled:opacity-50 flex gap-2 bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white items-center justify-center rounded-lg px-5 py-3"
                  disabled={!isPaso2Valido()}
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  Siguiente
                </button>
              </div>
            </StepperPanel>

            {/* PASO 3: CONFIRMACIÓN DE CORREO */}
            <StepperPanel header="Confirmar correo">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    Verifica tu correo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Hemos enviado un código de verificación a:
                  </p>
                  <p className="font-semibold text-blue-600 mt-1">
                    {formData.correo}
                  </p>
                </div>

                <div className="w-full max-w-md flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                    Código de verificación
                  </label>
                  <InputOtp
                    value={codigoIngresado}
                    onChange={(e) => setCodigoIngresado(String(e.value || ''))}
                    length={6}
                    style={{ gap: 8 }}
                    className="justify-center"
                  />
                  {codigoIngresado.length === 6 &&
                    codigoIngresado !== codigoVerificacion && (
                      <Message
                        severity="error"
                        text="El código ingresado no es correcto"
                        className="mt-2"
                      />
                    )}
                </div>

                <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4">
                  <button
                    className={`flex gap-2 items-center justify-center font-bold ${
                      resendTimeout > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#fd4c82]'
                    }`}
                    onClick={() => {
                      if (resendTimeout === 0) {
                        enviarCodigo(formData.correo);
                      }
                    }}
                    disabled={resendTimeout > 0}
                  >
                    <RotateCw
                      className={`w-4 h-4 mr-2 ${
                        resendTimeout > 0 ? 'animate-spin' : ''
                      }`}
                    />
                    {resendTimeout > 0
                      ? `Reenviar en ${resendTimeout}s`
                      : 'Reenviar código'}
                  </button>

                  <button
                    onClick={() => {
                      if (isPaso3Valido()) {
                        stepperRef.current?.nextCallback();
                        submit();
                      }
                    }}
                    className={`flex gap-2 bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white items-center justify-center rounded-lg px-5 py-3 ${
                      !isPaso3Valido() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!isPaso3Valido()}
                  >
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                    Confirmar registro
                  </button>
                </div>
              </div>

              <div className="flex justify-start mt-8">
                <button
                  onClick={() => stepperRef.current?.prevCallback()}
                  className="flex gap-2 border-[#fd4c82] text-[#fd4c82] border items-center justify-center rounded-lg px-5 py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </button>
              </div>
            </StepperPanel>

            {/* PASO 4: REGISTRO EXITOSO */}
            <StepperPanel header="Registro exitoso">
              <AnimatePresence mode="wait">
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center space-y-6 min-h-[60vh]"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: 'backOut' }}
                    className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-md"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-green-400"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{
                        delay: 0.4,
                        duration: 1.2,
                        repeat: Infinity,
                        repeatDelay: 1.2,
                      }}
                    />
                    <CheckCircle2 className="w-10 h-10 text-green-600 z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <h3 className="font-semibold text-gray-800 text-2xl mb-2 flex items-center justify-center gap-2">
                      Registro exitoso
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Tu cuenta ha sido creada correctamente.
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Serás redirigido en{' '}
                      <span className="font-semibold">3 segundos...</span>
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="absolute top-1/3 blur-3xl bg-green-300/40 w-60 h-60 rounded-full"
                  ></motion.div>
                </motion.div>
              </AnimatePresence>
            </StepperPanel>
          </Stepper>
        </div>
      </div>
    </div>
  );
}

export default Register;
