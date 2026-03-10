import { Link } from 'react-router-dom';
import FormularioCrearReporte from '../components/FormulariosCrear/FormularioCrearR';
import Layout from '../components/Layout/Layout';

export const CrearReporte = () => {

  return (
    <Layout>
      <div className="flex items-center text-gray-800 mb-6">
        <div>
          <h1 className="text-2xl font-bold m-0 text-gray-900">Nuevo Reporte</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">Inicio <span className="mx-2 text-gray-300">/</span></li>
              <li className="font-medium text-gray-700">Farmacias</li>
            </ol>
          </nav>
        </div>
        <div className="ml-auto">
          <Link to="/Reportes" className="inline-flex items-center justify-center p-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2"> <path d="M9 14l-4 -4l4 -4"></path> <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path></svg>
          </Link>
        </div>
      </div>
      <FormularioCrearReporte />
    </Layout>
  );
};