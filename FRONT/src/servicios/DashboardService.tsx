import { getReporte } from "./reportesService";
import { getMonitores } from "./monitoresService";
import { getPerifericos } from "./perifericosService";
import { getPortatiles } from "./portatilesService";
import { getFuncionarios } from "./funcionariosService";
import { getDiademas } from "./DiademaService";
import { getImpresoras } from "./impresoraService";
import { getImpresorasPos } from "./impresoraPosService";
import { getPcEscritorios } from "./pcEscritorioService";
import { getMantenimientos } from "./mantenimientoService";
import { getBajasEquipos } from "./bajaEquipoService";

export interface InventarioResumen {
    portatiles: number;
    pcEscritorio: number;
    monitores: number;
    impresoras: number;
    impresorasPos: number;
    diademas: number;
    perifericos: { nombre: string; cantidad: number }[];
    total: number;
}

export interface DashboardData {
    reportes: any[];
    inventory: InventarioResumen;
    usersCount: number;
    mantenimientosRecientes: any[];
    bajasCount: number;
}

export const getDashboardData = async (): Promise<DashboardData> => {
    const [
        reportes,
        monitores,
        perifericos,
        portatiles,
        funcionarios,
        diademas,
        impresoras,
        impresorasPos,
        pcEscritorio,
        mantenimientos,
        bajas,
    ] = await Promise.all([
        getReporte().catch(() => []),
        getMonitores().catch(() => []),
        getPerifericos().catch(() => []),
        getPortatiles().catch(() => []),
        getFuncionarios().catch(() => []),
        getDiademas().catch(() => []),
        getImpresoras().catch(() => []),
        getImpresorasPos().catch(() => []),
        getPcEscritorios().catch(() => []),
        getMantenimientos().catch(() => []),
        getBajasEquipos().catch(() => []),
    ]);

    const safePerifericos = Array.isArray(perifericos) ? perifericos : [];
    const perifericosAgrupados: Record<string, number> = {};
    safePerifericos.filter((p: any) => !p.deleted).forEach((p: any) => {
        const tipo = p.tipoPeriferico?.nombre?.toUpperCase() || "OTROS";
        perifericosAgrupados[tipo] = (perifericosAgrupados[tipo] || 0) + 1;
    });
    const perifericosArray = Object.keys(perifericosAgrupados).map(k => ({
        nombre: k,
        cantidad: perifericosAgrupados[k],
    }));

    const safeLen = (arr: any) => (Array.isArray(arr) ? arr.length : 0);

    const countPortatiles = safeLen(portatiles);
    const countPc = safeLen(pcEscritorio);
    const countMonitores = safeLen(monitores);
    const countImpresoras = safeLen(impresoras);
    const countImpresorasPos = safeLen(impresorasPos);
    const countDiademas = safeLen(diademas);
    const countPerifericos = safePerifericos.length;

    return {
        reportes: Array.isArray(reportes) ? reportes : [],
        inventory: {
            portatiles: countPortatiles,
            pcEscritorio: countPc,
            monitores: countMonitores,
            impresoras: countImpresoras,
            impresorasPos: countImpresorasPos,
            diademas: countDiademas,
            perifericos: perifericosArray,
            total: countPortatiles + countPc + countMonitores + countImpresoras + countImpresorasPos + countDiademas + countPerifericos,
        },
        usersCount: safeLen(funcionarios),
        mantenimientosRecientes: Array.isArray(mantenimientos)
            ? mantenimientos.slice(-5).reverse()
            : [],
        bajasCount: safeLen(bajas),
    };
};
