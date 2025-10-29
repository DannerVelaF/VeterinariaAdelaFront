import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router';
import { Routes } from 'react-router';
import Landing from './landing/Landing';
import './App.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Home from './ecommerce/home/Home';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Productos from './ecommerce/products/Productos';

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <BrowserRouter>
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
        <Route path="/registro" element={<Register />} />
        <Route path="/olvideMiContrasena" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/productos" element={<Productos />} />
        <Route
          path="/inicio"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </PrimeReactProvider>
);
