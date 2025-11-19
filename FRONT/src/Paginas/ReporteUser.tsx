import type React from "react"
import FormularioReporteUser from "../components/FormulariosCrear/FormularioReporteUser"
import SimpleLayout from "../components/Layout/SimpleLayout"

const ReporteSimplePage: React.FC = () => {
  return (
    <SimpleLayout>
      <FormularioReporteUser />
    </SimpleLayout>
  )
}

export default ReporteSimplePage
