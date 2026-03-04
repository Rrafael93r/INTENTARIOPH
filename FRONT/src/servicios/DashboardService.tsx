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
        mouses: number;
        teclados: number;
        portatiles: number;
        hubUsb: number;
        bases: number;
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

        const mousesCheck = safePerifericos.filter((p: any) => p.clasificacion === 'MOUSE').length;
        const tecladosCheck = safePerifericos.filter((p: any) => p.clasificacion === 'TECLADO').length;
        const hubUsbCheck = safePerifericos.filter((p: any) => p.clasificacion === 'HUB_USB').length;
        const basesCheck = safePerifericos.filter((p: any) => p.clasificacion === 'BASE_REFRIGERADORA').length;

        return {
            reportes: Array.isArray(reportes) ? reportes : [],
            inventory: {
                monitores: Array.isArray(monitores) ? monitores.length : 0,
                mouses: mousesCheck,
                teclados: tecladosCheck,
                portatiles: Array.isArray(portatiles) ? portatiles.length : 0,
                hubUsb: hubUsbCheck,
                bases: basesCheck,
            },
            usersCount: Array.isArray(funcionarios) ? funcionarios.length : 0
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};
