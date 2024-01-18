<!-- @author Stefan Kruik -->

<script lang='js'>
import { getStringLimit } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "AdminEventItem",
    props: {
        id: Number,
        title: String,
        description: String,
        ticket: String,
        price: String,
        date: String,
        creation: String,
        type: String
    },
    data() {
        return {
            screenWidthThreshold: 680
        };
    },
    methods: {
        getStringLimit,
        eventLink() {
            this.$router.push(`/events/${this.id}`);
        },
        deleteEvent() {
            if (confirm("Weet u zeker dat u dit evenement wilt verwijderen? Alle geregistreerde deelnemers zullen een terugbetaling ontvangen.")) {
                fetchApi(`/events/delete/${this.id}`, "DELETE");
                alert("Evenement succesvol verwijderd. Alle deelnemers hebben een email ontvangen.");
                this.$emit("event-delete", this.id);
            }
        }
    }
};
</script>

<template>
    <div ref='event-item' class='event-item'>
        <section class='information-container' @click='eventLink()'>
            <img
                :src='`https://files.stefankruik.com/uploads/events/${this.ticket}.png`'
                alt='Event Image'
                class='main-image'
            />
            <hr class='hidden'/>
            <div class='text-container'>
                <h3>
                    {{
                        getStringLimit(
                            this.screenWidthThreshold,
                            30,
                            15,
                            this.title
                        )
                    }}
                </h3>
                <p>
                    {{
                        getStringLimit(
                            this.screenWidthThreshold,
                            40,
                            20,
                            this.description
                        )
                    }}
                </p>
                <small>Geplaatst op: {{ this.creation }}</small>
                <small>Vindt plaats op: {{ this.date }}</small>
            </div>
        </section>
        <hr class='hidden'/>
        <section class='control-container'>
            <button
                class='delete-button'
                type='submit'
                @click='this.deleteEvent()'
            >
                Verwijder
            </button>
        </section>
    </div>
</template>

<style scoped>
h3 {
    font-weight: bold;
}

.event-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    height: 150px;
    border: 2px solid var(--accent-b);
}

.information-container {
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
}

.main-image {
    width: 130px;
    height: 130px;
    object-fit: cover;
}

.text-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.control-container {
    display: flex;
    align-items: center;
}

.delete-button {
    background-color: transparent;
    color: red;
}

.delete-button:hover {
    color: darkred;
    border: none;
}

button {
    width: 100px;
}

hr {
    display: none;
}

@media (width <= 680px) {
    .event-item {
        height: fit-content;
    }

    .event-item,
    .information-container {
        flex-direction: column;
    }

    .information-container,
    .text-container {
        width: 100%;
    }

    .main-image {
        width: 200px;
        height: 200px;
    }

    .information-container {
        gap: 0;
    }

    .hidden {
        display: block;
    }
}
</style>
