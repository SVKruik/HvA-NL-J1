<!-- @author Emir Bay -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AccountOverview",
    data() {
        return {
            formInputs: {
                address: "",
                age: "",
                companyFunction: "",
                companyName: "",
                gender: "",
                industry: "",
                name: "",
                postalCode: "",
                kvk: "",
                tag: ""
            },
            isClickable: false,
            originalData: null,
            entrepreneurData: null,
            partnerData: null,
            image: "https://files.stefankruik.com/uploads/events/K8VX5W0H.png"
        };
    },
    created() {
        this.status();
        this.userInfo();
        documentTitle("Account Overzicht")
    },
    methods: {
        async status() {
            if (!getItem("email")) return this.$router.push("/login");
            if (getItem("admin")) return this.$router.push("/account/settings");
        },
        /**
         * The inputs will be filled in advance, with the existing data of an entrepreneur or partner
         */
        async userInfo() {
            // Checks if user is an entrepreneur
            if (getItem("userType") === "Entrepreneur") {
                this.entrepreneurData = await fetchApi(`/entrepreneurs/findByEmail/${getItem("email")}`, "GET");
                this.formInputs = {
                    address: this.entrepreneurData.address,
                    age: this.entrepreneurData.age,
                    companyFunction: this.entrepreneurData.companyFunction,
                    companyName: this.entrepreneurData.companyName,
                    gender: this.entrepreneurData.gender,
                    industry: this.entrepreneurData.industry,
                    name: this.entrepreneurData.name,
                    postalCode: this.entrepreneurData.postalCode
                }
                if (this.entrepreneurData.ticket != null) {
                    this.image = `https://files.stefankruik.com/uploads/users/${this.formInputs.ticket}.png`;
                }
                this.originalData = { ...this.formInputs };
            } else if (getItem("userType") === "Partner") {
                // Checks if user is a partner
                this.partnerData = await fetchApi(`/partners/findByContactMail/${getItem("email")}`, "GET");
                this.formInputs = {
                    address: this.partnerData.address,
                    age: this.partnerData.age,
                    companyFunction: this.partnerData.companyFunction,
                    companyName: this.partnerData.companyName,
                    gender: this.partnerData.gender,
                    industry: this.partnerData.industry,
                    name: this.partnerData.name,
                    postalCode: this.partnerData.postalCode,
                    kvk: this.partnerData.kvk,
                    tag: this.partnerData.tag
                };
                if (this.formInputs.tag == null) {
                    this.formInputs.tag = "";
                }
                this.originalData = { ...this.formInputs };
            }
        },
        /**
         * Validates if user's input is correct. In addition, disables button if input is invalid and changes the color of input
         */
        async validateData() {
            const name = document.getElementById("name");
            const gender = document.getElementById("gender");
            const companyName = document.getElementById("company-name");
            const age = document.getElementById("age");
            this.isClickable = true;

            //Checks if name is empty or contains a character other than a letter
            if (!this.formInputs.name) {
                name.style.color = "black";
                name.style.backgroundColor = "papayawhip";
                this.isClickable = false;
            } else if (/[^a-zA-Z ]+/.test(this.formInputs.name) || this.formInputs.name === "") {
                name.style.color = "red";
                name.style.backgroundColor = "none";
                this.isClickable = false;
            } else {
                name.style.color = "black";
                name.style.backgroundColor = "transparent";
            }

            //Checks if age contains a letter or a space
            if (!this.formInputs.age) {
                age.style.color = "black";
            } else if (!/^\d+$/.test(this.formInputs.age)) {
                age.style.color = "red";
                this.isClickable = false;
            } else {
                age.style.color = "black";
            }

            //Checks if gender contains a character other than a letter
            if (!this.formInputs.gender) {
                gender.style.color = "black";
            } else if (/[^a-zA-Z]/.test(this.formInputs.gender)) {
                gender.style.color = "red";
                this.isClickable = false;
            } else {
                gender.style.color = "black";
            }

            //Checks if company name is empty
            if (!this.formInputs.companyName) {
                companyName.style.backgroundColor = "papayawhip";
                this.isClickable = false;
            } else {
                companyName.style.backgroundColor = "transparent";
            }
        },
        /**
         * Checks if user has written new data in the forms, based on that the button changes
         */
        async clickable() {
            await this.validateData();
            if (this.isClickable === true) {
                for (const input in this.formInputs) {
                    if (this.formInputs[input] != this.originalData[input]) {
                        document.querySelector(".btn-primary").style.backgroundColor = "var(--accent-b)";
                        document.querySelector(".btn-primary").style.cursor = "pointer";
                        return;
                    }
                }
            }
            document.querySelector(".btn-primary").style.backgroundColor = "grey";
            document.querySelector(".btn-primary").style.cursor = "not-allowed";
        },
        /**
         * Updates the data of an entrepreneur or partner with the changes made in the form
         */
        async updateUser() {
            if (this.isClickable) {
                if (getItem("userType") === "Entrepreneur") {
                    await fetchApi(`/entrepreneurs/update/${getItem("email")}`, "PUT", JSON.stringify(this.formInputs));
                } else {
                    await fetchApi(`/partners/update/${getItem("email")}`, "PUT", JSON.stringify(this.formInputs));
                }
                this.isClickable = false;
                document.querySelector(".btn-primary").style.backgroundColor = "grey";
                document.querySelector(".btn-primary").style.cursor = "not-allowed";
                this.originalData = { ...this.formInputs };
            }
        }
    }
};
</script>

