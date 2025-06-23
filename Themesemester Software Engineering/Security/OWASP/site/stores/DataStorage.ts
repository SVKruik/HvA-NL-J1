import { defineStore } from "pinia";
import { useSessionStorage } from "@vueuse/core";

export const useDataStorage = defineStore("useDataStorage", {
    state: () => ({
        data: useSessionStorage("data", null),
    }),
    hydrate(state) {
        state.data = useSessionStorage("data", null);
    },
    actions: {
        reset(): void {
            this.data = null;
        }
    }
});