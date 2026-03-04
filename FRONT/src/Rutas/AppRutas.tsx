import { Route, Routes, Navigate } from "react-router-dom"
import Login from "../components/Login/Login"
import { Reportes } from "../Paginas/Reportes"
import { Proveedores } from "../Paginas/Proveedores"
import PaginaFuncionarios from "../Paginas/Funcionarios"
import { Farmacias } from "../Paginas/Farmacias"
import { CrearReporte } from "../Paginas/CrearReportes"
import { Modems } from "../Paginas/Modems"
import { EnviosModems } from "../Paginas/EnvioModems"
import ProtectedRoute from "../Rutas/ProtectedRoute"
import { FormularioEnviarModems } from "../Paginas/FormularioEnviarModems"
import PaginaPortatiles from "../Paginas/Portatiles"
import PaginaMonitores from "../Paginas/Monitores"

import PaginaDiademas from "../Paginas/Diademas"
import PaginaPerifericos from "../Paginas/PaginaPerifericos"
import PaginaEntregaEquipos from "../Paginas/EntregaEquipos"
import PaginaBajaEquipos from "../Paginas/BajaEquipos"
import PaginaUsuarios from "../Paginas/PaginaUsuarios"
import ReporteSimple from "../Paginas/ReporteUser"
import Inicio from "../Paginas/Inicio"

import PaginaAreas from "../Paginas/PaginaAreas"
import PaginaMarcas from "../Paginas/PaginaMarcas"
import PaginaPcEscritorio from "../Paginas/PaginaPcEscritorio"
import PaginaImpresoras from "../Paginas/PaginaImpresoras"
import PaginaImpresorasPos from "../Paginas/PaginaImpresorasPos"
import PaginaActas from "../Paginas/PaginaActas"
import PaginaEstados from "../Paginas/PaginaEstados"



export const AppRutas = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas para Administradores y Supervisores (roles 1 y 2) */}
      <Route
        path="/reportes"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <Reportes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crearReporte"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <CrearReporte />
          </ProtectedRoute>
        }
      />

      {/* Ruta específica para usuarios reportadores (rol 3) */}
      <Route
        path="/mi-reporte"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ReporteSimple />
          </ProtectedRoute>
        }
      />

      {/* Rutas solo para Administradores (rol 1) */}
      <Route
        path="/farmacias"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Farmacias />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proveedores"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Proveedores />
          </ProtectedRoute>
        }
      />

      {/* Rutas para Administradores y Supervisores (roles 1 y 2) */}
      <Route
        path="/modems"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <Modems />
          </ProtectedRoute>
        }
      />

      <Route path="/inicio"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            < Inicio />
          </ProtectedRoute>
        }
      />



      <Route
        path="/EnvioModems"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <EnviosModems />
          </ProtectedRoute>
        }
      />

      <Route
        path="/FormularioEnviarModems"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <FormularioEnviarModems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Funcionarios"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaFuncionarios />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Portatiles"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaPortatiles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/PcEscritorio"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaPcEscritorio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Impresoras"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaImpresoras />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ImpresorasPos"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaImpresorasPos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/actas"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaActas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Monitores"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaMonitores />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/perifericos"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaPerifericos />
          </ProtectedRoute>
        }
      ></Route>



      <Route
        path="/Diademas"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaDiademas />
          </ProtectedRoute>
        }
      ></Route>



      <Route
        path="/EngraEquipos"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaEntregaEquipos />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/equipos-de-baja"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaBajaEquipos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaUsuarios />
          </ProtectedRoute>
        }
      ></Route>



      <Route
        path="/Areas"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <PaginaAreas />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/Marcas"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <PaginaMarcas />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/Estados"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <PaginaEstados />
          </ProtectedRoute>
        }
      ></Route>



      {/* Redirección por defecto basada en rol */}
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
