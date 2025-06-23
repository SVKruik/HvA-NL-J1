import mariadb, { Pool, PoolConfig } from 'mariadb';
import { IntegrationItem } from '~/assets/customTypes';

export default defineEventHandler(async (event: any): Promise<Response | number> => {
    try {
        const id = getRouterParam(event, "id")
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        const data: IntegrationItem = (await connection.query("SELECT * FROM integrations WHERE id = ?;", [id]))[0];
        connection.end();

        // Fetch base_url
        return await fetch(data.base_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.key
            }
        });
    } catch (error: any) {
        console.error(error);
        return 500;
    }
});