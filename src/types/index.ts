export interface MysqlConfig {
    host: string | undefined;
    user: string | undefined;
    password: string | undefined;
    database: string | undefined;
    port: number | undefined;
}

export interface Opportunity {
    userId: string;
    name: string;
    opportunityConversionSum: number;
    opportunityConversionAverage: number;
    opportunityConversionCount: number;
}

export interface ClosedWin {
    userId: string;
    name: string;
    closedWinConversionSum: number;
    closedWinConversionAverage: number;
    closedWinConversionCount: number;
}

export interface User {
    id: string;
    name: string;
}

export interface FinalOutput {
    id: string;
    name: string;
    opportunityConversionSum?: number;
    opportunityConversionAverage?: number;
    opportunityConversionCount?: number;
    closedWinConversionSum?: number;
    closedWinConversionAverage?: number;
    closedWinConversionCount?: number;
}

export interface Option {
    since: string;
    until: string;
}
