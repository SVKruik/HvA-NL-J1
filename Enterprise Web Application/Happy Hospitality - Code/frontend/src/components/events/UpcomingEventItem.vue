<!-- @author Stefan Kruik -->

<script lang='js'>

export default {
    name: "UpcomingEventItem",
    props: {
        eventId: Number,
        ticket: String,
        title: String,
        price: Number,
        date: String,
        active: Boolean,
        first: Boolean
    },
    mounted() {
        if (!this.active) {
            this.$refs["event-item"].classList.add("disabled-event-item");
            this.$refs["event-title"].classList.add("disabled-event-text");
            this.$refs["event-date"].classList.add("disabled-event-text");
            this.$refs["event-image"].classList.add("disabled-event");
            this.$refs["event-button"].classList.add("disabled-button");
            this.$refs["event-button"].disabled = true;
        }
        if (this.first) this.$refs["event-item"].classList.add("first-element");
    },
    methods: {
        eventClick() {
            this.$router.push(`/events/${this.eventId}`);
        },
        eventRegister(event) {
            event.preventDefault();
            alert("Price: €" + this.price);
        }
    }
};
</script>

<template>
    <div ref='event-item' class='event-item'>
        <section class='left'>
            <img
                ref='event-image'
                :src='`https://files.stefankruik.com/uploads/events/${this.ticket}.png`'
                alt='Event Image'
                class='main-image'
                @click='this.eventClick()'
            />
            <div class='event-text' @click='this.eventClick()'>
                <h2 ref='event-title' class='post-title'>{{ this.title }}</h2>
                <h4 ref='event-date' class='post-date'>{{ this.date }}</h4>
            </div>
        </section>
        <section class='right'>
            <button
                ref='event-button'
                class='register-button'
                type='submit'
                @click='this.eventRegister($event)'
            >
                €{{ this.price }}
            </button>
        </section>
    </div>
</template>

<style scoped>
* {
    --disabled: grey;
}

.event-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 150px;
    outline: 2px solid var(--accent-b);
    box-sizing: border-box;
    padding: 10px;
}

.first-element {
    outline: 2px dashed var(--accent-b);
}

.disabled-event-item {
    outline: 2px dashed var(--disabled);
}

.disabled-event,
.disabled-event-text,
.disabled-button {
    opacity: 0.5;
}

.disabled-event,
.disabled-button {
    background-color: var(--disabled);
}

.disabled-button:hover {
    border: none;
}

.disabled-event-text {
    color: var(--disabled);
}

.disabled-button {
    cursor: not-allowed;
}

.left {
    display: flex;
    align-items: center;
    gap: 40px;
}

.main-image,
.event-text {
    cursor: pointer;
}

.main-image {
    width: 130px;
    height: 130px;
    object-fit: cover;
}

.event-text {
    display: flex;
    gap: 20px;
    flex-direction: column;
}

.register-button {
    width: 70px;
}

@media (width <= 550px) {
    .event-item {
        height: fit-content;
        flex-direction: column;
        gap: 20px;
    }

    .left {
        flex-direction: column;
    }

    .event-text {
        align-items: center;
        text-align: center;
        gap: 5px;
    }

    .main-image {
        width: 250px;
        height: 250px;
    }
}
</style>
