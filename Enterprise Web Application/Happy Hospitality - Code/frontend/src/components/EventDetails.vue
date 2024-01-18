<!-- @author Jenelle Davelaar & Milou Hogendoorn -->

<script lang='js'>
import EventRegistrationModal from "@/components/EventRegistrationModal.vue";
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";


export default {
    name: "EventDetails",
    components: {
        EventRegistrationModal
    },
    props: {
        title: String,
        date: String,
        eventId: Number,
        ticket: String
    },
    data() {
        return {
            id: this.$route.params.id,
            imageBaseUrl: "https://files.stefankruik.com/uploads/events/",
            selectedEvent: {},
            isModalVisible: false
        };
    },
    created() {
        this.getEvent();
    },
    methods: {
        toNotFound() {
            this.$router.push("/404");
        },
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
        async getEvent() {
            const data = await fetchApi(`/events/findById/${this.id}`, "GET");
            if (data.length === 0) return this.toNotFound();
            documentTitle(data.title);

            this.selectedEvent = {
                "title": data.title,
                "date": formatDateDMY(data.date, "nl-NL"),
                "description": data.description,
                "ticket": data.ticket,
                "sub_ticket": data.sub_ticket,
                "sub_ticket_title": data.sub_ticket_title,
                "large_ticket": data.large_ticket,
                "second_description": data.second_description,
                "price": data.price,
                "id": data.id
            };

        }

    }
};
</script>

<template>
    <div class='post-intro-wrapper'>
        <section class='post-info-container'>
            <div class='post-info-title'>
                <h2 class='post-title'>{{ selectedEvent.title }}</h2>
                <p class='post-date'>{{ selectedEvent.date }}</p>
                <p class='post-date'>€ {{ selectedEvent.price }}</p>
            </div>
            <!--            <button @click="this.toLogin()">Meld je aan</button>-->

            <button class='btn' type='button' @click='showModal'>
                Meld je aan
            </button>

            <EventRegistrationModal
                v-show='isModalVisible'
                :eventDate='selectedEvent.date'
                :eventPrice='selectedEvent.price'
                :eventTitle='selectedEvent.title'
                @close='closeModal'
            >
            </EventRegistrationModal>
        </section>
        <section class='post-image-container'>
            <img
                :src="this.imageBaseUrl + selectedEvent.ticket + '.png'"
                alt='Event Image'
                class='main-image'
                loading='lazy'
            />
        </section>
    </div>
    <div class='information-section-wrapper'>
        <div class='information-title-wrapper'>
            <h2 class='information-title'>Over het event</h2>
        </div>
        <article>
            <p>{{ selectedEvent.description }}</p>
        </article>
        <section
            v-if='selectedEvent.sub_ticket !== null'
            class='information-image-container'
        >
            <section class='information-image-title'>
                <p>{{ selectedEvent.sub_ticket_title }}</p>
            </section>
            <img
                :src="this.imageBaseUrl + selectedEvent.sub_ticket + '.png'"
                alt='Event Sub Image'
                class='main-image'
                loading='lazy'
            />
        </section>
    </div>
    <section
        v-if='selectedEvent.large_ticket !== null'
        class='information-image-container-large'
    >
        <img
            :src="this.imageBaseUrl + selectedEvent.large_ticket + '.png'"
            alt='Event Large Image'
            class='information-image-large'
            loading='lazy'
        />
    </section>
    <div
        v-if='selectedEvent.second_description !== null'
        class='information-section-wrapper'
    >
        <div class='information-title-wrapper'>
            <h2 class='information-title'>Meer informatie</h2>
        </div>
        <article>
            <p>{{ selectedEvent.second_description }}</p>
        </article>
    </div>
</template>

<style scoped>
a:hover {
    text-decoration: none;
}

.post-intro-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    max-height: 700px;
    padding: 100px;
}

.post-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    margin-left: 50px;
}

.post-info-title {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.post-title {
    width: 300px;
}

.post-date {
    font-size: 14px;
}

.btn {
    width: 200px;
    height: 50px;
    background-color: var(--accent-b);
    color: var(--main);
}

.btn:hover {
    background-color: var(--accent-b-hover);
}

.post-image-container {
    display: flex;
    width: 100%;
    justify-content: flex-end;
}

.main-image {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    max-width: 700px;
    max-height: 700px;
}

.information-section-wrapper {
    display: flex;
    gap: 50px;
    margin: 10px 0 50px 0;
    padding: 100px 100px 50px 80px;
}

.information-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
}

.information-title {
    font-weight: 400;
    width: 150px;
    text-transform: uppercase;
}

.information-image-container {
    display: flex;
    width: 230px;
    height: 230px;
    padding-bottom: 30px;
    justify-content: flex-end;
    align-self: flex-end;
    flex-direction: column;
}

.information-image-title {
    padding: 10px;
}

.information-image-container-large {
    display: flex;
    width: 100%;
    justify-content: center;
}

.information-image-large {
    width: 150%;
    height: 100%;
    aspect-ratio: 2;
    object-fit: cover;
    max-width: 80%;
    max-height: 100%;
}

article {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
    width: 60%;
}

@media (width <= 800px

) {
    .post-intro-wrapper {
        flex-direction: column;
        gap: 30px;
    }

    .post-info-container {
        flex-direction: column;
        align-items: center;
        margin: 0;
    }

    .post-info-title {
        text-align: center;
    }

    .main-image {
        margin: auto;
        max-width: 400px;
        max-height: 400px;
    }

    .information-section-wrapper {
        flex-direction: column;
        gap: 20px;
    }

    .information-title-wrapper {
        margin: auto;
    }

    article {
        text-align: center;
        width: 90%;
        padding-bottom: 60px;
        margin: auto;
    }
}
</style>
