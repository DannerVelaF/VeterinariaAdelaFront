import { useEffect, useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputOtp } from 'primereact/inputotp';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { motion, AnimatePresence } from 'framer-motion';

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
interface TipoDocumento {
  id_tipo_documento: number;
  nombre_tipo_documento: string;
}

function Register() {
  const stepperRef = useRef<Stepper | null>(null);

  // Estados generales
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tipoSeleccionado, setTipoSeleccionado] = useState<any>(null);
  const [token, setToken] = useState<string | null>('');
  const [code, setCode] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const toast = useRef<Toast | null>(null);

  const showToast = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Registro exitoso',
      detail: 'Tu cuenta ha sido creada exitosamente',
      life: 3000,
    });
  };

  const [formData, setFormData] = useState({
    id_tipo_documento: tipoSeleccionado?.id_tipo_documento,
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
    fechaNacimiento: null,
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
    getTipoDocumento().then((response) => {
      if (response) {
        setTiposDocumento(
          response.map((tipo: TipoDocumento) => ({
            label: tipo.nombre_tipo_documento,
            value: tipo.id_tipo_documento,
          }))
        );
      }
    });
  }, []);

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimeout]);

  const enviarCodigo = async (correo: string) => {
    const response = await enviarCodigoVerificacion(correo);
    setCode(response.code);
  };

  // Input genérico
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const submit = async () => {
    const data = {
      ...formData,
      id_tipo_documento: tipoSeleccionado, // ✅ ya es el ID directamente
      fechaNacimiento: formData.fechaNacimiento
        ? new Date(formData.fechaNacimiento).toISOString().split('T')[0]
        : null,
    };

    const response = await registrarUsuario(data);
    if (response) {
      showToast();
    }
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
            <a href="/login" className=" font-bold text-[#fd4c82]">
              Inicia sesión
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Completa tu información en 3 simples pasos
          </p>
        </div>

        <Stepper ref={stepperRef} headerPosition="bottom" className="w-full">
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
                    options={tiposDocumento}
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
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 ">
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
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    Fecha de nacimiento
                  </label>
                  <Calendar
                    placeholder="Selecciona"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleChange('fechaNacimiento', e.value)}
                    className="w-full"
                  />
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
                disabled={
                  !tipoSeleccionado ||
                  !formData.numeroDocumento ||
                  !formData.nombre ||
                  !formData.apellidoPaterno ||
                  !formData.apellidoMaterno ||
                  !formData.sexo ||
                  !formData.nacionalidad ||
                  !formData.fechaNacimiento
                }
                onClick={() => {
                  stepperRef.current?.nextCallback();
                }}
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
                    onChange={(e) => handleChange('contrasena', e.target.value)}
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
                    onChange={(e) => handleChange('confirmar', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
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
                disabled={
                  !formData.correo ||
                  !formData.telefono ||
                  !formData.usuario ||
                  !formData.contrasena ||
                  !formData.confirmar
                }
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                Siguiente
              </button>
            </div>
          </StepperPanel>

          {/* PASO 4: CONFIRMACIÓN DE CORREO */}
          <StepperPanel header="Confirmar correo">
            <div className="flex flex-col items-center space-y-6 ">
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
                  {formData.correo || 'tu-correo@ejemplo.com'}
                </p>
              </div>

              <div className="w-full max-w-md flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  Código de verificación
                </label>
                <InputOtp
                  value={token}
                  onChange={(e) => setToken(String(e.value || ''))}
                  length={6}
                  style={{ gap: 8 }}
                  className="justify-center"
                />
                {token && token.length === 6 && token != code && (
                  <p className="text-red-500 text-sm mt-2">
                    El código ingresado no es correcto
                  </p>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex flex-col sm:flex-row  w-full justify-center items-center gap-10">
                <button
                  className={`flex gap-2 items-center justify-center font-bold ${
                    resendTimeout > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#fd4c82]'
                  }`}
                  onClick={() => {
                    if (resendTimeout === 0) {
                      enviarCodigo(formData.correo);
                      setResendTimeout(60); // inicia el contador de 1 min
                    }
                  }}
                  disabled={resendTimeout > 0}
                >
                  <RotateCw
                    className={`w-4 h-4 mr-2 ${
                      resendTimeout > 0
                        ? 'animate-spin text-gray-400'
                        : 'text-[#fd4c82]'
                    }`}
                  />
                  {resendTimeout > 0
                    ? `Reenviar en ${resendTimeout}s`
                    : 'Reenviar código'}
                </button>

                <button
                  onClick={() => {
                    stepperRef.current?.nextCallback();
                    submit();
                  }}
                  className={`flex gap-2 bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white items-center justify-center rounded-lg px-5 py-3 ${
                    code != token ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={code != token}
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
                {/* Círculo animado de éxito */}
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

                {/* Título y descripción */}
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
                    <span className="font-semibold">5 segundos...</span>
                  </p>
                </motion.div>

                {/* Efecto de brillo de fondo */}
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
  );
}

export default Register;
