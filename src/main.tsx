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
createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </PrimeReactProvider>
);
