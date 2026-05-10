// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  const sidebarId = "main-drawer";
  
  return (
    <div className="drawer lg:drawer-open">
      <input id={sidebarId} type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen bg-[#efedf7]">
        <Navbar sidebarId={sidebarId} />
        <main className="flex-1 pl-10 pr-10">
          <Outlet />
        </main>
      </div>
      
      <Sidebar sidebarId={sidebarId} />
    </div>
  );
}

export default Layout;