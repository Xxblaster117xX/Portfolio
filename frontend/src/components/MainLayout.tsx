// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import '../styles/MainLyout.css';

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
