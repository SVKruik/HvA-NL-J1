<!-- @author Stefan Kruik -->

<script lang='js'>
import AdminReturn from "@/components/admin/AdminReturn.vue";
import UserItem from "@/components/admin/UserItem.vue";
import { errorGeneral } from "@/utilities/errorController";
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "PartnerOverview",
    components: { UserItem, AdminReturn },
    created() {
        documentTitle("Administratie - Partners");
        if (!getItem("admin")) return this.$router.push("/");
        if (getItem("rank") !== "Administrator") return this.$router.push("/admin");
        this.populatePartners();
    },
    data() {
        return {
            partnerList: []
        };
    },
    methods: {
        async populatePartners() {
            this.partnerList = await fetchApi("/partners/all", "GET");
        },
        async blockPartner(id, event) {
            if (confirm("Weet u zeker dat u deze Partner wilt (de)blokkeren?")) {
                await fetchApi(`/partners/toggleBlock/${id}`, "PUT");
                if (event.target.innerHTML === "Deblokkeer") {
                    event.target.innerHTML = "Blokkeer";
                    event.target.classList.replace("unblock-button", "block-button");
                } else {
                    event.target.innerHTML = "Deblokkeer";
                    event.target.classList.replace("block-button", "unblock-button");
                }
            }
        },
        async deletePartner(id, event) {
            if (confirm("Weet u zeker dat u deze Partner wilt verwijderen?")) {
                const data = await fetchApi(`/partners/delete/${id}`, "DELETE");
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
    <h3>Partners</h3>
    <UserItem
        v-for='partner in this.partnerList'
        :id='partner.id'
        :key='partner.id'
        :blocked-title='partner.blocked'
        :name='partner.name'
        :type="'Partners'"
        @blockPartners='this.blockPartner'
        @deletePartners='this.deletePartner'
    ></UserItem>
</template>

<style scoped>
h3 {
    font-weight: bold;
}
</style>
