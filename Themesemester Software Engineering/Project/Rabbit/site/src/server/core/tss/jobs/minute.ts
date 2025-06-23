import { defineCronHandler } from "#nuxt/cron"
import { Pool } from "mariadb";
import { userTimeout } from "../handlers/userTimeout";
import { CronJobTypes } from "~/assets/customTypes";
import { userBlock } from "../handlers/userBlock";

// Jobs that should be ran every minute
export default defineCronHandler("everyMinute", async () => {
    try {
        // Retrieve expired jobs from the database
        const connection: Pool = await database();
        const expiredJobs: Array<{
            "id": number,
            "type": keyof typeof CronJobTypes,
            "data": any,
        }> = await connection.query("SELECT id, type, data FROM scheduled_task WHERE status = 'pending' AND date_schedule <= NOW()");
        if (!expiredJobs || expiredJobs.length === 0) return await connection.end();

        // Setup storage
        log(`[CRON / Minute] Running with ${expiredJobs.length} pending jobs.`, "info");
        const resolvedJobs: Array<number> = [];
        const failedJobs: Array<number> = [];

        // Process each expired job
        for (let i = 0; i < expiredJobs.length; i++) {
            const job = expiredJobs[i];
            let response: boolean = false;

            switch (job.type) {
                case "userTimeout":
                    response = await userTimeout(job.data, connection);
                    break;
                case "userBlock":
                    response = await userBlock(job.data, connection);
                    break;
                // Add more cases for other job types here
                default:
                    break;
            }

            // Add the job to the correct array
            if (response) {
                resolvedJobs.push(job.id);
            } else failedJobs.push(job.id);
        }

        // Update the status of the jobs in the database
        if (resolvedJobs.length > 0) await connection.query("UPDATE scheduled_task SET status = 'completed' WHERE id IN (?)", [resolvedJobs]);
        if (failedJobs.length > 0) await connection.query("UPDATE scheduled_task SET status = 'failed' WHERE id IN (?)", [failedJobs]);

        log(`[CRON / Minute] Completed ${resolvedJobs.length} job(s) and failed ${failedJobs.length} job(s).`, "info");
        return await connection.end();
    } catch (error: any) {
        logError(error);
    }
});