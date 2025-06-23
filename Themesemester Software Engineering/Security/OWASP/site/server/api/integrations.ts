import mariadb, { Pool, PoolConfig } from 'mariadb';
import { IntegrationItem } from '~/assets/customTypes';

export default defineEventHandler(async (): Promise<Array<IntegrationItem> | number> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        const data: Array<IntegrationItem> = await connection.query("SELECT * FROM integrations;");
        connection.end();
        return data;
    } catch (error: any) {
        console.error(error);
        return 500;
    }
});