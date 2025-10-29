// ForgotPassword.tsx (Paso 1 - Solo email)
import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { requestPasswordReset } from '../service/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useRef<Toast>(null);

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 5000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 4000,
    });
  };

  const handleRequestReset = async () => {
    if (!email) {
      showError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      showSuccess(
        'Si el correo existe, recibirás un enlace de recuperación en unos minutos'
      );
      setEmailSent(true);
    } catch (error) {
      showError('Error al enviar el enlace de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Toast ref={toast} />

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-[#fd4c82]">
            Recuperar Contraseña
          </h2>
          <p className="text-sm mt-2 text-center">
            ¿Recordaste tu contraseña?{' '}
            <a
              href="/login"
              className="font-bold text-[#fd4c82] hover:underline"
            >
              Inicia sesión
            </a>
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!emailSent ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Recuperación de Contraseña
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ingresa tu correo para recibir un enlace seguro
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Correo electrónico
                  </label>
                  <InputText
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Enlace seguro:</strong> Te enviaremos un enlace de
                    un solo uso que expira en 1 hora.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  label="Enviar Enlace"
                  icon={<ArrowRight className="w-4 h-4 ml-2" />}
                  onClick={handleRequestReset}
                  loading={loading}
                  disabled={!email}
                  className="bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white px-5 py-3"
                />
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="font-semibold text-gray-800 text-xl">
                Enlace Enviado
              </h3>

              <p className="text-gray-600 text-sm">
                Si el correo <span className="font-semibold">{email}</span>{' '}
                existe en nuestro sistema, recibirás un enlace de recuperación.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Importante:</strong> El enlace es de un solo uso y
                  expira en 1 hora.
                </p>
              </div>

              <div className="flex gap-3 justify-center mt-6">
                <Button
                  label="Reenviar Enlace"
                  onClick={handleRequestReset}
                  loading={loading}
                  className="border-[#fd4c82] text-[#fd4c82] border px-4 py-2"
                  outlined
                />

                <Button
                  label="Volver al Login"
                  onClick={() => (window.location.href = '/login')}
                  className="bg-[#fd4c82] hover:bg-[#e63b6f] border-none text-white px-4 py-2"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;
