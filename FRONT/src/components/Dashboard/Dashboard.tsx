
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Container, Table } from 'react-bootstrap';
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

    if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /> Cargando estadísticas...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
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
        <Container fluid className="p-4 bg-light min-vh-100">
            <h2 className="mb-4 fw-bold text-dark">Dashboard General</h2>

            {/* Stats Cards */}
            <Row className="mb-4 g-3">
                <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted text-uppercase mb-2">Reportes Abiertos</h6>
                                <h2 className="fw-bold mb-0 text-danger">{reportesAbiertos}</h2>
                            </div>
                            <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                                <IconAlertCircle size={32} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted text-uppercase mb-2">Reportes Gestionados</h6>
                                <h2 className="fw-bold mb-0 text-success">{reportesCerrados}</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                                <IconCheck size={32} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted text-uppercase mb-2">Usuarios Activos</h6>
                                <h2 className="fw-bold mb-0 text-primary">{data.usersCount}</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                                <IconUsers size={32} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted text-uppercase mb-2">Inventario Total</h6>
                                <h2 className="fw-bold mb-0 text-warning">
                                    {Object.values(data.inventory).reduce((a, b) => a + b, 0)}
                                </h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                                <IconServer size={32} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4 g-3">
                {/* Inventory Chart */}
                <Col lg={8}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">Distribución de Inventario</h5>
                        </Card.Header>
                        <Card.Body style={{ minHeight: '300px' }}>
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
                        </Card.Body>
                    </Card>
                </Col>

                {/* Status Pie Chart */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">Estado de Reportes</h5>
                        </Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Recent Reports Table */}
            <Row>
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Reportes Recientes (Abiertos)</h5>
                        </Card.Header>
                        <Table responsive hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0">ID</th>
                                    <th className="border-0">Fecha</th>
                                    <th className="border-0">Asunto/Motivo</th>
                                    <th className="border-0">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReports.length > 0 ? (
                                    recentReports.map(report => (
                                        <tr key={report.id}>
                                            <td>#{report.id}</td>
                                            <td>{new Date(report.fecha).toLocaleDateString()}</td>
                                            <td>
                                                {/* Accessing nested property safely */}
                                                {report.motivo?.descripcion || "Sin motivo"}
                                            </td>
                                            <td>
                                                <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                                                    {report.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-muted">
                                            No hay reportes abiertos recientes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
