
import Layout from "../components/Layout/Layout";
import EditarProveedores from "../components/FormulariosEditar.tsx/FormularioEditarP";

export const EditarProveedor = () => {
  return (
    <Layout>
      <div className="d-flex align-items-center" style={{ color: 'black' }}>
        <div className="pagetitle">
          <h1>Editar Proveedor</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>

              <li className="breadcrumb-item active">
                <a className="text-decoration-none" href="/Proveedores">Proveedores</a>
              </li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto">
        </div>
      </div>
      <EditarProveedores />
    </Layout>
  );
};
