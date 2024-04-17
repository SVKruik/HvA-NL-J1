import { createRouter, createWebHistory } from "vue-router";
import StatisticsPage from "./components/StatisticsPage.vue";
import LoginPage from "./components/LoginPage.vue";
import UnauthorizedPage from "./components/UnauthorizedPage.vue";
import SessionExpiredPage from "./components/SessionExpiredPage.vue";

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active",
    routes: [
        { path: "/", component: LoginPage, props: true },
        { path: "/home", component: StatisticsPage, props: true },
        { path: "/statistics", component: StatisticsPage, props: true },
        { path: "/unauthorized", component: UnauthorizedPage, props: true },
        { path: "/session-expired", component: SessionExpiredPage, props: true },
        { path: "/:pathMatch(.*)", redirect: "/" }
    ]
});

export default router;
