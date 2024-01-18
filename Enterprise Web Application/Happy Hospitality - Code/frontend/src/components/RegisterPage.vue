<!-- @author Mike Schaper -->

<script lang="js">
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import CryptoJS from "crypto-js";

export default {
    name: "RegisterPage",
    data() {
        return {
            role: "",
            formInputs: {
                companyName: "",
                email: "",
                name: "",
                password: "",
                confirmPassword: ""
            },
            errorMessage: "",
            entrepreneurData: null,
            partnerData: null
        };
    },
    mounted() {
        documentTitle("Registratie");
    },
    created() {
        this.role = "entrepreneur";
        this.errorMessage = "";
    },
    methods: {
        /**
         * Set the partner property.
         * @param {String} p - The new value for the partner property.
         */
        setRole(p) {
            this.role = p;
        },

        /**
         * Formats a JavaScript Date object into a string of the format 'YYYY-MM-DD'.
         *
         * @param {Date} date - The Date object to format.
         * @returns {string} A string representing the formatted date.
         */
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");

            return `${year}-${month}-${day}`;
        },

        async createUser() {
            // Check if the user has filled out all the necessary fields
            if (
                !this.formInputs.name ||
                !this.formInputs.email ||
                !this.formInputs.companyName ||
                !this.formInputs.password ||
                !this.formInputs.confirmPassword
            ) {
                this.errorMessage = "Please fill out all the fields";
                return;
            }

            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(this.formInputs.email)) {
                this.errorMessage = "Please enter a valid email address";
                return;
            }

            // Check if passwords match
            if (this.formInputs.password !== this.formInputs.confirmPassword) {
                this.errorMessage = "The passwords do not match";
                return;
            }

            // Prepare the data to send in the POST request
            const userData = {
                name: this.formInputs.name,
                email: this.formInputs.email,
                companyName: this.formInputs.companyName,
                password: this.encryptPassword(this.formInputs.password),
                creation: this.formatDate(new Date()),
                blocked: 0
            };

            // const emailCheckResponse = await fetchApi(`/entrepreneurs/findByEmail/${this.formInputs.email}`, "GET");

            //     if (!emailCheckResponse.ok) {
            //         alert('Email already exists. Please use a different email.');
            //     }

            const endpoint = this.role === "entrepreneur" ? "/entrepreneurs/save" : "/partners/save";
            try {
                await fetchApi("/mail/general", "POST", {
                    "receivers": [this.formInputs.email], "content": `<p>
                    We zijn blij u te mogen verwelkomen bij HHC! Uw registratie is succesvol verlopen en u maakt nu deel uit van een gemeenschap die evenementen hoog in het vaandel draagt.
                    </br></br>
                    Hulp Nodig?</br>
                    Ons team staat klaar om te helpen. Als u vragen heeft of ondersteuning nodig heeft, neem gerust contact met ons op.
                    </br></br>
                    Blijf Verbonden met ons op
                    <a href="https://instagram.com/happyhospitalitycollective?igshid=MzRlODBiNWFlZA=="
                    target="_blank">Instagram</a>
                    &
                    <a href="https://www.linkedin.com/company/happy-hospitality-collective"
                    target="_blank">LinkedIn</a>
                    om op de hoogte te blijven van het laatste nieuws en gebeurtenissen in de gemeenschap.
                    </br></br>
                    Bedankt voor het kiezen van HHC. We kijken ernaar uit om u te ondersteunen en met u in contact te komen.</p>`
                });
                await fetchApi(endpoint, "POST", JSON.stringify(userData));


                this.errorMessage = "";
                this.redirectPage("home");
            } catch (err) {
                this.errorMessage = "An error occurred during the API call: " + err.message;
            }
        },

        /**
         * Hashes a password using SHA-256.
         *
         * @param {string} password - The plaintext password to be hashed.
         * @returns {string} The hashed password.
         */
        encryptPassword(password) {
            return CryptoJS.SHA256(password).toString();
        },

        /**
         * Redirects to page when button is clicked
         * @param {string} page Redirects to Home/Forgot password page
         */
        redirectPage(page) {
            this.$router.push(page);
        }
    }
};
</script>

<template>
    <section class="register-section">
        <div class="left-side">
            <h1 class="header-with-bg">Registreren</h1>
            <div class="input-wrapper">
                <input
                    id="name"
                    v-model="formInputs.name"
                    class="input"
                    placeholder="Naam"
                    type="text"
                />
                <input
                    id="email"
                    v-model="formInputs.email"
                    class="input"
                    placeholder="E-mail"
                    type="email"
                />
                <input
                    id="company"
                    v-model="formInputs.companyName"
                    class="input"
                    placeholder="Bedrijf"
                    type="text"
                />
                <input
                    id="password"
                    v-model="formInputs.password"
                    class="input"
                    placeholder="Wachtwoord"
                    type="password"
                />
                <input
                    id="confirmPassword"
                    v-model="formInputs.confirmPassword"
                    class="input"
                    placeholder="Bevestig wachtwoord"
                    type="password"
                />
                <div class="role-btns">
                    <div
                        :class="{ isActive: role === 'entrepreneur' }"
                        class="entrepreneur"
                        @click="setRole('entrepreneur')"
                    >
                        <p>Entrepreneur</p>
                    </div>
                    <div
                        :class="{ isActive: role === 'partner' }"
                        class="partner"
                        @click="setRole('partner')"
                    >
                        <p>Partner</p>
                    </div>
                </div>
                <div class="error-wrapper">
                    <p class="error">{{ errorMessage }}</p>
                </div>
                <button class="btn-primary" @click.prevent="createUser">
                    Versturen
                </button>
            </div>
        </div>
        <div class="img-wrapper">
            <img
                alt="HHC event sample"
                src="../assets/images/static/image0.png"
            />
        </div>
    </section>
</template>

<style scoped>
.register-section {
    height: 100vh;
    display: flex;
    align-items: center;
    gap: 60px;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
}

.left-side {
    flex: 1;
    margin-left: 60px;
}

.img-wrapper {
    flex: 2;
    height: 100%;
    width: 100%;
}

img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.header-with-bg {
    margin-bottom: 60px;
}

.btn-primary {
    margin-top: 24px;
}

.role-btns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    text-align: center;
    border: 1px solid var(--accent-b-hover);
    margin-top: 16px;
}

.partner,
.entrepreneur {
    padding: 16px 0;
    cursor: pointer;
    color: var(--font-opacity);
}

.partner:hover,
.entrepreneur:hover {
    color: var(--font-dark);
}

.entrepreneur {
    border-right: 1px solid var(--accent-b-hover);
}

.isActive {
    background-color: var(--accent-b);
    color: white !important;
}

.error-wrapper {
    height: 16px;
    margin-top: 20px;
}

.error {
    color: red;
}

@media (width <= 800px) {
    .left-side {
        margin: 60px 20px 0 20px;
        width: calc(100% - 40px);
    }

    .register-section {
        flex-direction: column;
        height: auto;
    }

    .img-wrapper {
        height: 100%;
        flex: 1;
        aspect-ratio: 16/9;
    }
}
</style>
