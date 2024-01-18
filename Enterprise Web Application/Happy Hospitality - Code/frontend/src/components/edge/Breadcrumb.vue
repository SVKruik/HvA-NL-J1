<!-- @author Mike Schaper -->

<template>
    <nav v-if="shouldShowBreadcrumb" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li
                v-for="(route, index) in breadcrumbList"
                :key="index"
                class="breadcrumb-item"
            >
                <router-link
                    v-if="index < breadcrumbList.length - 1"
                    :to="route.path"
                    >{{ route.name }}</router-link
                >
                <span v-else>{{ route.name }}</span>
                <span v-if="index < breadcrumbList.length - 1"> / </span>
            </li>
        </ol>
    </nav>
</template>

<script>
export default {
    name: "Breadcrumb",
    computed: {
        breadcrumbList() {
            let pathArray = this.$route.path.split("/");
            pathArray = pathArray.filter((path) => path !== "");

            const breadcrumbs = pathArray.map((path, index) => {
                return {
                    name: path.charAt(0).toUpperCase() + path.slice(1),
                    path: "/" + pathArray.slice(0, index + 1).join("/"),
                };
            });

            return [{ name: "Home", path: "/" }, ...breadcrumbs];
        },
        shouldShowBreadcrumb() {
            return this.$route.path !== "/";
        },
    },
};
</script>

<style>
.breadcrumb {
    position: fixed;
    top: 77px;
    padding-top: 10px;
    padding-left: 80px;
    width: 100%;
    left: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 10px;
}
</style>
