import { getReporte } from "./reportesService";
import { getMonitores } from "./monitoresService";
import { getPerifericos } from "./perifericosService";
import { getPortatiles } from "./portatilesService";
import { getFuncionarios } from "./funcionariosService";

// Define types for the dashboard data
export interface DashboardData {
    reportes: any[];
    inventory: {
        monitores: number;
        portatiles: number;
        perifericos: { nombre: string; cantidad: number }[];
    };
    usersCount: number;
}

export const getDashboardData = async (): Promise<DashboardData> => {
    try {
        const [
            reportes,
            monitores,
            perifericos,
            portatiles,
            funcionarios
        ] = await Promise.all([
            getReporte().catch(() => []),
            getMonitores().catch(() => []),
            getPerifericos().catch(() => []),
            getPortatiles().catch(() => []),
            getFuncionarios().catch(() => [])
        ]);

        const safePerifericos = Array.isArray(perifericos) ? perifericos : [];

        const perifericosAgrupados: { [key: string]: number } = {};
        safePerifericos.forEach((p: any) => {
            if (!p.deleted) {
                const tipo = p.tipoPeriferico?.nombre?.toUpperCase() || 'OTROS';
                perifericosAgrupados[tipo] = (perifericosAgrupados[tipo] || 0) + 1;
            }
        });

        const perifericosArray = Object.keys(perifericosAgrupados).map(key => ({
            nombre: key,
            cantidad: perifericosAgrupados[key]
        }));

        return {
            reportes: Array.isArray(reportes) ? reportes : [],
            inventory: {
                monitores: Array.isArray(monitores) ? monitores.length : 0,
                portatiles: Array.isArray(portatiles) ? portatiles.length : 0,
                perifericos: perifericosArray,
            },
            usersCount: Array.isArray(funcionarios) ? funcionarios.length : 0
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};
