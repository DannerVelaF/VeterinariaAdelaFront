import { TabMenu } from 'primereact/tabmenu';
import React from 'react';

export default function Perfil() {
  const barraLateroal = [
    { label: 'Mi Perfil', icon: 'pi pi-user', url: '/perfil' },
    { label: 'Mis Pedidos', icon: 'pi pi-shopping-bag', url: '/pedidos' },
    { label: 'Direcciones', icon: 'pi pi-map-marker', url: '/direcciones' },
    { label: 'Mis Mascotas', icon: 'pi pi-heart', url: '/mascotas' },
  ];

  return <div>
    <TabMenu model={barraLateroal} />
  </div>;
}
