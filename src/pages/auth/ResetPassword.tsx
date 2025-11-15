// ResetPassword.tsx
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { motion } from 'framer-motion';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { verifyResetToken, resetPassword } from '../../service/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [step, setStep] = useState<'verifying' | 'form' | 'success'>(
    'verifying'
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toast = useRef<Toast>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 4000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
    });
  };

  // Verificar el token cuando el componente se monta
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setTokenValid(false);
        showError('Enlace inválido o incompleto');
        return;
      }

      try {
        // Necesitas crear este endpoint en el backend
        const response = await verifyResetToken(email, token);
        setTokenValid(response.valid);
        if (response.valid) {
          setStep('form');
        } else {
          showError(response.message || 'Enlace inválido o expirado');
        }
      } catch (error) {
        setTokenValid(false);
        showError('Error al verificar el enlace');
      }
    };

    verifyToken();
  }, [token, email]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showError('Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      showError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email!, token!, newPassword, confirmPassword);
      setStep('success');
      showSuccess('Contraseña restablecida correctamente');
    } catch (error) {
      showError(
        'Error al restablecer la contraseña. El enlace puede haber expirado o ya haber sido usado.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verifying') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Toast ref={toast} />
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-md text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#fd4c82] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Toast ref={toast} />
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-xl mb-2">
            Enlace Inválido
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Este enlace de recuperación ha expirado o ya ha sido utilizado.
          </p>
          <Button
            label="Solicitar Nuevo Enlace"
            onClick={() => navigate('/forgot-password')}
            className="bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white px-4 py-2"
          />
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Toast ref={toast} />
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-md text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>

          <h3 className="font-semibold text-gray-800 text-2xl mb-2 flex items-center justify-center gap-2">
            ¡Contraseña Actualizada!
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </h3>

          <p className="text-gray-600 text-sm mb-6">
            Tu contraseña ha sido restablecida correctamente. Ahora puedes
            iniciar sesión con tu nueva contraseña.
          </p>

          <Button
            label="Iniciar Sesión"
            onClick={() => navigate('/login')}
            className="bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white px-5 py-3 w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Toast ref={toast} />

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-[#fd4c82]">
            Nueva Contraseña
          </h2>
          <p className="text-sm mt-2 text-center text-gray-600">
            Crea una nueva contraseña para tu cuenta
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 text-center">
              <strong>✓ Enlace verificado</strong>
              <br />
              Establece tu nueva contraseña
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Nueva contraseña
              </label>
              <InputText
                placeholder="Mínimo 8 caracteres"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                Confirmar contraseña
              </label>
              <InputText
                placeholder="Repite tu contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              label="Volver"
              icon={<ArrowLeft className="w-4 h-4 mr-2" />}
              onClick={() => navigate('/login')}
              className="border-[#fd4c82] text-[#fd4c82] border px-4 py-2 flex-1"
              outlined
            />

            <Button
              label="Restablecer"
              onClick={handleResetPassword}
              loading={loading}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              className="bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white px-4 py-2 flex-1"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;
