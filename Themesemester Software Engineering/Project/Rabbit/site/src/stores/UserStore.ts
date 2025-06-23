import type { RegisterPayload, UserData } from "~/assets/customTypes";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => {
        return {
            user: {} as UserData,
            registerUser: {} as RegisterPayload,
        };
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
    actions: {
        setUser(userData: UserData): void {
            this.user = userData;
        },
        async signOut(): Promise<void> {
            if (!this.isLoggedIn) return;
            const { clear: clearSession } = useUserSession();

            this.setUser({} as UserData);
            this.setRegisterUser({} as RegisterPayload);
            clearSession();
            navigateTo("/");
        },
        setRegisterUser(registerData: RegisterPayload): void {
            this.registerUser = registerData;
        },
    },
    getters: {
        isLoggedIn(): boolean {
            return !!this.user?.id;
        },
        isAdmin(): boolean {
            return this.user?.type === "Admin";
        },
    },
});
