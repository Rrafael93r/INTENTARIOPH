"use client"

import type React from "react"
import {
  IconLayoutDashboard,
  IconReport,
  IconBuildingStore,
  IconTruckDelivery,
  IconRouter,
  IconSend,
  IconDeviceDesktop,
  IconMouse,
  IconKeyboard,
  IconDeviceLaptop,
  IconUsb,
  IconSnowflake,
  IconUsers,
  IconUserCircle,
  IconCategory,
  IconTag,
  IconDevicesPc,
  IconDeviceDesktopX,
  IconPrinter,
  IconListCheck
} from "@tabler/icons-react";
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import CoralLogo from "../../assets/icons8-controlar-100.png"
import { getCurrentUser } from "../../servicios/authServices"
import { logout } from "../../servicios/authServices"

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [user, setUser] = useState({ username: "", roleId: 0 })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const getRoleName = (roleId: number) => {
    const roles: Record<number, string> = {
      1: "Administrador",
      2: "Tecnico",
      3: "Reportador",
    }
    return roles[roleId] || "Desconocido"
  }

  const sections = [
    {
      heading: "INICIO",
      items: [
        {
          label: "Dashboard ",
          icon: IconLayoutDashboard,
          path: "/Inicio",
          rolesAllowed: [1, 2],
        }
      ],
    },
    {
      heading: "INTERNET",
      items: [
        {
          label: "Reportes",
          icon: IconReport,
          path: "/reportes",
          rolesAllowed: [1, 2],
        },
        {
          label: "Farmacias",
          icon: IconBuildingStore,
          path: "/farmacias",
          rolesAllowed: [1],
        },
        {
          label: "Proveedores",
          icon: IconTruckDelivery,
          path: "/proveedores",
          rolesAllowed: [1],
        },
      ],
    },
    {
      heading: "CONTINGENCIA",
      items: [
        {
          label: "Modems",
          icon: IconRouter,
          path: "/modems",
          rolesAllowed: [1, 2],
        },
        {
          label: "Envios",
          icon: IconSend,
          path: "/EnvioModems",
          rolesAllowed: [1, 2],
        },
      ],
    },
    {
      heading: "INVENTARIO",
      items: [
        {
          label: "Monitores",
          icon: IconDeviceDesktop,
          path: "/Monitores",
          rolesAllowed: [1, 2],
        },
        {
          label: "Periféricos",
          icon: IconKeyboard,
          path: "/perifericos",
          rolesAllowed: [1, 2],
        },
        {
          label: "Portatiles",
          icon: IconDeviceLaptop,
          path: "/Portatiles",
          rolesAllowed: [1, 2],
        },
        {
          label: "Computador de escritorio",
          icon: IconDevicesPc,
          path: "/PcEscritorio",
          rolesAllowed: [1, 2],
        },
        {
          label: "Impresoras",
          icon: IconPrinter,
          path: "/Impresoras",
          rolesAllowed: [1, 2],
        },
        {
          label: "Impresoras Pos",
          icon: IconPrinter,
          path: "/ImpresorasPos",
          rolesAllowed: [1, 2],
        },
      ],
    },
    {
      heading: "DOCUMENTACION",
      items: [
        {
          label: "Actas",
          icon: IconReport,
          path: "/actas",
          rolesAllowed: [1, 2],
        },
        {
          label: "Equipos de baja",
          icon: IconDeviceDesktopX,
          path: "/equipos-de-baja",
          rolesAllowed: [1, 2],
        },
      ],
    },
    {
      heading: "ADMINISTRACION",
      items: [
        {
          label: "Usuarios",
          icon: IconUsers,
          path: "/usuarios",
          rolesAllowed: [1],
        },
        {
          label: "Funcionarios",
          icon: IconUserCircle,
          path: "/Funcionarios",
          rolesAllowed: [1],
        },
        {
          label: "Áreas",
          icon: IconCategory,
          path: "/Areas",
          rolesAllowed: [1],
        },
        {
          label: "Marcas",
          icon: IconTag,
          path: "/Marcas",
          rolesAllowed: [1],
        },
        {
          label: "Estados",
          icon: IconListCheck,
          path: "/Estados",
          rolesAllowed: [1],
        },
      ],
    },

  ]


  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.rolesAllowed || item.rolesAllowed.includes(user.roleId)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 transition-all duration-300">
      <header className="flex items-center p-4 border-b border-gray-100">
        <img
          src={CoralLogo || "/placeholder.svg"}
          alt="Coral Logo"
          className="w-10 h-10 object-contain mr-3"
        />
        <h2 className="hidden md:block font-semibold text-xl tracking-wide m-0 text-gray-800">ControlTiC</h2>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {filteredSections.map((section, index) => (
            <div key={index}>
              <h6 className="text-gray-400 uppercase text-xs font-bold mb-3 tracking-wider">{section.heading}</h6>
              <ul className="space-y-1 p-0 m-0 list-none">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        style={{ textDecoration: 'none' }}
                      >
                        <item.icon size={20} stroke={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-gray-500"} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
          <div className="flex items-center min-w-0">
            <svg
              className="text-orange-500 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="36"
              height="36"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
            </svg>
            <div className="ml-3 flex flex-col min-w-0">
              <span className="font-semibold text-sm text-gray-800 truncate">{user.username || "NOMBRE USUARIO"}</span>
              <span className="font-medium text-[10px] text-gray-500 truncate mt-0.5">
                {getRoleName(user.roleId) || "ROL"}
              </span>
            </div>
          </div>
          <Link to="/login" onClick={logout} className="ml-2 flex-shrink-0 text-gray-400 hover:text-orange-500 transition-colors p-1.5 rounded-lg hover:bg-orange-50">
            <i className="bi bi-box-arrow-right text-xl"></i>
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
