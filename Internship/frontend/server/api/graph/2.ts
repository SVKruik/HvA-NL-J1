import { LearningGoal2Result } from "~/assets/customTypes";
import mariadb, { Pool, PoolConfig } from 'mariadb';

export default defineEventHandler(async (): Promise<Array<LearningGoal2Result> | number> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        const data: Array<LearningGoal2Result> = (await connection.query("SELECT week, ROUND(AVG(time_taken / time_planned * 100)) AS avg_time_taken_percentage, ROUND(IFNULL(AVG(qa_iterations), 0), 1) as avg_qa_iterations, ROUND(AVG(help_needed), 1) as avg_help_needed FROM learning_goal_data GROUP BY week;")).map((row: LearningGoal2Result) => ({
            ...row,
            "week": row.week < 2500 ? row.week - 2400 : row.week - 2500,
        }));
        connection.end();
        return data;
    } catch (error: any) {
        return 500;
    }
});