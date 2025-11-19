import { Link } from 'react-router-dom';
import FormularioCrearReporte from '../components/FormulariosCrear/FormularioCrearR';
import Layout from '../components/Layout/Layout';
import { Button } from 'react-bootstrap';

export const CrearReporte = () => {

  return (
    <Layout>
      <div className="d-flex align-items-center" style={{ color: 'black' }}>
        <div className="pagetitle">
          <h1>Nuevo Reporte</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>
              <li className="breadcrumb-item active">Farmacias</li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto">
          <Link to="/Reportes">
            <Button className="btn" style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M9 14l-4 -4l4 -4"></path> <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path></svg>

            </Button>
          </Link>
        </div>
      </div>
      <FormularioCrearReporte />
    </Layout>
  );
};