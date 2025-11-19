import { Route, Routes, Navigate } from "react-router-dom"
import Login from "../components/Login/Login"
import { Reportes } from "../Paginas/Reportes"
import { Proveedores } from "../Paginas/Proveedores"
import PaginaFuncionarios from "../Paginas/Funcionarios"
import { Farmacias } from "../Paginas/Farmacias"
import { EditarProveedor } from "../Paginas/EditarProveedor"
import { EditarFarmacia } from "../Paginas/EditarFarmacias"
import { CrearReporte } from "../Paginas/CrearReportes"
import { Modems } from "../Paginas/Modems"
import { EnviosModems } from "../Paginas/EnvioModems"
import ProtectedRoute from "../Rutas/ProtectedRoute"
import { FormularioEnviarModems } from "../Paginas/FormularioEnviarModems"
import PaginaPortatiles from "../Paginas/Portatiles"
import PaginaMonitores from "../Paginas/Monitores"
import PaginaTeclados from "../Paginas/Teclados"
import PaginaMouse from "../Paginas/Mouse"
import PaginaDiademas from "../Paginas/Diademas"
import PaginaBaseRefrigeradora from "../Paginas/BaseRefrigeradora"
import PaginaEntregaEquipos from "../Paginas/EntregaEquipos"
import PaginaBajaEquipos from "../Paginas/BajaEquipos"
import PaginaUsuarios from "../Paginas/PaginaUsuarios"
import ReporteSimple from "../Paginas/ReporteUser"

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

      <Route
        path="/editarProveedor/:id"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <EditarProveedor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editarFarmacia/:id"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <EditarFarmacia />
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
        path="/Monitores"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaMonitores />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/Teclados"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaTeclados />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/Mouses"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaMouse />
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
        path="/BasesRefrigeradoras"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaBaseRefrigeradora />
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
        path="/BajaEquipos"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaBajaEquipos />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <PaginaUsuarios />
          </ProtectedRoute>
        }
      ></Route>

      {/* Redirección por defecto basada en rol */}
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
