import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import Logo from '../assets/images/logo.jpg';
import Bg from '../assets/images/loginImage.jpg';
import { login } from '../service/api';
import { Toast } from 'primereact/toast';
function Login() {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [contraseña, setContraseña] = useState('');
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);
  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  const toast = useRef<Toast | null>(null);

  const showToast = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Login exitoso',
      detail: 'has iniciado sesión con éxito',
      life: 3000,
    });
  };

  const showErrorToast = () => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error al iniciar sesión',
      detail: 'Verifique su correo y contraseña',
      life: 3000,
    });
  };

  const submit = async () => {
    setLoading(true);
    try {
      const data = {
        correo: correo,
        contrasena: contraseña,
      };

      const response = await login(data);

      if (response) {
        showToast();
        
        setLoading(false); // Quitar loading inmediatamente
      }
    } catch (error: any) {
      setLoading(false);
      showErrorToast();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Toast ref={toast} />
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
        <div className="md:w-4xl p-10 md:p-20 flex justify-center flex-col gap-5">
          <Image src={Logo} alt="Logo" width="100" height="100" />
          <div className="space-y-2">
            <p className="font-medium">Bienvenido de vuelta</p>
            <p className="flex gap-2 text-sm">
              No tienes una cuenta?
              <a
                href="/registro"
                className="text-[#fd4c82] hover:font-bold transition-all ease-in-out"
              >
                Regístrate ahora!
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="correo" className="text-sm">
                Correo electrónico
              </label>
              <InputText
                id="correo"
                placeholder="Correo electrónico"
                className="p-inputtext-sm"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label htmlFor="contraseña" className="text-sm">
                Contraseña
              </label>
              <InputText
                id="contraseña"
                type={mostrarContraseña ? 'text' : 'password'}
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="p-inputtext-sm"
              />
              <button
                type="button"
                onClick={toggleMostrarContraseña}
                className="absolute right-3 bottom-[10px] text-gray-500 hover:text-[#fd4c82] transition-colors"
              >
                <i
                  className={`pi ${
                    mostrarContraseña ? 'pi-eye-slash' : 'pi-eye'
                  }`}
                ></i>
              </button>
            </div>
            <div className="text-end">
              <a
                href="/olvideMiContrasena"
                className="text-gray-400 hover:font-medium transition-all ease-in-out text-sm"
              >
                Olvidaste tu contraseña?
              </a>
            </div>
            <div>
              <Button
                label="Iniciar sesión"
                style={{ backgroundColor: '#fd4c82', border: 'none' }}
                className="text-white"
                size="small"
                onClick={submit}
                loading={loading}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block relative">
          <img
            src={Bg}
            alt="Login"
            className="w-full h-full object-cover object-center rounded-l-3xl"
          />
          <div className="absolute inset-0 bg-black/20 rounded-l-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
