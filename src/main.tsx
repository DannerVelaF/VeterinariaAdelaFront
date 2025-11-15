import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router';
import { Routes } from 'react-router';
import Landing from './pages/landing/Landing';
import './App.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Home from './pages/ecommerce/home/Home';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Productos from './pages/ecommerce/products/Productos';
import Perfil from './pages/ecommerce/profile/Perfil';
import LayoutRoute from './pages/ecommerce/components/LayoutRoute';
import Checkout from './pages/ecommerce/Checkout/Checkout ';
import ProcesarPago from './pages/ecommerce/Checkout/ProcesarPago ';
import ConfirmacionPedido from './pages/ecommerce/Checkout/ConfirmacionPedido ';

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <BrowserRouter>
      <LayoutRoute>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/olvideMiContrasena"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/inicio"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <PrivateRoute>
                <Productos />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/procesar-pago"
            element={
              <PrivateRoute>
                <ProcesarPago />
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmacion-pedido"
            element={
              <PrivateRoute>
                <ConfirmacionPedido />
              </PrivateRoute>
            }
          />
        </Routes>
      </LayoutRoute>
    </BrowserRouter>
  </PrimeReactProvider>
);
