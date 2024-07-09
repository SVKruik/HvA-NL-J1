<script lang="ts">
import { defineComponent } from 'vue';
import { type PopupItem, PromptTypes } from '@/assets/customTypes';
import { useUserStore } from '@/stores/UserStore';
import { createTicket } from '@/utils/ticket';
import { fetchUserDetails, fetchValidateSession } from '@/utils/fetch';

export default defineComponent({
    name: "LoginView",
    emits: [
        "popup"
    ],
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    async created() {
        // Parse Email
        const userEmail = new URLSearchParams(window.location.search).get('user');
        this.$router.push("/");

        // Fetch & set userdata
        if (!userEmail) return;
        const userData = await fetchUserDetails(userEmail);
        if (userData && typeof userData === "object") {
          this.userStore.setUser(userData);
          setTimeout(() => {
            this.$router.push("/home");
            }, 1000);
        }
    },
    methods: {
        /**
         * Logs the user in and creates a session.
         */
        async login(event: MouseEvent): Promise<void> {
            const button: HTMLButtonElement = (event.target as HTMLSpanElement).parentElement as HTMLButtonElement;
            if (button.disabled) return;

            // UI
            const spinner: HTMLElement = this.$refs["buttonSpinner"] as HTMLElement;
            button.disabled = true;
            button.classList.add("disabled");
            spinner.classList.add("visible");

            const sessionKey = this.$cookies.get("session");
            if (sessionKey) {
                // Cookie Validation
                const validSession = await fetchValidateSession();
                if (typeof validSession === "boolean") {
                    // Use localhost for development
                    // location.href = "http://localhost:5000/login";
                  location.href = "https://mixit-backend.azurewebsites.net/login";
                  return;
                }

                // Check Localstorage
                if (!this.userStore.user.id) {
                    const userData = await fetchUserDetails(validSession.user);
                    if (userData && typeof userData === "object") this.userStore.setUser(userData);
                }

                // Complete
                this.$router.push("/home");
                this.$emit("popup", {
                    "id": createTicket(),
                    "type": PromptTypes.success,
                    "message": `Ingelogd als ${this.userStore.user.firstName} ${this.userStore.user.lastName} (${this.userStore.user.email}).`,
                    "expiryMilliseconds": 4000
                } as PopupItem);
            } else {
                // Use localhost for development
                // location.href = "http://localhost:5000/login";
                location.href = "https://mixit-backend.azurewebsites.net/login";
                return;
            }
        },
        /**
         * To be implemented.
         */
        loginProblem(): void {
            this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.warning,
                "message": `Het accountherstel en andere inlog-opties zijn nog WIP.`,
                "expiryMilliseconds": 7000
            } as PopupItem);
        }
    }
});
</script>

<template>
    <main>
        <section class="login-content shadow flex-col">
            <div class="header-container flex-col">
                <img alt="Microsoft Logo" class="partner-logo-image" src="/Mixit.svg">
                <h2>Mixit PowerFiles</h2>
            </div>
            <div class="button-container flex-col">
                <button class="login-button flex" title="Login" type="button">
                    <span @click="login($event)" class="click-item"></span>
                    <div class="button-content flex">
                        <img src="/Microsoft Square.png" alt="MS" class="login-button-image">
                        <p class="color-invert">Login met Microsoft</p>
                    </div>
                    <i class="fa-solid fa-spinner fa-spin button-spinner" ref="buttonSpinner"></i>
                </button>
                <button class="login-problem-button" @click="loginProblem()" type="button">Problemen met
                    inloggen?</button>
            </div>
        </section>
        <img alt="Mixit Logo" class="company-logo-image" src="/Mixit.png">
        <span class="background-triangle"></span>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.company-logo-image {
    position: absolute;
    top: 20px;
    left: 20px;
}

.background-triangle {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 750px 1000px 750px 0;
    border-color: transparent var(--color-accent) transparent transparent;
    left: -150px;
}

.login-content {
    z-index: 1;
    background-color: var(--color-main-off);
    gap: 50px;
    height: 450px;
    width: 400px;
    box-sizing: border-box;
    padding: 30px;
    align-items: center;
}

.button-container,
.header-container {
    align-items: center;
}

.header-container {
    gap: 20px;
}

.button-container {
    align-self: center;
    justify-self: center;
}

.login-button {
    position: relative;
    width: 300px;
    height: 40px;
    justify-content: space-between;
    gap: 20px;
    background-color: var(--color-fill);
}

.button-content {
    gap: 20px;
}

.login-button .click-item {
    margin-left: -10px;
}

.button-spinner {
    opacity: 0;
}

.login-button-image {
    width: 30px;
    height: 30px;
}

.login-button p {
    color: var(--color-text);
}

.login-problem-button {
    font-size: small;
    background-color: transparent;
    color: var(--color-info);
    font-style: italic;
    width: fit-content;
    padding: 0 0 0 5px;
}

.visible {
    opacity: 1;
}
</style>
