import { LearningGoal3Result } from "~/assets/customTypes";
import mariadb, { Pool, PoolConfig } from 'mariadb';

export default defineEventHandler(async (): Promise<Array<LearningGoal3Result> | number> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        const data: Array<LearningGoal3Result> = (await connection.query("SELECT week, ROUND(AVG(time_planned) / 60, 1) as avg_time_planned, ROUND(AVG(time_taken) / 60, 1) as avg_time_taken, ROUND(AVG(extras), 1) as avg_extras, ROUND(AVG(incidents), 1) as avg_incidents FROM learning_goal_data GROUP BY week;")).map((row: LearningGoal3Result) => ({
            ...row,
            "week": row.week < 2500 ? row.week - 2400 : row.week - 2500,
        }));
        connection.end();
        return data;
    } catch (error: any) {
        return 500;
    }
});