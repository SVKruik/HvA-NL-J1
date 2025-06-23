<template>
    <section class="content-wrapper">
        <div class="content flex">
            <div class="flex-col menu-item-container">
                <h1>Settings</h1>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Profile
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Account
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Billing
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings/integrations" active-class="active-nav-link">
                    Integrations
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Security
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Notifications
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Privacy
                </NuxtLink>
                <NuxtLink class="menu-item" to="/settings" active-class="active-nav-link">
                    Help
                </NuxtLink>
            </div>
            <NuxtPage />
        </div>
    </section>
</template>

<style scoped>
.content {
    align-items: flex-start;
    gap: 30px;
}

.menu-item-container {
    width: 200px;
}

.menu-item:first-of-type {
    margin-top: 20px;
}

.menu-item {
    color: var(--font);
    text-decoration: none;
    margin-bottom: 10px;
    display: block;
    box-sizing: border-box;
    padding: 10px;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    width: 100%;
}

.menu-item:hover {
    background-color: var(--fill);
}

.active-nav-link {
    background-color: var(--fill);
}
</style>
