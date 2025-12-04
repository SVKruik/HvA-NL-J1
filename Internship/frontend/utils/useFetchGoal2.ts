import type { ChartData, LearningGoal_Generic_Datasets } from "~/assets/customTypes";

export const useFetchGoal2 = async (force: boolean): Promise<LearningGoal_Generic_Datasets | number> => {
    const dataStorage = useDataStorage();

    const data = {
        "goalData_0_1": null,
        "goalData_2_1": JSON.parse(dataStorage.goalData_2_1) || null as null | ChartData,
        "goalData_2_2": JSON.parse(dataStorage.goalData_2_2) || null as null | ChartData,
        "goalData_2_3": JSON.parse(dataStorage.goalData_2_3) || null as null | ChartData,
        "goalData_3_1": null,
        "goalData_3_2": null
    }

    if (force || !data.goalData_2_1 || !data.goalData_2_2 || !data.goalData_2_3) {
        const rawGoalData_2 = await $fetch("/api/graph/2");
        if (rawGoalData_2) {
            if (typeof rawGoalData_2 === "number") return rawGoalData_2;
            const parsedData_2_1: ChartData = graph_2_1_Parser(rawGoalData_2);
            const parsedData_2_2: ChartData = graph_2_2_Parser(rawGoalData_2);
            const parsedData_2_3: ChartData = graph_2_3_Parser(rawGoalData_2);

            data.goalData_2_1 = parsedData_2_1;
            dataStorage.goalData_2_1 = JSON.stringify(parsedData_2_1);

            data.goalData_2_2 = parsedData_2_2;
            dataStorage.goalData_2_2 = JSON.stringify(parsedData_2_2);

            data.goalData_2_3 = parsedData_2_3;
            dataStorage.goalData_2_3 = JSON.stringify(parsedData_2_3);
        }
    }

    return data;
}