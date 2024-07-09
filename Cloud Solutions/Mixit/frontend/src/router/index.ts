import { createRouter, createWebHistory } from 'vue-router';

// Views
const HomeView = () => import('@/views/HomeView.vue');
const LoginView = () => import('@/views/LoginView.vue');

// Temporary Items
const TemporaryPage = () => import('@/pages/TemporaryPage.vue');
const TemporaryTab = () => import('@/tabs/TemporaryTab.vue');

// Pages
const HomeAccount = () => import('@/pages/HomeAccount.vue');
const HomeAdmin = () => import('@/pages/HomeAdmin.vue');
const HomeCreate = () => import('@/pages/HomeCreate.vue');
const HomeFiles = () => import('@/pages/HomeFiles.vue');

// Tabs (sub-pages)
const HomeFilesOrganization = () => import('@/tabs/HomeFilesOrganization.vue');
const HomeFilesAuthor = () => import('@/tabs/HomeFilesAuthor.vue');

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active-router-link",
    linkExactActiveClass: "active-exact-router-link",
    routes: [
        {
            path: "/",
            component: LoginView,
            props: true
        },
        {
            path: "/home", component: HomeView, props: true, children: [
                { path: "", redirect: "/home/files" },
                {
                    path: "files", component: HomeFiles, props: true, children: [
                        { path: "", redirect: "/home/files/organization" },
                        { path: "organization/:path?", component: HomeFilesOrganization, props: true },
                        { path: "author/:path?", component: HomeFilesAuthor },
                        { path: ":pathMatch(.*)", redirect: "/home/files/organization" }
                    ]
                },
                { path: "create", component: HomeCreate, props: true },
                { path: "admin", component: HomeAdmin, props: true },
                { path: "settings", component: TemporaryPage, props: true },
                { path: "account", component: HomeAccount, props: true },
                { path: ":pathMatch(.*)", redirect: "/panel/files" },
            ]
        },
        { path: "/:pathMatch(.*)", redirect: "/home/files" }
    ]
});

export default router;
