<!-- @author Emir Bay -->

<script lang='js'>
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AccountEvents",
    data() {
        return {
            eventInfo: null,
            image: "https://files.stefankruik.com/uploads/events/"
        };
    },
    created() {
        this.status();
        this.userEvents();
        documentTitle("Account Evenementen")
    },
    methods: {
        async status() {
            if (!getItem("email")) return this.$router.push("/login");
            if (getItem("admin")) return this.$router.push("/account/settings");
        },
        formatDateDMY,
        /**
         * Gathers user information
         * @returns
         */
        async userEvents() {
            if (getItem("userType") === "Entrepreneur" || "Partner") {
                this.eventInfo = await fetchApi(`/events/findByIdentifier/${getItem("email")}`, "GET");
            }
        },
        /**
         * Displays the options to remove an event
         * @param event Saves the information of the clicked element
         */
        async removeEvent(event) {
            event.target.parentElement.querySelector(".confirm").style.display = "flex";
            event.target.innerHTML = "";
        },
        /**
         * Removes the selected event, and deletes it from the Database
         * @param event Saves the information of the clicked button
         */
        async handleOption(event) {
            if (event.target.classList.contains("return")) {
                event.target.parentElement.style.display = "none";
                event.target.parentElement.parentElement.querySelector(".cancel").innerHTML = "Afmelden";
            } else {
                let eventID = event.target.parentElement.parentElement.getAttribute("data-key");
                await fetchApi(`/eventAttendees/delete/${eventID}/${getItem("email")}`, "DELETE");
                event.target.parentElement.parentElement.classList.add("removed");

                setTimeout(() => {
                    event.target.parentElement.parentElement.style.display = "none";
                    event.target.parentElement.parentElement.remove();
                    const events = document.querySelectorAll(".events-structure .event");
                    if (events.length === 0) {
                        document.querySelector(".events-structure").innerHTML = "Geen opkomende evenementen";
                    }
                }, 700);
            }
        }
    }
};
</script>

<template>
    <div class='title'>
        <h1 class='header-with-bg'>Geregistreerde evenementen</h1>
        <div class='events-structure'>
            <p v-if='eventInfo <= 0'>Geen opkomende evenementen</p>
            <div
                v-for='event in eventInfo'
                :key='event.id'
                :data-key='event.id'
                class='event'
            >
                <img
                    :src='`${image}${event.ticket}.png`'
                    alt='Profile Image'
                    class='image'
                />
                <div class='headerEvent'>
                    <h3 class='titleEvent'>
                        <router-link :to='`/events/${event.id}`'
                        >{{ event.title }}
                        </router-link>
                    </h3>
                    <h3>{{ event.type }}</h3>
                </div>
                <h3>€ {{ event.price }}</h3>
                <h3>{{ formatDateDMY(event.date, "nl-NL") }}</h3>
                <h3 class='cancel' @click='removeEvent'>Afmelden</h3>
                <div class='confirm'>
                    <p class='delete' @click='handleOption'>Afmelden</p>
                    <p class='return' @click='handleOption'>Annuleren</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.title {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 700px;
}

.events-structure {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    height: 700px;
    width: 100%;
    overflow-x: hidden;
    margin-top: 5px;
}

.event {
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 5px;
    width: 100%;
    max-width: 1000px;
    gap: 50px;
    border: 1px solid var(--font-dark);
    box-shadow: 5px 5px black;
}

.event:hover {
    transform: translateY(-10px);
    transition: 0.5s ease-in-out;
    box-shadow: 5px 10px black;
}

.image {
    max-height: 150px;
    max-width: 150px;
}

.titleEvent {
    font-weight: bold;
}

.cancel {
    color: cornflowerblue;
    cursor: pointer;
    margin-left: auto;
    margin-right: 10px;
}

.confirm {
    display: none;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.delete,
.return {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    filter: brightness(130%);
}

.delete {
    background-color: green;
    color: white;
}

.return {
    background-color: darkred;
    color: white;
}

.delete:hover,
.return:hover {
    transition: all 0.3s ease-out;
    filter: brightness(65%);
}

.removed {
    transform: translateX(50px);
    transition: all 1s ease-out;
    opacity: 0;
}

@media (width < 1350px) {
    .event {
        width: 99%;
        gap: 10px;
    }
}

@media (width < 940px) {
    .title {
        margin-left: 10px !important;
    }
}

@media (width < 670px) {
    .event {
        flex-direction: column;
        width: 95%;
    }
}
</style>
