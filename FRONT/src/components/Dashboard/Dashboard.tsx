import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { getDashboardData, DashboardData } from '../../servicios/DashboardService';
import {
    IconAlertCircle, IconCheck, IconServer, IconUsers, IconActivity,
    IconDeviceLaptop, IconDeviceDesktop, IconPrinter, IconTool,
    IconDeviceDesktopX, IconDevicesPc, IconHeadset
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

const COLORS = ['#f97316', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4'];

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, bg, accent }) => (
    <motion.div variants={itemVariants}
        className={`group relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
        <div className={`absolute top-0 right-0 w-28 h-28 ${accent} rounded-full blur-3xl -mr-14 -mt-14 opacity-50 group-hover:opacity-80 transition-all`}></div>
        <div className="relative flex items-center justify-between z-10">
            <div>
                <h6 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</h6>
                <h2 className={`text-3xl font-extrabold m-0 ${color} tracking-tight`}>{value}</h2>
            </div>
            <div className={`${bg} p-3 rounded-2xl shadow-inner`}>{icon}</div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDashboardData()
            .then(setData)
            .catch(() => setError("Error cargando datos del dashboard."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50/50">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500" />
            <span className="ml-4 font-medium text-gray-600 animate-pulse">Cargando estadísticas...</span>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gray-50/50">
            <div className="p-6 text-sm text-red-800 rounded-2xl bg-red-50 border border-red-200 shadow-sm flex items-center">
                <IconAlertCircle className="mr-3" />{error}
            </div>
        </div>
    );

    if (!data) return null;

    const totalReportes = data.reportes.length;
    const reportesAbiertosItems = data.reportes.filter(r => r.estado !== 'CERRADO' && r.estado !== 'FINALIZADO');
    const reportesAbiertos = reportesAbiertosItems.length;
    const reportesCerrados = totalReportes - reportesAbiertos;

    const pieData = [
        { name: 'Abiertos', value: reportesAbiertos },
        { name: 'Cerrados/Gestionados', value: reportesCerrados },
    ];

    const inventoryBarData = [
        { name: 'Portátiles', cantidad: data.inventory.portatiles },
        { name: 'PC Escritorio', cantidad: data.inventory.pcEscritorio },
        { name: 'Monitores', cantidad: data.inventory.monitores },
        { name: 'Impresoras', cantidad: data.inventory.impresoras },
        { name: 'Imp. POS', cantidad: data.inventory.impresorasPos },
        { name: 'Diademas', cantidad: data.inventory.diademas },
        ...data.inventory.perifericos.map(p => ({ name: p.nombre, cantidad: p.cantidad })),
    ];

    const recentReports = reportesAbiertosItems
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-[#fdfbf9] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 flex items-center">
                    <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg shadow-orange-500/30 text-white mr-4">
                        <IconActivity size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard General</h2>
                        <p className="text-gray-500 mt-1 font-medium">Resumen del estado actual del sistema y métricas clave.</p>
                    </div>
                </motion.div>

                {/* KPI Cards — Reportes */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Conectividad</p>
                <motion.div variants={containerVariants} initial="hidden" animate="show"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Reportes Abiertos" value={reportesAbiertos}
                        icon={<IconAlertCircle size={28} stroke={2} className="text-red-500" />}
                        color="text-red-500" bg="bg-gradient-to-br from-red-50 to-red-100" accent="bg-red-100" />
                    <StatCard label="Reportes Cerrados" value={reportesCerrados}
                        icon={<IconCheck size={28} stroke={2} className="text-emerald-500" />}
                        color="text-emerald-500" bg="bg-gradient-to-br from-emerald-50 to-emerald-100" accent="bg-emerald-100" />
                    <StatCard label="Bajas Registradas" value={data.bajasCount}
                        icon={<IconDeviceDesktopX size={28} stroke={2} className="text-orange-500" />}
                        color="text-orange-500" bg="bg-gradient-to-br from-orange-50 to-orange-100" accent="bg-orange-100" />
                    <StatCard label="Funcionarios" value={data.usersCount}
                        icon={<IconUsers size={28} stroke={2} className="text-blue-500" />}
                        color="text-blue-500" bg="bg-gradient-to-br from-blue-50 to-blue-100" accent="bg-blue-100" />
                </motion.div>

                {/* KPI Cards — Inventario */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inventario de Activos</p>
                <motion.div variants={containerVariants} initial="hidden" animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard label="Portátiles" value={data.inventory.portatiles}
                        icon={<IconDeviceLaptop size={24} className="text-purple-500" />}
                        color="text-purple-600" bg="bg-gradient-to-br from-purple-50 to-purple-100" accent="bg-purple-100" />
                    <StatCard label="PC Escritorio" value={data.inventory.pcEscritorio}
                        icon={<IconDevicesPc size={24} className="text-indigo-500" />}
                        color="text-indigo-600" bg="bg-gradient-to-br from-indigo-50 to-indigo-100" accent="bg-indigo-100" />
                    <StatCard label="Monitores" value={data.inventory.monitores}
                        icon={<IconDeviceDesktop size={24} className="text-cyan-500" />}
                        color="text-cyan-600" bg="bg-gradient-to-br from-cyan-50 to-cyan-100" accent="bg-cyan-100" />
                    <StatCard label="Impresoras" value={data.inventory.impresoras}
                        icon={<IconPrinter size={24} className="text-amber-500" />}
                        color="text-amber-600" bg="bg-gradient-to-br from-amber-50 to-amber-100" accent="bg-amber-100" />
                    <StatCard label="Diademas" value={data.inventory.diademas}
                        icon={<IconHeadset size={24} className="text-teal-500" />}
                        color="text-teal-600" bg="bg-gradient-to-br from-teal-50 to-teal-100" accent="bg-teal-100" />
                    <StatCard label="Total Activos" value={data.inventory.total}
                        icon={<IconServer size={24} className="text-gray-500" />}
                        color="text-gray-700" bg="bg-gradient-to-br from-gray-100 to-gray-200" accent="bg-gray-100" />
                </motion.div>

                {/* Charts */}
                <motion.div variants={containerVariants} initial="hidden" animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Inventory Bar Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="px-8 py-5 border-b border-gray-50/50">
                            <h5 className="m-0 font-extrabold text-gray-800 text-lg">Distribución de Inventario</h5>
                        </div>
                        <div className="p-6 pt-8 pr-8" style={{ minHeight: '340px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={inventoryBarData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }} dy={10} angle={-20} textAnchor="end" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip cursor={{ fill: 'rgba(243,244,246,0.4)' }}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)', padding: '12px' }}
                                        itemStyle={{ fontWeight: 600 }} />
                                    <defs>
                                        <linearGradient id="barOrange" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fdba74" /><stop offset="100%" stopColor="#f97316" />
                                        </linearGradient>
                                        <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fca5a5" /><stop offset="100%" stopColor="#ef4444" />
                                        </linearGradient>
                                    </defs>
                                    <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} barSize={36}>
                                        {inventoryBarData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#barOrange)" : "url(#barRed)"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Reportes Pie */}
                    <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="px-8 py-5 border-b border-gray-50/50">
                            <h5 className="m-0 font-extrabold text-gray-800 text-lg">Estado de Reportes</h5>
                        </div>
                        <div className="p-6 flex items-center justify-center pt-8" style={{ minHeight: '340px' }}>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="45%" innerRadius={70} outerRadius={95}
                                        paddingAngle={8} dataKey="value" stroke="none" cornerRadius={6}>
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#10b981'} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)', fontWeight: 'bold' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle"
                                        wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Mantenimientos Recientes */}
                {data.mantenimientosRecientes.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden mb-8">
                        <div className="px-8 py-5 border-b border-gray-100/80 flex justify-between items-center bg-gray-50/30">
                            <h5 className="m-0 font-extrabold text-gray-800 text-lg flex items-center gap-2">
                                <IconTool size={20} className="text-orange-500" /> Mantenimientos Recientes
                            </h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Equipo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.mantenimientosRecientes.map((m: any, i) => (
                                        <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{m.tipoEquipo} #{m.equipoId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{m.tipoMantenimiento}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{m.fecha}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.resultado === 'EXITOSO' ? 'bg-emerald-50 text-emerald-700' : m.resultado === 'FALLIDO' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                    {m.resultado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Reportes Abiertos Recientes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-100/80 flex justify-between items-center bg-gray-50/30">
                        <h5 className="m-0 font-extrabold text-gray-800 text-lg">Reportes Recientes (Abiertos)</h5>
                        {reportesAbiertos > 0 && (
                            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-red-100">
                                Atención Requerida
                            </div>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Reporte ID</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Fecha</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Asunto / Motivo</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentReports.length > 0 ? recentReports.map((report, idx) => (
                                    <motion.tr initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }} key={report.id}
                                        className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-8 py-5 align-middle">
                                            <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">#{report.id}</div>
                                        </td>
                                        <td className="px-8 py-5 align-middle text-gray-500 font-medium">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-gray-300 mr-2 group-hover:bg-orange-400 transition-colors"></div>
                                                {new Date(report.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 align-middle">
                                            <div className="text-gray-700 font-medium">{report.motivo?.descripcion || "Motivo no especificado"}</div>
                                        </td>
                                        <td className="px-8 py-5 align-middle">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 shadow-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                                                {report.estado}
                                            </span>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-gray-400 font-medium">
                                            <IconCheck size={48} className="mx-auto text-emerald-300 mb-3 opacity-50" />
                                            ¡Excelente! No hay reportes abiertos recientes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            <div className="mt-12 text-center pb-6">
                <span className="group relative inline-block cursor-default opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Desarrollado por R.R.R.</span>
                    <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-xl border border-gray-700">
                        Rafael Rojas Ramírez
                        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                    </span>
                </span>
            </div>
        </div>
    );
};

export default Dashboard;
