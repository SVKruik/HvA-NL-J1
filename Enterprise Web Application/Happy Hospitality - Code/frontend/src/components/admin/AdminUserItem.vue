<!-- @author Stefan Kruik -->

<script lang='js'>
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AdminUserItem",
    props: {
        name: String,
        id: Number,
        date: String,
        email: String,
        rank: String,
        blocked: Boolean,
        disabled: Boolean
    },
    methods: {
        getItem,
        async changeRank(event) {
            const value = event.target.value;
            if (value === "Administrator") {
                const data = await fetchApi(`/superUsers/updateRank/${this.email}/1`, "PUT");
                if (!data.response) {
                    alert("Administrator succesvol geüpdatet.");
                    this.$emit("rankChangeAdministrator", this.id, this.rank);
                } else alert("Er ging iets mis tijdens het updaten van deze Administrator. Probeer later nog eens.");
            } else if (value === "Super User") {
                const data = await fetchApi(`/superUsers/updateRank/${this.email}/0`, "PUT");
                if (!data.response) {
                    alert("Super User succesvol geüpdatet.");
                    this.$emit("rankChangeSuperUser", this.id, this.rank);
                } else alert("Er ging iets mis tijdens het updaten van deze Super User. Probeer later nog eens.");
            }
        },
        async blockAdmin(event) {
            if (confirm(`Weet u zeker dat u deze ${this.rank} wilt (de)blokkeren?`)) {
                await fetchApi(`/superUsers/toggleBlock/${this.id}`, "PUT");
                if (event.target.innerHTML === "Deblokkeer") {
                    event.target.innerHTML = "Blokkeer";
                    event.target.classList.replace("unblock-button", "block-button");
                    alert(`${this.rank} succesvol gedeblokkeerd.`);
                } else {
                    event.target.innerHTML = "Deblokkeer";
                    event.target.classList.replace("block-button", "unblock-button");
                    alert(`${this.rank} succesvol geblokkeerd.`);
                }
            }
        },
        async deleteAdmin(email, event) {
            if (confirm(`Weet u zeker dat u deze ${this.rank} wilt verwijderen?`)) {
                const data = await fetchApi(`/superUsers/delete/${email}`, "DELETE");
                if (!data.response) {
                    event.srcElement.parentNode.parentNode.parentNode.removeChild(event.srcElement.parentNode.parentNode);
                    alert(`${this.rank} succesvol verwijderd.`);
                }
            }
        }
    },
    mounted() {
        if (this.email !== getItem("email")) this.$refs["admin-select"].value = this.rank;
    }
};
</script>

<template>
    <div class='admin-user-item'>
        <section class='information-container'>
            <p>{{ this.name }}</p>
            <p v-if="this.email === getItem('email')">(Ik)</p>
        </section>
        <hr v-if="this.email !== getItem('email')" class='hidden'/>
        <section
            v-if="this.email !== getItem('email')"
            class='control-container'
        >
            <select ref='admin-select' @change='this.changeRank($event)'>
                <option class='admin-option' value='Administrator'>
                    Administrator
                </option>
                <option class='admin-option' value='Super User'>
                    Super User
                </option>
            </select>
            <button
                :class="this.blocked ? 'unblock-button' : 'block-button'"
                @click='this.blockAdmin($event)'
            >
                {{ this.blocked ? "Deblokkeer" : "Blokkeer" }}
            </button>
            <button
                class='delete-button'
                @click='this.deleteAdmin(this.email, $event)'
            >
                Verwijder
            </button>
        </section>
    </div>
</template>

<style scoped>
.admin-user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid var(--accent-b);
    box-sizing: border-box;
    padding: 10px;
    height: 100px;
}

.information-container {
    display: flex;
    align-items: center;
    gap: 5px;
}

.control-container {
    display: flex;
    align-items: center;
}

select {
    background-color: transparent;
    border: none;
    outline: none;
    border-radius: 0;
    cursor: pointer;
}

button {
    width: 100px;
}

.block-button {
    background-color: transparent;
    color: orange;
}

.block-button:hover {
    color: coral;
    border: none;
}

.unblock-button {
    background-color: transparent;
    color: forestgreen;
}

.unblock-button:hover {
    border: none;
    color: darkgreen;
}

.delete-button {
    background-color: transparent;
    color: red;
}

.delete-button:hover {
    color: darkred;
    border: none;
}

.hidden {
    width: 100%;
    margin: 10px 0;
    display: none;
}

@media (width <= 680px) {
    .admin-user-item {
        flex-direction: column;
    }
}

@media (width <= 435px) {
    .admin-user-item {
        height: fit-content;
    }

    .control-container {
        flex-direction: column;
        gap: 10px;
    }

    .hidden {
        display: block;
    }
}
</style>
