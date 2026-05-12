
import Layout from "../components/Layout/Layout";
import FormularioEnvioM from "../components/FormulariosCrear/FormularioEnvioM";

export const FormularioEnviarModems = () => {
    return (
        <Layout>
            <div className="mb-4">
                <h1 className="page-title">Modems Enviados</h1>
                <p className="page-subtitle">Registra un nuevo envío de modem</p>
            </div>
            <FormularioEnvioM />
        </Layout>
    );
}
