<!-- @author Stefan Kruik -->

<script lang='js'>
import AdminReturn from "@/components/admin/AdminReturn.vue";
import UserItem from "@/components/admin/UserItem.vue";
import { errorGeneral } from "@/utilities/errorController";
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "EntrepreneurOverview",
    components: { UserItem, AdminReturn },
    created() {
        documentTitle("Administratie - Ondernemers");
        if (!getItem("admin")) return this.$router.push("/");
        if (getItem("rank") !== "Administrator") return this.$router.push("/admin");
        this.populateEntrepreneurs();
    },
    data() {
        return {
            entrepreneurList: []
        };
    },
    methods: {
        async populateEntrepreneurs() {
            this.entrepreneurList = await fetchApi("/entrepreneurs/all", "GET");
        },
        async blockEntrepreneur(id, event) {
            if (confirm("Weet u zeker dat u deze Ondernemer wilt (de)blokkeren?")) {
                await fetchApi(`/entrepreneurs/toggleBlock/${id}`, "PUT");
                if (event.target.innerHTML === "Deblokkeer") {
                    event.target.innerHTML = "Blokkeer";
                    event.target.classList.replace("unblock-button", "block-button");
                } else {
                    event.target.innerHTML = "Deblokkeer";
                    event.target.classList.replace("block-button", "unblock-button");
                }
            }
        },
        async deleteEntrepreneur(id, event) {
            if (confirm("Weet u zeker dat u deze Ondernemer wilt verwijderen?")) {
                const data = await fetchApi(`/entrepreneurs/delete/${id}`, "DELETE");
                if (!data.response) {
                    event.srcElement.parentNode.parentNode.parentNode.removeChild(event.srcElement.parentNode.parentNode);
                } else errorGeneral();
            }
        }
    }
};
</script>

<template>
    <AdminReturn></AdminReturn>
    <h3>Entrepreneurs</h3>
    <UserItem
        v-for='entrepreneur in this.entrepreneurList'
        :id='entrepreneur.id'
        :key='entrepreneur.id'
        :blocked-title='entrepreneur.blocked'
        :name='entrepreneur.name'
        :type="'Entrepreneurs'"
        @blockEntrepreneurs='this.blockEntrepreneur'
        @deleteEntrepreneurs='this.deleteEntrepreneur'
    ></UserItem>
</template>

<style scoped>
h3 {
    font-weight: bold;
}
</style>