<template>
    <main class='account-structure'>
        <!--      Account information-->
        <div class='account-information'>
            <!--     Personal information-->
            <div class='personal-information'>
                <h1 class='header-with-bg'>PERSOONLIJKE INFORMATIE</h1>
                <form class='personal-inputs'>
                    <input
                        id='name'
                        v-model='formInputs.name'
                        class='input'
                        placeholder='Naam'
                        @input='clickable'
                        @keyup='validateData'
                    />
                    <div class='input-styling'>
                        <input
                            id='age'
                            v-model='formInputs.age'
                            class='input'
                            placeholder='Leeftijd'
                            @input='clickable'
                            @keyup='validateData'
                        />
                        <input
                            id='gender'
                            v-model='formInputs.gender'
                            class='input'
                            placeholder='Geslacht'
                            @input='clickable'
                            @keyup='validateData'
                        />
                    </div>
                    <div class='input-styling'>
                        <input
                            id='address'
                            v-model='formInputs.address'
                            class='input'
                            placeholder='Adres'
                            @input='clickable'
                        />
                        <input
                            id='postal-code'
                            v-model='formInputs.postalCode'
                            class='input'
                            placeholder='Postcode'
                            @input='clickable'
                        />
                    </div>
                </form>
            </div>
            <!--     Company information-->
            <div class='company-information'>
                <h1 class='header-with-bg'>BEDRIJFS INFORMATIE</h1>
                <form class='personal-inputs'>
                    <input
                        id='company-name'
                        v-model='formInputs.companyName'
                        class='input'
                        placeholder='Bedrijfsnaam'
                        @input='clickable'
                        @keyup='validateData'
                    />
                    <div class='input-styling'>
                        <input
                            id='function'
                            v-model='formInputs.companyFunction'
                            class='input'
                            placeholder='Functie'
                            @input='clickable'
                            @keyup='validateData'
                        />
                        <input
                            id='business-type'
                            v-model='formInputs.industry'
                            class='input'
                            placeholder='Bedrijfstype'
                            @input='clickable'
                            @keyup='validateData'
                        />
                    </div>
                    <!--     If user is a partner, it will display additional information-->
                    <div v-if='this.partnerData != null' class='input-styling'>
                        <input
                            id='kvk'
                            v-model='formInputs.kvk'
                            class='input'
                            placeholder='Kvk'
                            @input='clickable'
                        />
                        <select
                            id='tag'
                            v-model='formInputs.tag'
                            @change='clickable'
                        >
                            <option disabled hidden selected value=''>
                                Tag
                            </option>
                            <option value='Chain partner'>Chain partner</option>
                            <option value='Knowledge partner'>
                                Knowledge partner
                            </option>
                        </select>
                    </div>
                </form>
            </div>
            <button
                :class='{ clickable: isClickable }'
                class='btn-primary'
                @click='updateUser'
            >
                Opslaan
            </button>
        </div>
        <!--     Profile image-->
        <div class='profile-image'>
            <img :src='image' alt='Profile Image' class='image'/>
        </div>
    </main>
</template>

<style scoped>
.account-structure {
    display: flex;
    justify-content: space-evenly;
    gap: 10px;
}

.account-information {
    display: flex;
    flex-direction: column;
    gap: 50px;
    width: 750px;
}

.personal-inputs {
    display: flex;
    flex-direction: column;
}

.input-styling {
    display: flex;
    gap: 15px;
}

#age {
    width: 100%;
    max-width: 350px;
}

#address {
    width: 100%;
    max-width: 550px;
}

#business-type,
#kvk,
#tag,
#function,
#gender,
#function {
    width: 100%;
    max-width: 400px;
}

.profile-image {
    max-width: 600px;
    max-height: 600px;
}

.image {
    max-width: 100%;
    max-height: 100%;
    display: block;
}

select {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--font-dark);
    padding: 8px 2px;
}

select:focus {
    outline: none;
}

.btn-primary {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: grey;
    cursor: not-allowed;
}

@media (width < 1350px) {
    .account-structure {
        flex-direction: column;
    }

    .account-information {
        width: 90%;
    }

    .image {
        display: none;
    }
}

@media (width < 940px) {
    .account-information {
        margin-left: 10px;
    }
}
</style>
