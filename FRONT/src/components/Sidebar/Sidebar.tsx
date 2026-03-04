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
import { Button } from "react-bootstrap"
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
    <div className="sidebar col-lg-2 bg-white border-end d-flex flex-column p-0 vh-100">
      <header className="d-flex align-items-center p-1  bg-white">
        <img
          src={CoralLogo || "/placeholder.svg"}
          alt="Coral Logo"
          className="img-fluid"
          style={{ width: "50px", margin: "10px" }}
        />
        <h2 className="d-none d-md-block fw-semibold fs-5 ls-wide ms-2 mb-0">ControlTiC</h2>
      </header>
      <div className="flex-grow-1 overflow-auto">
        <div className="p-3">
          {filteredSections.map((section, index) => (
            <div key={index} className="mb-4">
              <h6 className="text-muted text-uppercase small fw-bold mb-3">{section.heading}</h6>
              <ul className="nav flex-column">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="nav-item">
                    <Link
                      to={item.path}
                      className={` d-flex align-items-center gap-2 py-2 px-3 ${location.pathname === item.path ? "text-white" : "text-dark"
                        }`}
                      style={{
                        borderRadius: "0.6rem",
                        textDecoration: "none",
                        backgroundColor: location.pathname === item.path ? "#f6952c" : "",
                        color: location.pathname === item.path ? "white" : "",
                      }}
                    >
                      <item.icon size={20} stroke={2} />
                      <span className="small">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky-end p-3" style={{ backgroundColor: "#ffffff", position: "sticky", bottom: "0" }}>
        <div className="card bg-transparent border-0">
          <div
            style={{ backgroundColor: "#f8f9fa" }}
            className="card-body d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              <svg
                className="me-1"
                style={{ color: "#f6952c" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="30"
                height="30"
                strokeWidth="2"
              >
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              </svg>
              <div className="ms-2 d-flex flex-column">
                <span className="fw-semibold small">{user.username || "NOMBRE USUARIO"}</span>
                <span className="fw-light small" style={{ fontSize: "10px" }}>
                  {getRoleName(user.roleId) || "ROL"}
                </span>
              </div>
            </div>
            <Link to="/login">
              <Button
                className="d-flex align-items-center p-1"
                variant="link"
                style={{ color: "#f6952c" }}
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right"></i>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
