import { defineStore } from "pinia";
import { useSessionStorage } from "@vueuse/core";
import type { ChartData } from "~/assets/customTypes";

export const useDataStorage = defineStore("useDataStorage", {
    state: () => ({
        goalData_0_1: useSessionStorage("goalData_0_1", null as unknown as ChartData),
        goalData_2_1: useSessionStorage("goalData_2_1", null as unknown as ChartData),
        goalData_2_2: useSessionStorage("goalData_2_2", null as unknown as ChartData),
        goalData_2_3: useSessionStorage("goalData_2_3", null as unknown as ChartData),
        goalData_3_1: useSessionStorage("goalData_3_1", null as unknown as ChartData),
        goalData_3_2: useSessionStorage("goalData_3_2", null as unknown as ChartData),
        goalData_4_1: useSessionStorage("goalData_4_1", [] as Array<ChartData>),
        goalData_4_2: useSessionStorage("goalData_4_2", [] as Array<ChartData>),
    }),
    hydrate(state) {
        state.goalData_0_1 = useSessionStorage("goalData_0_1", null);
        state.goalData_2_1 = useSessionStorage("goalData_2_1", null);
        state.goalData_2_2 = useSessionStorage("goalData_2_2", null);
        state.goalData_2_3 = useSessionStorage("goalData_2_3", null);
        state.goalData_3_1 = useSessionStorage("goalData_3_1", null);
        state.goalData_3_2 = useSessionStorage("goalData_3_2", null);
        state.goalData_4_1 = useSessionStorage("goalData_4_1", []);
        state.goalData_4_2 = useSessionStorage("goalData_4_2", []);
    },
    actions: {
        reset(): void {
            this.goalData_0_1 = null;
            this.goalData_2_1 = null;
            this.goalData_2_2 = null;
            this.goalData_2_3 = null;
            this.goalData_3_1 = null;
            this.goalData_3_2 = null;
            this.goalData_4_1 = [];
            this.goalData_4_2 = [];
        }
    }
});