<!-- @author Stefan Kruik -->

<script lang='js'>
import { formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem, setItem } from "@/utilities/sessionController";

export default {
    name: "AdminPage",
    created() {
        this.check();
    },
    data() {
        return {
            name: "",
            id: -1,
            email: "",
            date: "",
            createdByName: null,
            createdById: null,
            rank: getItem("rank")
        };
    },
    methods: {
        async check() {
            const loggedInEmail = getItem("email");
            if (!loggedInEmail) return this.$router.push("/");

            // Check Admin Status
            const adminData = await fetchApi(`/superUsers/getByEmail/${loggedInEmail}`, "GET");
            if (!adminData.id) return this.$router.push("/");
            await this.setup(adminData);
        },
        /**
         * Load all page components and functions.
         * @param adminData Info of the logged-in admin.
         */
        async setup(adminData) {
            this.name = adminData.name;
            this.id = adminData.id;
            this.email = adminData.email;
            this.date = formatDateDMY(adminData.creation, "nl-NL");
            setItem("adminId", adminData.createdById);
            if (adminData.createdById !== -1) {
                const parentAdmin = await fetchApi(`/superUsers/findById/${adminData.createdById}`, "GET");
                this.createdByName = parentAdmin.name;
                this.createdById = parentAdmin.id;
            }
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <div class='info-wrapper'>
            <div class='sub-script-wrapper'>
                <h3>Welkom, {{ this.name }}</h3>
                <small>({{ this.id }})</small>
            </div>
            <p>Email: {{ this.email }}</p>
            <p>Rang: {{ this.rank }}</p>
            <p>Sinds: {{ this.date }}</p>
            <div v-if='createdById !== null' class='sub-script-wrapper'>
                <p>Aangemaakt door:</p>
                <div class='nested-sub-script-wrapper'>
                    <p>{{ this.createdByName }}</p>
                    <small>({{ this.createdById }})</small>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<style scoped>
h3 {
    font-weight: bold;
}

.content-wrapper {
    padding-top: 140px;
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.info-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sub-script-wrapper {
    flex-wrap: wrap;
}

.sub-script-wrapper,
.nested-sub-script-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
}

@media (width <= 385px) {
    .content-wrapper {
        width: 90%;
    }
}
</style>
