<!-- @author Stefan Kruik -->

<script lang='js'>
import AdminPostItem from "@/components/admin/AdminPostItem.vue";
import AdminReturn from "@/components/admin/AdminReturn.vue";
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "PostOverview",
    components: { AdminPostItem, AdminReturn },
    async created() {
        documentTitle("Administratie - Artikelen");
        if (!getItem("admin")) return this.$router.push("/");
        this.postList = await fetchApi("/posts/all", "GET");
    },
    data() {
        return {
            postList: []
        };
    }
};
</script>

<template>
    <AdminReturn></AdminReturn>
    <h3>Artikelen</h3>
    <AdminPostItem
        v-for='post in this.postList'
        :id='post.id'
        :key='post.id'
        :author='post.author'
        :content='post.content'
        :date='post.date'
        :ticket='post.main_ticket'
        :title='post.title'
        :verified='post.verified'
    ></AdminPostItem>
</template>

<style scoped>
h3 {
    font-weight: bold;
}
</style>
