<!-- @author Emir Bay -->

<script lang='js'>
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AccountPage",
    methods: { getItem }
};
</script>

<template>
    <main class='page-structure'>
        <div class='sidebar-structure'>
            <div class='sidebar'>
                <router-link
                    v-if="getItem('admin') !== 'true'"
                    active-class='current'
                    class='option'
                    to='/account/overview'
                >Overzicht
                </router-link>
                <router-link
                    v-if="getItem('admin') !== 'true'"
                    active-class='current'
                    class='option'
                    to='/account/events'
                >Evenementen
                </router-link>
                <router-link
                    active-class='current'
                    class='option'
                    to='/account/settings'
                >Settings
                </router-link>
            </div>
            <div class='vertical-line'></div>
            <router-view class='content'></router-view>
        </div>
    </main>
</template>

<style scoped>
.page-structure {
    display: flex;
    align-items: center;
    height: 100vh;
    gap: 50px;
    margin-bottom: 50px;
}

.sidebar-structure {
    display: flex;
    flex-direction: row;
    height: 400px;
    width: 100%;
}

.sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 120px;
    margin-bottom: 120px;
}

.option {
    display: flex;
    justify-content: center;
    width: 200px;
    border-bottom: 1px solid var(--font-dark);
    padding: 16px 2px;
    text-decoration: none;
}

.option:hover {
    background-color: lightgrey;
}

.current {
    background-color: lightgrey;
}

.vertical-line {
    height: 500px;
    width: 1px;
    background-color: var(--font-dark);
}

.content {
    margin-left: 75px;
    align-items: flex-start;
}

@media (width < 940px) {
    .page-structure {
        justify-content: center;
    }

    .sidebar-structure {
        flex-direction: column;
        height: 630px;
        align-items: center;
    }

    .vertical-line {
        display: none;
    }

    .sidebar {
        flex-direction: row;
        margin-left: 0;
        margin-bottom: 0;
        width: 100vw;
        justify-content: center;
    }

    .content {
        margin-top: 20px;
        margin-left: 0;
    }
}
</style>
