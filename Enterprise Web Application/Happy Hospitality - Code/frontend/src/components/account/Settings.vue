<!-- @author Emir Bay -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";
import CryptoJS from "crypto-js";

export default {
    name: "UserSettings",
    data() {
        return {
            entrepreneurData: null,
            partnerData: null,
            adminData: null,
            password: null,
            newPassword: "",
            confirmPassword: ""
        };
    },
    created() {
        this.status();
        this.userInfo();
        documentTitle("Account Settings")
    },
    methods: {
        async status() {
            if (!getItem("email")) return this.$router.push("/login");
        },
        /**
         * Gathers user information
         * @returns
         */
        async userInfo() {
            // Checks if user is an entrepreneur, partner or an admin
            if (getItem("userType") === "Entrepreneur") {
                this.entrepreneurData = await fetchApi(`/entrepreneurs/findByEmail/${getItem("email")}`, "GET");
            }
            if (getItem("userType") === "Partner") {
                this.partnerData = await fetchApi(`/partners/findByContactMail/${getItem("email")}`, "GET");
            }
            if (getItem("userType") === "Admin/Superuser") {
                this.adminData = await fetchApi(`/superUsers/getByEmail/${getItem("email")}`, "GET");
            }
        },
        /**
         * Checks if password matches
         * @param userType Checks password conditions for the correct user data
         */
        async userPassword(userType) {
            if (userType.email) {
                if (CryptoJS.SHA256(this.password).toString() === userType.password) {
                    document.querySelector("#old-passsword").style.backgroundColor = "transparent";
                    if (this.newPassword === this.confirmPassword && this.newPassword && this.confirmPassword) {
                        return true;
                    } else {
                        alert("Nieuw wachtwoord komt niet overeen.");
                        document.querySelectorAll(".new-password").forEach(e => e.style.backgroundColor = "papayawhip");
                    }
                } else {
                    alert("Het opgegeven wachtwoord is onjuist.");
                    document.querySelectorAll(".new-password").forEach(e => e.style.backgroundColor = "transparent");
                    document.querySelector("#old-passsword").style.backgroundColor = "papayawhip";
                }
            }
        },
        /**
         * Updates the password of the user
         */
        async updatePassword() {
            //Updating entrepreneur password
            if (getItem("userType") === "Entrepreneur") {
                if (await this.userPassword(this.entrepreneurData)) {
                    await fetchApi(`/entrepreneurs/update/password/${getItem("email")}/${(CryptoJS.SHA256(this.newPassword).toString())}`, "PUT");
                    alert("Wachtwoord is gewijzigd!");
                    window.location.reload();
                }
                //Updating partner password
            } else if (getItem("userType") === "Partner") {
                if (await this.userPassword(this.partnerData)) {
                    await fetchApi(`/partners/update/password/${getItem("email")}/${(CryptoJS.SHA256(this.newPassword).toString())}`, "PUT");
                    alert("Wachtwoord is gewijzigd!");
                    window.location.reload();
                }
            }
            //Updating admin password
            else {
                if (getItem("userType") === "Admin/Superuser") {
                    if (await this.userPassword(this.adminData)) {
                        await fetchApi(`/superUsers/update/password/${getItem("email")}/${(CryptoJS.SHA256(this.newPassword).toString())}`, "PUT");
                        alert("Wachtwoord is gewijzigd!");
                        window.location.reload();
                    }
                }
            }
        }
    }
};
</script>

<template>
    <div class='settings-structure'>
        <h1 class='header-with-bg'>Wachtwoord veranderen</h1>
        <form class='password-inputs'>
            <input
                id='old-passsword'
                v-model='password'
                class='input'
                placeholder='Oud wachtwoord'
                type='password'
                @keyup.enter='updatePassword'
            />
            <input
                v-model='newPassword'
                class='input new-password'
                placeholder='Nieuw wachtwoord'
                type='password'
                @keyup.enter='updatePassword'
            />
            <input
                v-model='confirmPassword'
                class='input new-password'
                placeholder='Bevestig nieuw wachtwoord'
                type='password'
                @keyup.enter='updatePassword'
            />
        </form>
        <button @click='updatePassword'>Opslaan</button>
    </div>
</template>

<style scoped>
.settings-structure {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.password-inputs {
    display: flex;
    flex-direction: column;
    width: 700px;
}

@media (width < 1350px) {
    .password-inputs {
        width: 90%;
    }

    @media (width < 940px) {
        .settings-structure {
            margin-left: 10px;
        }
    }
}
</style>
