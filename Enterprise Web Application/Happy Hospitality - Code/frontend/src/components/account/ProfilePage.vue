<!-- @author Emir Bay -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "ProfilePage",
    data() {
        return {
            company: encodeURIComponent(this.$route.params.company),
            name: encodeURIComponent(this.$route.params.name),
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
            entrepreneurData: null,
            partnerData: null,
            image: "https://files.stefankruik.com/uploads/events/K8VX5W0H.png"
        };
    },
    created() {
        this.userInfo();
        documentTitle("Profiel")
    },
    methods: {
        /**
         * The inputs will be filled in advance, with the existing data of an entrepreneur or partner
         */
        async userInfo() {
            if (!getItem("email")) return this.$router.push("/login");
            // Checks if user is an entrepreneur
            this.entrepreneurData = await fetchApi(`/entrepreneurs/findProfile/${this.company}/${this.name}`, "GET");
            if (this.entrepreneurData.email != null) {
                this.formInputs = {
                    address: this.entrepreneurData.address,
                    age: this.entrepreneurData.age,
                    companyFunction: this.entrepreneurData.companyFunction,
                    companyName: this.entrepreneurData.companyName,
                    gender: this.entrepreneurData.gender,
                    industry: this.entrepreneurData.industry,
                    name: this.entrepreneurData.name,
                    postalCode: this.entrepreneurData.postalCode
                };
                if (this.entrepreneurData.ticket != null) {
                    this.image = `https://files.stefankruik.com/uploads/users/${this.formInputs.ticket}.png`;
                }
            } else {
                // Checks if user is a partner
                this.partnerData = await fetchApi(`/partners/findProfile/${this.company}/${this.name}`, "GET");
                if (this.partnerData.companyName == null) {
                    this.$router.push("/404");
                }
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
                        readonly
                    />
                    <div class='input-styling'>
                        <input
                            id='address'
                            v-model='formInputs.address'
                            class='input'
                            placeholder='Adres'
                            readonly
                        />
                        <input
                            id='postal-code'
                            v-model='formInputs.postalCode'
                            class='input'
                            placeholder='Postcode'
                            readonly
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
                        readonly
                    />
                    <div class='input-styling'>
                        <input
                            id='function'
                            v-model='formInputs.companyFunction'
                            class='input'
                            placeholder='Functie'
                            readonly
                        />
                        <input
                            id='business-type'
                            v-model='formInputs.industry'
                            class='input'
                            placeholder='Bedrijfstype'
                            readonly
                        />
                    </div>
                    <!--     If user is a partner, it will display additional information-->
                    <div v-if='this.partnerData != null' class='input-styling'>
                        <input
                            id='kvk'
                            v-model='formInputs.kvk'
                            class='input'
                            placeholder='Kvk'
                            readonly
                        />
                        <input
                            id='tag'
                            v-model='formInputs.tag'
                            class='input'
                            placeholder='Type Partner'
                            readonly
                        />
                    </div>
                </form>
            </div>
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
    align-items: center;
    height: 100vh;
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

#address {
    width: 100%;
    max-width: 550px;
}

#business-type,
#kvk,
#tag,
#function,
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

@media (width < 1400px) {
    .account-structure {
        flex-direction: column;
    }

    .account-information {
        margin-top: 75px;
        max-width: 720px;
        width: 90%;
    }

    .image {
        display: none;
    }
}
</style>
