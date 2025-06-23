import mariadb, { Pool, PoolConfig } from 'mariadb';
import { IntegrationItem, NewIntegrationItem } from '~/assets/customTypes';

export default defineEventHandler(async (event): Promise<Array<IntegrationItem> | number> => {
    try {
        const integrationItem: NewIntegrationItem = (await readBody(event)) as NewIntegrationItem;
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        await connection.query("INSERT INTO integrations (name, base_url, `key`, description) VALUES (?, ?, ?, ?);", [integrationItem.name, integrationItem.baseUrl, integrationItem.key, integrationItem.description]); connection.end();
        return 200;
    } catch (error: any) {
        console.error(error);
        return 500;
    }
});