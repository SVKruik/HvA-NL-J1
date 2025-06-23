/**
 * Routing middleware for protected pages.
 * Use `definePageMeta({ middleware: "auth"})` to register this middleware
 */
export default defineNuxtRouteMiddleware(async () => {
    const userStore = useUserStore();
    // if (!userStore || !userStore.isAdmin) return navigateTo("/");
});