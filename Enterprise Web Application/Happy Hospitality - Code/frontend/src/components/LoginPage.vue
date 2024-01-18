<!-- @author Emir Bay -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem, setItem } from "@/utilities/sessionController";
import CryptoJS from "crypto-js";

export default {
    name: "LoginPage",
    data() {
        return {
            email: "",
            password: "",
            imageSource: this.randomImage()
        };
    },
    created() {
        this.status();
        documentTitle("Inloggen")
    },
    methods: {
        async status() {
            if (getItem("email")) return this.$router.push("/");
        },
        /**
         * Displays a random image on the login page
         */
        randomImage() {
            const randomNumber = Math.random();
            if (randomNumber < 0.5) {
                return "https://files.stefankruik.com/uploads/events/K8VX5W0H.png";
            } else {
                return "https://files.stefankruik.com/uploads/events/R2P5I3G9.png";
            }
        },
        /**
         * Redirects to page when button is clicked
         * @param page Redirects to Home/Forgot password page
         */
        redirectPage(page) {
            this.$router.push(page).then(() => {
                window.location.reload();
            }).catch(error => {
                console.error(`Fout bij het omleiden naar ${page}:`, error);
            });
        },
        /**
         * Checks if data is correct and sets session Email
         * @param email User's entered email
         * @param password User's entered password
         */
        async checkUser(email, password) {
            const entrepreneurData = await fetchApi(`/entrepreneurs/findByEmail/${email}`, "GET");
            if (entrepreneurData.password) {
                //Check if user is blocked
                if (entrepreneurData.blocked) {
                    return alert("Gebruiker is geblokkeerd");
                }
                //Check if user's entered data is correct
                if (email === entrepreneurData.email && CryptoJS.SHA256(password).toString() === entrepreneurData.password) {
                    setItem("email", email);
                    setItem("userType", "Entrepreneur")
                    alert("Ingelogd!");
                    this.redirectPage("home");
                } else {
                    alert("Verkeerde gegevens!");
                }
            } else {
                const partnerData = await fetchApi(`/partners/findByContactMail/${email}`, "GET");
                if (partnerData.password) {
                    //Check if user is blocked
                    if (partnerData.blocked) {
                        return alert("Gebruiker is geblokkeerd");
                    }
                    //Check if user is a partner
                    if (partnerData) {
                        //Check if user's entered data is correct
                        if (email === partnerData.email && CryptoJS.SHA256(password).toString() === partnerData.password) {
                            setItem("email", email);
                            setItem("userType", "Partner")
                            alert("Ingelogd!");
                            this.redirectPage("home");
                        } else {
                            alert("Verkeerde gegevens!");
                        }
                    }
                } else {
                    //Check if user is an admin/super user
                    const adminData = await fetchApi(`/superUsers/getByEmail/${email}`, "GET");
                    //Check if user is blocked
                    if (adminData.blocked) {
                        return alert("Gebruiker is geblokkeerd");
                    }
                    //Check if user's entered data is correct
                    if (email === adminData.email && CryptoJS.SHA256(password).toString() === adminData.password) {
                        setItem("email", email);
                        setItem("userType", "Admin/Superuser")
                        alert("Ingelogd!");
                        this.redirectPage("home");
                    } else {
                        alert("Verkeerde gegevens!");
                    }
                }
            }
        }
    }
};
</script>

<template>
    <main class='login-structure'>
        <div class='login-container'>
            <h1 class='header-with-bg'>Inloggen</h1>
            <form class='login-form'>
                <input
                    id='email'
                    v-model='email'
                    class='input'
                    placeholder='Voer email in'
                    type='email'
                    @keyup.enter='checkUser(email, password)'
                />
                <input
                    id='password'
                    v-model='password'
                    class='input'
                    placeholder='Voer wachtwoord in'
                    type='password'
                    @keyup.enter='checkUser(email, password)'
                />
            </form>
            <div class='buttons'>
                <button class='btn-primary' @click='checkUser(email, password)'>
                    Login
                </button>
                <h5 class='forgot-password' @click="redirectPage('forgotPassword')">
                    Wachtwoord vergeten?
                </h5>
            </div>
        </div>
        <div class='login-image'>
            <img :src='imageSource' alt='HHC Login Image '/>
        </div>
    </main>
</template>

<style scoped>
.login-structure {
    display: flex;
    align-items: center;
    height: 100vh;
    gap: 60px;
}

.login-container {
    display: flex;
    flex-direction: column;
    margin-left: 60px;
    gap: 20px;
    width: 700px;
    height: 400px;
}

.login-form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
}

.buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

.forgot-password {
    cursor: pointer;
}

.login-image {
    height: 100%;
    width: 100%;
    margin-left: 0;
}

img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

@media (width < 768px) {
    .login-structure {
        flex-direction: column;
        height: 100%;
        gap: 0;
    }

    .login-container {
        margin-left: 0;
        margin-top: 125px;
        max-width: 300px;
    }

    .login-image {
        display: none;
    }
}
</style>
