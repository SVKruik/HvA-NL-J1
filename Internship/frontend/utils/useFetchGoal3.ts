import type { ChartData, LearningGoal_Generic_Datasets } from "~/assets/customTypes";

export const useFetchGoal3 = async (force: boolean): Promise<LearningGoal_Generic_Datasets | number> => {
    const dataStorage = useDataStorage();

    const data = {
        "goalData_0_1": null,
        "goalData_2_1": null,
        "goalData_2_2": null,
        "goalData_2_3": null,
        "goalData_3_1": JSON.parse(dataStorage.goalData_3_1) || null as null | ChartData,
        "goalData_3_2": JSON.parse(dataStorage.goalData_3_2) || null as null | ChartData
    }

    if (force || !data.goalData_3_1) {
        const rawGoalData_3 = await $fetch("/api/graph/3");
        if (rawGoalData_3) {
            if (typeof rawGoalData_3 === "number") return rawGoalData_3;
            const parsedData_3_1: ChartData = graph_3_1_Parser(rawGoalData_3);
            const parsedData_3_2: ChartData = graph_3_2_Parser(rawGoalData_3);

            data.goalData_3_1 = parsedData_3_1;
            dataStorage.goalData_3_1 = JSON.stringify(parsedData_3_1);

            data.goalData_3_2 = parsedData_3_2;
            dataStorage.goalData_3_2 = JSON.stringify(parsedData_3_2);
        }
    }

    return data;
}