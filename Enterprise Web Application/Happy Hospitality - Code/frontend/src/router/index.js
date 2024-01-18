import AboutPage from "@/components/AboutPage.vue";
import AccountEvents from "@/components/account/AccountEvents.vue";
import AccountOverview from "@/components/account/AccountOverview.vue";
import AccountPage from "@/components/account/AccountPage.vue";
import ProfilePage from "@/components/account/ProfilePage.vue";
import Settings from "@/components/account/Settings.vue";
import AdminLanding from "@/components/admin/AdminLanding.vue";
import AdminOverview from "@/components/admin/AdminOverview.vue";
import AdminPage from "@/components/admin/AdminPage.vue";
import AdminPostOverview from "@/components/admin/AdminPostOverview.vue";
import AdminStatistics from "@/components/admin/AdminStatistics.vue";
import EntrepreneurOverview from "@/components/admin/EntrepreneurOverview.vue";
import EventOverview from "@/components/admin/EventOverview.vue";
import PartnerOverview from "@/components/admin/PartnerOverview.vue";
import EventCreate from "@/components/EventCreate.vue";
import EventDetails from "@/components/EventDetails.vue";
import UpcomingEventsOverview from "@/components/events/UpcomingEventsOverview.vue";
import ForgotPassword from "@/components/ForgotPassword";
import HomePage from "@/components/home/HomePage.vue";
import LoginPage from "@/components/LoginPage.vue";
import NewsDetails from "@/components/news/NewsDetails.vue";
import NotFoundPage from "@/components/NotFoundPage.vue";
import PostCreate from "@/components/posts/PostCreate.vue";
import PostDetails from "@/components/posts/PostDetails.vue";
import PostsOverview from "@/components/posts/PostsOverview.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import CryptoSample from "@/components/samples/CryptoSample.vue";
import RequestSample from "@/components/samples/RequestSample.vue";
import UploadSample from "@/components/samples/UploadSample.vue";
import ThemeDetails from "@/components/themeDetails/ThemeDetails.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        // Home
        { path: "/", component: HomePage },
        { path: "/home", name: "home", redirect: "/" },

        // Account
        { path: "/register", name: "register", component: RegisterPage },
        { path: "/login", name: "login", component: LoginPage },
        { path: "/forgotPassword", name: "forgotPassword", component: ForgotPassword },
        {
            path: "/profile/:company/:name",
            name: "profile",
            component: ProfilePage
        },
        {
            path: "/account",
            name: "account",
            redirect: { name: "account-overview" },
            component: AccountPage,
            children: [
                {
                    path: "overview",
                    name: "account-overview",
                    component: AccountOverview
                },
                {
                    path: "settings",
                    name: "account-settings",
                    component: Settings
                },
                {
                    path: "events",
                    name: "account-events",
                    component: AccountEvents
                }
            ]
        },

        // Events
        { path: "/events", name: "events", component: UpcomingEventsOverview },
        { path: "/events/:id", name: "event", component: EventDetails },
        { path: "/events/new", name: "event-create", component: EventCreate },

        // Posts
        { path: "/posts", name: "posts", component: PostsOverview },
        { path: "/posts/:id", name: "post", component: PostDetails },
        { path: "/posts/new", name: "post-create", component: PostCreate },

        // Other
        { path: "/about", name: "about", component: AboutPage },
        {
            path: "/admin",
            name: "admin",
            redirect: { name: "landing" },
            component: AdminPage,
            children: [
                {
                    path: "admins",
                    name: "admins",
                    component: AdminOverview
                },
                {
                    path: "partners",
                    name: "partners",
                    component: PartnerOverview
                },
                {
                    path: "entrepreneurs",
                    name: "entrepreneurs",
                    component: EntrepreneurOverview
                },
                {
                    path: "statistics",
                    name: "statistics",
                    component: AdminStatistics
                },
                {
                    path: "posts",
                    name: "posts-overview",
                    component: AdminPostOverview
                },
                {
                    path: "events",
                    name: "event-overview",
                    component: EventOverview
                },
                { path: "", name: "landing", component: AdminLanding }
            ]
        },
        { path: "/themes/:name", name: "themes", component: ThemeDetails },
        { path: "/news/:id", name: "news", component: NewsDetails },

        // Samples (Dev)
        {
            path: "/uploadSample",
            name: "upload-sample",
            component: UploadSample
        },
        {
            path: "/requestSample",
            name: "request-sample",
            component: RequestSample
        },
        {
            path: "/cryptoSample",
            name: "crypto-sample",
            component: CryptoSample
        },

        // Fallback
        { path: "/404", component: NotFoundPage },
        { path: "/:pathMatch(.*)", redirect: "/404" }
    ]
});

export default router;
