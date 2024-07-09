import type { UserData } from "@/assets/customTypes";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useFileStore } from "./FileStore";

export const useUserStore = defineStore("UserStore", {
    state: () => {
        return {
            user: useStorage("user", {} as UserData)
        }
    },
    getters: {
        fullName(): string {
            return `${this.user.firstName || "Firstname"} ${this.user.lastName || "Lastname"}`;
        }
    },
    actions: {
        setUser(userData: UserData): void {
            this.user = userData;
        },
        signOut(): void {
            const fileStore = useFileStore();
            fileStore.signOut();
            this.setUser({} as UserData);
        }
    }
});