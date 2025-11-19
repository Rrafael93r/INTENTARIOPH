"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { getCurrentUser, logout } from "../../servicios/authServices"
import CoralLogo from "../../assets/icons8-controlar-100.png"

interface SimpleLayoutProps {
  children: React.ReactNode
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [user] = useState(getCurrentUser())

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header simple para móvil */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-3 px-3">
            {/* Logo y título */}
            <div className="d-flex align-items-center">
              <img
                src={CoralLogo || "/placeholder.svg"}
                alt="ControlTiC Logo"
                style={{ width: "40px", height: "40px" }}
              />
              <div className="ms-3">
                <h5 className="mb-0 fw-bold">
                  ControlTiC
                </h5>
                <small className="text-muted">Sistema de Reportes</small>
              </div>
            </div>

            {/* Información del usuario y logout */}
            <div className="d-flex align-items-center">
              <div className="me-3 text-end d-none d-sm-block">
                <div className="fw-semibold small">{user?.username}</div>
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  Reportador
                </div>
              </div>
              <div className="d-flex align-items-center">
                <svg
                  className="me-2"
                  style={{ color: "#f6952c" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                  strokeWidth="2"
                >
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                </svg>
                <Link to="/login">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={logout}
                    className="d-flex align-items-center"
                    style={{ borderColor: "#f6952c", color: "#f6952c" }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    <span className="d-none d-sm-inline">Salir</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container-fluid py-4">{children}</main>

      {/* Footer simple */}
      <footer className="bg-white border-top mt-auto">
        <div className="container-fluid">
          <div className="text-center py-3">
            <small className="text-muted">
              © 2025 ControlTiC - Sistema de Gestión de Reportes
              <br />
              <span className="d-inline-block mt-1">
                <i className="bi bi-shield-check me-1" style={{ color: "#f6952c" }}></i>
                Acceso Reportador
              </span>
            </small>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SimpleLayout
