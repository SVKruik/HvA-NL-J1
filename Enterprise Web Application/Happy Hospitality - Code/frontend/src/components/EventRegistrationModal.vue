<!-- @author Jenelle Davelaar & Milou Hogendoorn-->

<script lang='js'>

import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "EventRegistrationModal",
    props: {
        eventTitle: String,
        eventDate: String,
        eventPrice: Number
    },
    data() {
        return {
            event_id: this.$route.params.id,
            isUserLoggedIn: false,
            userEmail: ""
        };
    },
    computed: {
        isLoggedIn() {
            return !this.isUserLoggedIn;
        }
    },
    created() {
        this.checkLoggedInStatus();
    },
    methods: {
        close() {
            this.$emit("close");
        },
        async succesfullPayment() {
            if (!this.isUserLoggedIn) {
                if (!this.validateEmail(this.userEmail)) {
                    this.errorMessage = "Voer een geldig e-mailadres in om verder te gaan met betalen.";
                    return;
                } else {
                    this.errorMessage = null;
                }
            }

            this.creation = new Date();

            const userData = {
                eventId: parseInt(this.event_id),
                identifier: this.userEmail,
                status: "Fulfilled",
                creation: this.creation
            };

            try {
                await fetchApi("/eventAttendees/save", "POST", userData);

                await fetchApi("/mail/general", "POST", {
                    "receivers": [this.userEmail], "content": `<p>
                    <h2>Wat leuk dat u zich heeft aangemeld voor het ${this.eventTitle} evenement.</h2>
                    </br></br>
                    We kijken er naar uit u op ${this.eventDate} te zien.
                    <br>
                    Bewaar deze mail goed, dit is uw toegangs kaartje!
                    </br></br>
                    <h2>Bon:</h2>
                    Deelnemer: ${this.userEmail}
                    </br>
                    Prijs betaald: €${this.eventPrice}
                    </br>
                    Evenement details: ${this.eventTitle} op ${this.eventDate}
                    </br></br>
                    Hulp Nodig?</br>
                    Ons team staat klaar om te helpen. Als u vragen heeft of ondersteuning nodig heeft, neem gerust contact met ons op.
                    </br></br>
                    Blijf verbonden met ons op
                    <a href="https://instagram.com/happyhospitalitycollective?igshid=MzRlODBiNWFlZA=="
                    target="_blank">Instagram</a>
                    &
                    <a href="https://www.linkedin.com/company/happy-hospitality-collective"
                    target="_blank">LinkedIn</a>
                    om op de hoogte te blijven van het laatste nieuws en gebeurtenissen in de gemeenschap.
                    </br></br>
                    Bedankt voor het kiezen van HHC. We kijken ernaar uit om u te ondersteunen en met u in contact te komen.</p>`
                });

                this.close();
                alert("Betaling gelukt!");
            } catch (err) {
                console.error("Error API call:", err.message);
                this.errorMessage = "Er is een fout opgetreden bij het opslaan van het e-mailadres.";
            }
        },
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async checkLoggedInStatus() {
            const userEmail = getItem("email");
            this.isUserLoggedIn = userEmail !== null;
            if (this.isUserLoggedIn) {
                this.userEmail = userEmail;
            }
        }
    }
};
</script>

<template>
    <div class='modal-backdrop' @click.self="close">
        <div class='modal'>
            <header class='modal-header'><h2>Registreer voor event</h2></header>

            <section class='modal-body'>
                <p>{{ eventTitle }} op {{ eventDate }}:</p>
                <br/><br/>
                <h3>€{{ eventPrice }}</h3>
                <br/><br/>

                <template v-if='!isUserLoggedIn'>
                    <label for='email'>E-mailadres:</label>
                    <input id='email' v-model='userEmail' type='email'/>
                    <br/><br/>
                </template>

                <p>Kies een betaalmethode:</p>
                <img
                    alt='IDeal Logo'
                    class='payment-method'
                    src='../assets/images/Ideal-logo.png'
                    @click='succesfullPayment'
                />
                <img
                    alt='PayPal Logo'
                    class='payment-method'
                    src='../assets/images/paypal-logo.png'
                    @click='succesfullPayment'
                />
            </section>

            <footer class='modal-footer'>
                <button class='btn-green' type='button' @click='close'>
                    Annuleer
                </button>
            </footer>
        </div>
    </div>
</template>

<style>
.modal-backdrop {
    position: fixed;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--font-opacity);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    width: 40%;
    height: 60%;
    background: var(--main);
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
}

.modal-header,
.modal-footer {
    padding: 15px;
    display: grid;
    justify-content: center;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid var(--main);
    color: var(--accent-b);
}

.modal-footer {
    border-top: 1px solid var(--main);
    flex-direction: column;
    padding-right: 50px;
}

.modal-body {
    position: relative;
    padding: 20px 30px;
}

.payment-method {
    padding: 30px;
    width: 80px;
}

.payment-method:hover {
    cursor: pointer;
    border-bottom: 3px solid var(--accent-b);
}

.btn-green {
    position: absolute;
    width: 150px;
    height: 40px;
    color: var(--main);
    background: var(--accent-b);
    border: 1px solid var(--accent-b);
    border-radius: 2px;
    justify-self: flex-end;
}

.btn-green:hover {
    background-color: var(--accent-b-hover);
}

@media (width <= 800px

) {
    .modal {
        width: 80%;
        height: 70%;
    }

    .btn-green {
        position: relative;
    }
}
</style>
