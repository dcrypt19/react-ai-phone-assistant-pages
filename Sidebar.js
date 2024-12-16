// src/pages/telephone/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ClipboardListIcon, ViewGridIcon } from "@heroicons/react/solid";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Historial de Llamadas",
      path: "/app/historial",
      icon: ClipboardListIcon,
    },
    {
      name: "Dashboard",
      path: "/app/dashboard",
      icon: ViewGridIcon,
    },
  ];

  return (
    <div className="w-64 h-full bg-white shadow-md">
      <div className="p-4 text-2xl font-bold text-blue-600 flex items-center">
        {/* <img
          src="../assets/images/LogoBBUKZ.png"
          alt="Logo"
          className="h-8 w-auto mr-2"
        /> */}
        Asistente Virtual
      </div>
      <nav className="mt-10">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className={`flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 ${
              location.pathname === item.path ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="mx-4">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
