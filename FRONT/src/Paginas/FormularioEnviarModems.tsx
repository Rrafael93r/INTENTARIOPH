
import Layout from "../components/Layout/Layout";
import FormularioEnvioM from "../components/FormulariosCrear/FormularioEnvioM";



export const FormularioEnviarModems = () => {
    return (
        <Layout>
            <div className="d-flex align-items-center" style={{ color: 'black' }}>
                <div className="pagetitle">
                    <h1>Modems Enviados</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Inicio</li>
                            <li className="breadcrumb-item active">
                                <a className="text-decoration-none" href="/Proveedores">Envios</a>
                            </li>
                        </ol>
                    </nav>
                </div>
                
            </div>
            <FormularioEnvioM />
        </Layout>
    );
}