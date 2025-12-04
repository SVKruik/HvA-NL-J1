import { LearningGoal4Result, LearningGoal4RawResult, LearningGoal4RawResultType } from "~/assets/customTypes";
import mariadb, { Pool, PoolConfig } from 'mariadb';

export default defineEventHandler(async (): Promise<LearningGoal4Result | number> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
        const data: Array<LearningGoal4RawResult> = await connection.query("SELECT ROUND(time_taken / 60) as time_taken_hours, category, language, date_creation FROM learning_goal_data;");
        connection.end();

        // Default Values
        const categoryInitial = new Map<string, number>([
            ['Frontend', 0],
            ['Backend', 0],
            ['UIX', 0],
            ['API', 0],
            ['QA', 0],
            ['CMS', 0],
        ]);
        const languageInitial = new Map<string, number>([
            ['Laravel', 0],
            ['Vue', 0],
            ['Blade', 0],
            ['Database', 0],
            ['JavaScript', 0],
        ]);

        // Type, Count
        const categoriesCount: LearningGoal4RawResultType = {
            total: structuredClone(categoryInitial),
            firstHalf: structuredClone(categoryInitial),
            secondHalf: structuredClone(categoryInitial),
        };
        const categoriesHours: LearningGoal4RawResultType = {
            total: structuredClone(categoryInitial),
            firstHalf: structuredClone(categoryInitial),
            secondHalf: structuredClone(categoryInitial),
        };
        const languagesCount: LearningGoal4RawResultType = {
            total: structuredClone(languageInitial),
            firstHalf: structuredClone(languageInitial),
            secondHalf: structuredClone(languageInitial),
        };
        const languagesHours: LearningGoal4RawResultType = {
            total: structuredClone(languageInitial),
            firstHalf: structuredClone(languageInitial),
            secondHalf: structuredClone(languageInitial),
        };

        const midpointDate = new Date("2024-11-16T00:00:00.000Z");
        data.forEach((item) => {
            item.time_taken_hours = parseInt(item.time_taken_hours as unknown as string);
            const itemDate = new Date(item.date_creation);
            const isFirstHalf = itemDate <= midpointDate;
            // Process Categories
            item.category.split(",").forEach((category: string) => {
                category = category.trim();
                categoriesCount.total.set(category, (categoriesCount.total.get(category) || 0) + 1);
                categoriesHours.total.set(category, (categoriesHours.total.get(category) || 0) + item.time_taken_hours);
                if (isFirstHalf) {
                    categoriesCount.firstHalf.set(category, (categoriesCount.firstHalf.get(category) || 0) + 1);
                    categoriesHours.firstHalf.set(category, (categoriesHours.firstHalf.get(category) || 0) + item.time_taken_hours);
                } else {
                    categoriesCount.secondHalf.set(category, (categoriesCount.secondHalf.get(category) || 0) + 1);
                    categoriesHours.secondHalf.set(category, (categoriesHours.secondHalf.get(category) || 0) + item.time_taken_hours);
                }
            });

            // Process Languages
            item.language.split(",").forEach((language: string) => {
                language = language.trim();
                languagesCount.total.set(language, (languagesCount.total.get(language) || 0) + 1);
                languagesHours.total.set(language, (languagesHours.total.get(language) || 0) + item.time_taken_hours);
                if (isFirstHalf) {
                    languagesCount.firstHalf.set(language, (languagesCount.firstHalf.get(language) || 0) + 1);
                    languagesHours.firstHalf.set(language, (languagesHours.firstHalf.get(language) || 0) + item.time_taken_hours);
                } else {
                    languagesCount.secondHalf.set(language, (languagesCount.secondHalf.get(language) || 0) + 1);
                    languagesHours.secondHalf.set(language, (languagesHours.secondHalf.get(language) || 0) + item.time_taken_hours);
                }
            });
        });

        return {
            // Categories
            "categoryNames": Array.from(categoriesCount.total.keys()),
            "categoryCounts": {
                total: Array.from(categoriesCount.total.values()),
                firstHalf: Array.from(categoriesCount.firstHalf.values()),
                secondHalf: Array.from(categoriesCount.secondHalf.values()),
            },
            "categoryHours": {
                total: Array.from(categoriesHours.total.values()),
                firstHalf: Array.from(categoriesHours.firstHalf.values()),
                secondHalf: Array.from(categoriesHours.secondHalf.values()),
            },

            // Languages
            "languageNames": Array.from(languagesCount.total.keys()),
            "languageCounts": {
                total: Array.from(languagesCount.total.values()),
                firstHalf: Array.from(languagesCount.firstHalf.values()),
                secondHalf: Array.from(languagesCount.secondHalf.values()),
            },
            "languageHours": {
                total: Array.from(languagesHours.total.values()),
                firstHalf: Array.from(languagesHours.firstHalf.values()),
                secondHalf: Array.from(languagesHours.secondHalf.values()),
            }
        };
    } catch (error: any) {
        return 500;
    }
});