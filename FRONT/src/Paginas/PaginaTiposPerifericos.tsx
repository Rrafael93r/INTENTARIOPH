import React from 'react';
import TablaTiposPerifericos from '../components/Tablas/TablaTiposPerifericos';

const PaginaTiposPerifericos: React.FC = () => {
    return (
        <div className="p-6 h-full flex flex-col bg-gray-50">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 m-0">Tipos de Periféricos</h1>
                    <p className="text-gray-500 mt-2 mb-0">
                        Administra las categorías de periféricos que el sistema puede registrar.
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <TablaTiposPerifericos />
            </div>
        </div>
    );
};

export default PaginaTiposPerifericos;
