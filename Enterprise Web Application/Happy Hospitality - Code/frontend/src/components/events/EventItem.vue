<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "EventItem",
    props: {
        title: String,
        date: String,
        eventId: Number,
        ticket: String
    },
    methods: {
        linkEvent() {
            this.$router.push("/events/" + this.eventId);
        }
    }
};
</script>

<template>
    <div class='event-container'>
        <div class='image-container' @click='linkEvent()'>
            <img
                :src='`https://files.stefankruik.com/uploads/events/${this.ticket}.png`'
                alt='Event Image'
                class='main-image'
                loading='lazy'
            />
        </div>
        <div class='information-container' @click='linkEvent()'>
            <h2 class='post-title'>{{ this.title }}</h2>
            <p class='post-date'>{{ this.date }}</p>
        </div>
    </div>
</template>

<style scoped>
.event-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 450px;
    height: 450px;
    background-color: var(--fill);
    cursor: pointer;
}

.main-image {
    width: 370px;
    height: 370px;
    object-fit: cover;
}

.information-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    margin: auto;
    cursor: pointer;
    user-select: none;
}

.post-title {
    text-transform: uppercase;
    font-size: 22px;
}

@media (width <= 650px) {
    .image-container {
        width: 280px;
        height: 280px;
    }

    .main-image {
        width: 90%;
        height: 90%;
    }

    .post-title {
        font-size: 18px;
    }

    .post-date {
        font-size: 14px;
    }
}
</style>
