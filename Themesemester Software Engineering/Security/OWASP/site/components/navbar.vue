<template>
    <header>
        <nav class="flex">
            <div>
                <h3>HvA SSRF</h3>
            </div>
            <div>
                <input type="text" placeholder="Search">
            </div>
            <div class="flex">
                <NuxtLink to="/" class="nav-link" active-class="active-nav-link">Home</NuxtLink>
                <NuxtLink to="/docs" class="nav-link" active-class="active-nav-link">Documentation</NuxtLink>
                <NuxtLink to="/settings" class="nav-link" active-class="active-nav-link">Settings</NuxtLink>
            </div>
        </nav>
    </header>
</template>

<style scoped>
header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 30px;
}

nav {
    width: 100%;
    justify-content: space-between;
}

input {
    border: 1px solid var(--border);
    padding: 5px;
    border-radius: var(--border-radius-low);
    width: 300px;
    user-select: none;
    pointer-events: none;
}

.main-nav {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    margin-bottom: 35px;
}

.nav-link {
    color: var(--font);
    text-decoration: none;
}
</style>