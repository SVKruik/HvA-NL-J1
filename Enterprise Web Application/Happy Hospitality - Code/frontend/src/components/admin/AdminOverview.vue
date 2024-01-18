<!-- @author Stefan Kruik -->

<script lang='js'>
import AdminCreateOverlay from "@/components/admin/AdminCreateOverlay.vue";
import AdminReturn from "@/components/admin/AdminReturn.vue";
import AdminUserItem from "@/components/admin/AdminUserItem.vue";
import { errorCustom, errorGeneral } from "@/utilities/errorController";
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";
import CryptoJS from "crypto-js";

export default {
    name: "AdminOverview",
    components: { AdminCreateOverlay, AdminUserItem, AdminReturn },
    created() {
        documentTitle("Administratie - Administratoren");
        if (!getItem("admin")) return this.$router.push("/");
        if (getItem("rank") !== "Administrator") return this.$router.push("/admin");
        this.populateElevatedUsers();
    },
    data() {
        return {
            admins: [],
            superUsers: [],
            showOverlay: false,
            creationType: ""
        };
    },
    methods: {
        async populateElevatedUsers() {
            const elevatedUsers = await fetchApi("/superUsers/all", "GET");
            for (let i = 0; i < elevatedUsers.length; i++) {
                if (elevatedUsers[i].admin === true) {
                    this.admins.push(this.elevatedUserConstructor(elevatedUsers[i], "Administrator"));
                } else this.superUsers.push(this.elevatedUserConstructor(elevatedUsers[i], "Super User"));
            }
        },
        elevatedUserConstructor(data, rank) {
            return {
                "name": data.name,
                "id": data.id,
                "email": data.email,
                "createdById": data.createdById,
                "blocked": data.blocked,
                "date": formatDateDMY(data.creation, "nl-NL"),
                "rank": rank,
                "disabled": false
            };
        },
        rankChange(id, currentRank) {
            // Preparing
            let loopArray = [];
            if (currentRank === "Super User") {
                loopArray = this.superUsers;
            } else if (currentRank === "Administrator") loopArray = this.admins;

            // Finding Target
            let elevatedUser = {};
            const index = loopArray.findIndex(elevatedUser => elevatedUser.id === id);
            elevatedUser = loopArray[index];

            // Moving the user
            if (index === -1) return;
            if (currentRank === "Super User") {
                elevatedUser.rank = "Administrator";
                this.superUsers.splice(index, 1);
                this.admins.push(elevatedUser);
            } else if (currentRank === "Administrator") {
                elevatedUser.rank = "Super User";
                this.admins.splice(index, 1);
                this.superUsers.push(elevatedUser);
            }
        },
        newSuperUser(type) {
            this.creationType = type;
            this.showOverlay = !this.showOverlay;
        },
        closeOverlay() {
            this.showOverlay = false;
        },
        async submitSuperUser(data) {
            const newUser = {
                "name": data.name,
                "id": data.id,
                "email": data.email,
                "createdById": data.createdById,
                "creation": data.creation,
                "blocked": data.blocked,
                "admin": data.admin
            };

            // Update Database
            delete newUser.id;
            newUser.password = CryptoJS.SHA256(data.password).toString();
            const request = await fetchApi("/superUsers/new", "POST", newUser);
            if (request.response && request.response.data) {
                if (request.response.status === 409) {
                    return errorCustom("Dit e-mailadres is al in gebruik. Probeer een ander e-mailadres.");
                } else return errorGeneral();
            } else {
                // Update View
                if (data.admin) {
                    this.admins.push(newUser);
                } else this.superUsers.push(newUser);

                // Finish
                alert(`${data.admin ? "Administrator" : "Super User"} succesvol aangemaakt.`);
                return this.closeOverlay();
            }
        }
    }
};
</script>

<template>
    <AdminCreateOverlay
        v-if='this.showOverlay'
        :type='this.creationType'
        @close='closeOverlay'
        @submit='this.submitSuperUser'
    ></AdminCreateOverlay>
    <AdminReturn></AdminReturn>
    <div class='header-container'>
        <h3>Administratoren</h3>
        <button type='button' @click="this.newSuperUser('Administrator')">
            <img alt='+' class='add-image' src='../../assets/icons/plus.svg'/>
        </button>
    </div>
    <AdminUserItem
        v-for='admin in this.admins'
        :id='admin.id'
        :key='admin.id'
        :blocked='admin.blocked'
        :date='admin.date'
        :disabled='admin.disabled'
        :email='admin.email'
        :name='admin.name'
        :rank='admin.rank'
        @rankChangeSuperUser='this.rankChange'
    ></AdminUserItem>
    <hr/>
    <div class='header-container'>
        <h3>Super Users</h3>
        <button type='button' @click="this.newSuperUser('Super User')">
            <img alt='+' class='add-image' src='../../assets/icons/plus.svg'/>
        </button>
    </div>
    <AdminUserItem
        v-for='superuser in this.superUsers'
        :id='superuser.id'
        :key='superuser.id'
        :blocked='superuser.blocked'
        :date='superuser.date'
        :disabled='superuser.disabled'
        :email='superuser.email'
        :name='superuser.name'
        :rank='superuser.rank'
        @rankChangeAdministrator='this.rankChange'
    ></AdminUserItem>
</template>

<style scoped>
h3 {
    font-weight: bold;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

button {
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: 2px solid var(--accent-b);
}

button:hover {
    background-color: var(--accent-b);
}

button:hover > * {
    rotate: 90deg;
}

.add-image {
    width: 15px;
    height: 15px;
}
</style>
