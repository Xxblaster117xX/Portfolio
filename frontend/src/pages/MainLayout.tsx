// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import '../styles/MainLyout.css';

// Para establecer el sidebar y el contenido principal
export default function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-contentSidebar">
        <Outlet />
      </div>
    </div>
  );
}
