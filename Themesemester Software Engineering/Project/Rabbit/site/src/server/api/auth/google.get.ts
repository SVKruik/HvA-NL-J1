export default defineOAuthGoogleEventHandler({
    async onSuccess(event, result) {
        await setUserSession(event, result.user.id);
        return sendRedirect(event, "/");
    },
    onError(event, error) {
        logError(error);
        return sendRedirect(event, "/login");
    },
    config: {
        scope: ["userinfo.email", "userinfo.profile"],
        authorizationParams: {
            access_type: "offline",
        }
    }
});