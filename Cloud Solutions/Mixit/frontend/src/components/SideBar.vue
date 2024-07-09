<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { convertImage } from '@/utils/files';
import { fetchLogout } from '@/utils/fetch';

export default defineComponent({
    name: "SideBar",
    data() {
        return {
            "menuVisible": false
        }
    },
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    mounted() {
        document.addEventListener("click", (event: MouseEvent) => {
            if (!event.target) return;
            if ((event.target as HTMLElement).id === "menu-item") return;
            this.menuVisible = false;
        });
    },
    methods: {
        /**
         * Clears the session and redirects to login view.
         */
        async signOut() {
            this.userStore.signOut()
            this.$cookies.remove("session");
            await fetchLogout();
            this.$router.push("/");
        },
        /**
         * Convert raw image data to a <img> src attribute compatible string.
         */
        convertRawImage(data: string) {
            return convertImage(data);
        }
    },
});
</script>

<template>
    <nav class="flex-col">
        <img alt="Mixit Logo" src="/Mixit Square.png">
        <section class="nav-content flex-col">
            <RouterLink class="router-link flex-col" to="/home/files">
                <i class="fa-solid fa-file"></i>
                <p>Bestanden</p>
            </RouterLink>
            <RouterLink class="router-link flex-col" to="/home/create">
                <i class="fa-solid fa-file-circle-plus"></i>
                <p>Creëer</p>
            </RouterLink>
            <RouterLink v-if="userStore.user.type === 'Member'" class="router-link flex-col" to="/home/admin">
                <i class="fa-solid fa-user-tie"></i>
                <p>Admin</p>
            </RouterLink>
            <RouterLink class="router-link flex-col" to="/home/settings">
                <i class="fa-solid fa-gear"></i>
                <p>Instellingen</p>
            </RouterLink>
            <div id="menu-item" class="router-link flex-col last-router-link">
                <img :src="convertRawImage(userStore.user.image)" alt="Profile Picture" class="profile-picture">
                <p>Account</p>
                <menu id="menu-item" :class="menuVisible ? 'visible' : ''">
                    <strong id="menu-item">{{ userStore.fullName }}</strong>
                    <span id="menu-item" class="splitter"></span>
                    <RouterLink title="Bekijk Account Details" active-class="unset" exact-active-class="unset"
                        class="menu-button" to="/home/account">
                        Account</RouterLink>
                    <button title="Ondersteuning" type="button" class="menu-button">Help</button>
                    <span class="splitter end-divider"></span>
                    <button title="Uitloggen" type="button" class="menu-button" @click="signOut()">Uitloggen</button>
                </menu>
                <span id="menu-item" class="click-item" @click="menuVisible = true"></span>
            </div>
        </section>
    </nav>
</template>

<style scoped>
nav {
    background-color: var(--color-accent);
    width: fit-content;
    height: 100%;
    position: fixed;
    gap: 40px;
    box-sizing: border-box;
    padding: 5px;
    align-items: center;
}

img {
    width: 60px;
}

.nav-content {
    align-items: center;
    gap: 10px;
    height: 100%;
}

nav p,
i {
    color: var(--color-text-light);
}

.profile-picture {
    width: 40px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
}

.last-router-link {
    margin-top: auto;
    position: relative;
}

menu {
    position: absolute;
    left: 5px;
    bottom: 5px;
    display: none;
    flex-direction: column;
    background-color: var(--color-accent-light);
    height: 200px;
    width: 200px;
    box-sizing: border-box;
    padding: 10px;
    gap: 10px;
    border-radius: var(--border-radius-mid);
    z-index: 2;
}

menu .splitter {
    background-color: var(--color-accent);
}

menu strong,
menu p {
    color: var(--color-text-light);
}

.visible {
    display: flex;
}

.menu-button {
    background-color: var(--color-main);
    width: 100%;
    color: var(--color-text);
    border-radius: var(--border-radius-low);
    box-sizing: border-box;
    padding: 5px;
    height: 30px;
    justify-content: flex-start;
}

.menu-button:hover {
    background-color: var(--color-fill);
}

.end-divider {
    margin-top: auto;
}

.router-link {
    align-items: center;
    width: 100px;
    border-radius: var(--border-radius-low);
    box-sizing: border-box;
    padding: 5px 0;
}

.active-router-link,
.active-exact-router-link {
    background-color: var(--color-accent-light);
}
</style>