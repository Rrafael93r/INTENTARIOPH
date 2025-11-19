
import Layout from "../components/Layout/Layout";
import EditarFarmacias from "../components/FormulariosEditar.tsx/FormularioEditarF";



export const EditarFarmacia = () => {
  return (
    <Layout>
      <div className="d-flex align-items-center" style={{ color: 'black' }}>
        <div className="pagetitle">
          <h1>Farmacias</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>

              <li className="breadcrumb-item active">
                <a className="text-decoration-none" href="/Proveedores">Farmacias</a>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="ms-auto">
        </div>
      </div>
      <EditarFarmacias />
    </Layout>
  );
};
