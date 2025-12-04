import type { ChartData, LearningGoal_Generic_Datasets } from "~/assets/customTypes";

export const useFetchGoal0 = async (force: boolean): Promise<LearningGoal_Generic_Datasets | number> => {
    const dataStorage = useDataStorage();

    const data = {
        "goalData_0_1": JSON.parse(dataStorage.goalData_0_1) || null as null | ChartData,
        "goalData_2_1": null,
        "goalData_2_2": null,
        "goalData_2_3": null,
        "goalData_3_1": null,
        "goalData_3_2": null
    }

    if (force || !data.goalData_0_1) {
        const rawGoalData_0 = await $fetch("/api/graph/0");
        if (rawGoalData_0) {
            if (typeof rawGoalData_0 === "number") return rawGoalData_0;
            const parsedData_0_1: ChartData = graph_0_1_Parser(rawGoalData_0);

            data.goalData_0_1 = parsedData_0_1;
            dataStorage.goalData_0_1 = JSON.stringify(parsedData_0_1);
        }
    }

    return data;
}