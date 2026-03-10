import React from 'react';

const TablaBajaEquipos = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2">
                            <i className="bi bi-pc-display-horizontal text-orange-500"></i>
                            Baja de Equipos
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 mb-0">Gestión de equipos dados de baja en el sistema</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                        >
                            <i className="bi bi-plus-circle text-orange-500"></i>
                            <span>Nueva Baja</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="bi bi-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                            placeholder="Buscar por equipo, serial o motivo de baja..."
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            <th className="p-3">ID</th>
                            <th className="p-3">Equipo</th>
                            <th className="p-3">Fecha Baja</th>
                            <th className="p-3">Motivo</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <i className="bi bi-info-circle text-4xl text-gray-300 mb-2"></i>
                                    <p className="text-gray-500">No hay equipos dados de baja registrados en este momento.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Placeholder for Pagination */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 m-0">
                            Mostrando <span className="font-medium">0</span> equipos de baja
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaBajaEquipos;