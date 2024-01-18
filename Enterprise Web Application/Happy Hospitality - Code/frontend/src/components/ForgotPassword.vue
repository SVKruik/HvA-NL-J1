<!-- @author Milou Hogendoorn -->

<script lang='js'>
import { fetchApi } from "@/utilities/networkController";
import { createOTP } from "@/utilities/OTPController";
import CryptoJS from "crypto-js";

export default {
    name: "ForgotPassword",
    data() {
        return {
            email: "",
            OTP: "",
            imageSource: this.randomImage()
        };
    },
    methods: {
        /**
         * Displays a random image on the forgot password page
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
        async checkUser(email) {
            const entrepreneurData = await fetchApi(`/entrepreneurs/findByEmail/${email}`, "GET");
            if (entrepreneurData.blocked) {
                return alert("Gebruiker is geblokkeerd");
            }
            if (email === entrepreneurData.email) {
                this.OTP = createOTP();
                await this.sendEmail(email, this.OTP)
                await fetchApi(`/entrepreneurs/update/password/${email}/${(CryptoJS.SHA256(this.OTP).toString())}`, "PUT");
            } else {
                const partnerData = await fetchApi(`/partners/findByContactMail/${email}`, "GET");
                if (partnerData.blocked) {
                    return alert("Gebruiker is geblokkeerd");
                }
                if (email === partnerData.email) {
                    this.OTP = createOTP();
                    await this.sendEmail(email, this.OTP)
                    await fetchApi(`/partners/update/password/${email}/${(CryptoJS.SHA256(this.OTP).toString())}`, "PUT");
                } else {
                    const adminData = await fetchApi(`/superUsers/getByEmail/${email}`, "GET");
                    if (adminData.blocked) {
                        return alert("Gebruiker is geblokkeerd");
                    }
                    if (email === adminData.email) {
                        this.OTP = createOTP();
                        await this.sendEmail(email, this.OTP)
                        await fetchApi(`/superUsers/update/password/${email}/${(CryptoJS.SHA256(this.OTP).toString())}`, "PUT");
                    }
                }
            }
        },

        async sendEmail(email, OTP) {
            try {
                await fetchApi("/mail/general", "POST", {
                    "receivers": [email], "content": `<p>
                    </br>
                    Log met onderstaande code in op de website, dit is uw tijdelijke wachtwoord.
                    </br>
                      <h1>${OTP}</h1>
                    </br>
                    Zorg ervoor dat u na het inloggen met uw tijdelijke wachtwoord zelf nog uw wachtwoord wijzigt.
                    </br></br>
                    <h3>Dit kunt u doen door onderstaande stappen te volgen:</h3>
                    </br>
                    1. Ga naar de <a href="https://www.stefankruik.com/#/login" target="_blank">login pagina.</a></br>
                    2. Klik in de navigatiebar op 'Account' -> 'Profiel bewerken' -> 'Instellingen'. </br>
                    3. Bij 'Oud wachtwoord' kunt u uw tijdelijke wachtwoord invullen: ${OTP}
                     </br></br>
                    Heeft u geen nieuw wachtwoord aangevraagd? Meld dit dan bij ons en negeer deze e-mail.
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
B                   edankt voor het kiezen van HHC. We kijken ernaar uit om u te ondersteunen en met u in contact te komen.</p>`
                });
                alert("Bekijk je inbox, check eventueel je spamfolder hierin ontvang je een eenmalig wachtwoord.");
                //this.redirectPage("login");

            } catch (err) {
                console.error("Error API call:", err.errorMessage);
                this.errorMessage = "Er is een fout opgetreden bij het opslaan van het e-mailadres.";
            }
        },
    }
};
</script>

<template>
    <main class='forgot-password-structure'>
        <div class='forgot-password-container'>
            <h1 class='header-with-bg'>Wachtwoord vergeten</h1>
            <h5 class='forgot-password'>
                Voer je e-mailadres in zodat we je een link kunnen sturen waarmee je weer toegang kunt krijgen tot je
                account.
            </h5>
            <form class='forgot-password-form'>
                <input
                    id='email'
                    v-model='email'
                    class='input'
                    placeholder='Voer email in'
                    type='email'
                />
            </form>
            <div class='buttons'>
                <button class='btn-primary' @click='checkUser(email)'>
                    Verstuur
                </button>
                <h5 class='forgot-password' @click="redirectPage('login')">
                    Terug naar inloggen
                </h5>
            </div>
        </div>
        <div class='forgot-password-image'>
            <img :src='imageSource' alt='HHC Forgot Password Image '/>
        </div>
    </main>
</template>

<style scoped>
.forgot-password-structure {
    display: flex;
    align-items: center;
    height: 100vh;
    gap: 60px;
}

.forgot-password-container {
    display: flex;
    flex-direction: column;
    margin-left: 60px;
    gap: 20px;
    width: 700px;
    height: 400px;
}

.forgot-password-form {
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

.forgot-password-image {
    height: 100%;
    width: 100%;
    margin-left: 0;
}

img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

@media (width < 768px

) {
    .forgot-password-structure {
        flex-direction: column;
        height: 100%;
        gap: 0;
    }

    .forgot-password-container {
        margin-left: 0;
        margin-top: 125px;
        max-width: 300px;
    }

    .forgot-password-image {
        display: none;
    }
}
</style>
