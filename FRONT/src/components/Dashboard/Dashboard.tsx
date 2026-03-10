import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { getDashboardData, DashboardData } from '../../servicios/DashboardService';
import { IconAlertCircle, IconCheck, IconServer, IconUsers } from '@tabler/icons-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDashboardData();
                setData(result);
            } catch (err) {
                setError("Error cargando datos del dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64 p-5">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
            <span className="text-gray-600">Cargando estadísticas...</span>
        </div>
    );

    if (error) return (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 m-4">
            {error}
        </div>
    );

    if (!data) return null;

    // Process data for charts
    const totalReportes = data.reportes.length;
    const reportesAbiertos = data.reportes.filter(r => r.estado !== 'CERRADO' && r.estado !== 'FINALIZADO').length;
    const reportesCerrados = totalReportes - reportesAbiertos;

    const pieData = [
        { name: 'Abiertos', value: reportesAbiertos },
        { name: 'Cerrados', value: reportesCerrados },
    ];

    const inventoryData = [
        { name: 'Monitores', cantidad: data.inventory.monitores },
        { name: 'Mouses', cantidad: data.inventory.mouses },
        { name: 'Teclados', cantidad: data.inventory.teclados },
        { name: 'Portátiles', cantidad: data.inventory.portatiles },
        { name: 'Bases', cantidad: data.inventory.bases },
    ];

    const reportesPorMes = data.reportes.reduce((acc: any, curr: any) => {
        // Assuming fecha is in 'YYYY-MM-DD' or comparable format
        const date = new Date(curr.fecha);
        const month = date.toLocaleString('default', { month: 'short' });
        const existing = acc.find((item: any) => item.name === month);
        if (existing) {
            existing.reportes++;
        } else {
            acc.push({ name: month, reportes: 1 });
        }
        return acc;
    }, []);

    // Get recent open reports (Top 5)
    // Note: Assuming 'id' is a good proxy for recency if date parsing fails, but date is better.
    // Safe date parsing is needed.
    const recentReports = data.reportes
        .filter(r => r.estado !== 'CERRADO')
        // Sort descending by date
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);


    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Dashboard General</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reportes Abiertos</h6>
                        <h2 className="text-3xl font-bold m-0 text-red-500">{reportesAbiertos}</h2>
                    </div>
                    <div className="bg-red-50 p-3 rounded-full text-red-500">
                        <IconAlertCircle size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reportes Gestionados</h6>
                        <h2 className="text-3xl font-bold m-0 text-emerald-500">{reportesCerrados}</h2>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-full text-emerald-500">
                        <IconCheck size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Usuarios Activos</h6>
                        <h2 className="text-3xl font-bold m-0 text-blue-500">{data.usersCount}</h2>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                        <IconUsers size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Inventario Total</h6>
                        <h2 className="text-3xl font-bold m-0 text-amber-500">
                            {Object.values(data.inventory).reduce((a, b) => a + b, 0)}
                        </h2>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-full text-amber-500">
                        <IconServer size={32} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Inventory Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h5 className="m-0 font-bold text-gray-800">Distribución de Inventario</h5>
                    </div>
                    <div className="p-6" style={{ minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={inventoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8f9fa' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="cantidad" fill="#4dabf7" radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h5 className="m-0 font-bold text-gray-800">Estado de Reportes</h5>
                    </div>
                    <div className="p-6 flex items-center justify-center" style={{ minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ff6b6b' : '#51cf66'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Reports Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h5 className="m-0 font-bold text-gray-800">Reportes Recientes (Abiertos)</h5>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100 font-medium">ID</th>
                                <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100 font-medium">Fecha</th>
                                <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100 font-medium">Asunto/Motivo</th>
                                <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentReports.length > 0 ? (
                                recentReports.map(report => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 align-middle text-gray-800 font-medium">#{report.id}</td>
                                        <td className="p-4 align-middle text-gray-600">{new Date(report.fecha).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle text-gray-600">
                                            {report.motivo?.descripcion || "Sin motivo"}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                                                {report.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">
                                        No hay reportes abiertos recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
