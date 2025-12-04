import { LearningGoal0Result } from "~/assets/customTypes";
import mariadb, { Pool, PoolConfig } from 'mariadb';

export default defineEventHandler(async (): Promise<Array<LearningGoal0Result> | number> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        const data: Array<LearningGoal0Result> = (await connection.query("SELECT week, COUNT(week) AS week_count FROM learning_goal_data GROUP BY week;")).map((row: {
            week: number,
            week_count: bigint
        }) => ({
            "week": row.week < 2500 ? row.week - 2400 : row.week - 2500,
            "week_count": Number(row.week_count)
        }));
        connection.end();
        return data;
    } catch (error: any) {
        return 500;
    }
});