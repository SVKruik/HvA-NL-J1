import type { BurrowSideBar } from "~/assets/customTypes";
import { defineStore } from "pinia";

/**
 * Store for managing the burrow sidebar.
 * @description This store handles the recent burrows displayed in the sidebar.
 */
export const useburrowSideBar = defineStore("burrowSideBar", {
    state: () => {
        return {
            recentBurrows: [] as BurrowSideBar[],
        };
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
    actions: {
        setburrowSideBar(recentBurrows: BurrowSideBar[]): void {
            this.recentBurrows = recentBurrows;
        },
        async signOut(): Promise<void> {
            if (!this.isLoggedIn) return;
            const { clear } = useUserSession();

            this.setburrowSideBar({} as BurrowSideBar[]);
            clear();
            navigateTo("/");
        },
        getRecentBurrows(): BurrowSideBar[] {
            return this.recentBurrows;
        },
        // Adds a burrow to the sidebar on spot one, if more than 5 burrows are present, the last one is removed.
        addBurrowToSidebar(burrow: BurrowSideBar): void {
            this.recentBurrows = this.recentBurrows.filter(
                (b) => b.name !== burrow.name,
            );

            this.recentBurrows = [burrow, ...this.recentBurrows].slice(0, 5);
        },
    },
    getters: {
        isLoggedIn(): boolean {
            const user = useUserStore();
            return !!user?.user.id;
        },
    },
});
