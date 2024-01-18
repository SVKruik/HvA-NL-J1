<!-- @author Stefan Kruik -->

<script lang='js'>
import EventItem from "@/components/events/EventItem.vue";
import { formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "UpcomingEvents",
    components: { EventItem },
    data() {
        return {
            eventList: [],
            queryLimit: 10
        };
    },
    created() {
        this.populateEvents();
    },
    methods: {
        async populateEvents() {
            const data = await fetchApi(`/events/upcoming/${this.queryLimit}`, "GET");
            if (data.length === 0) return;
            for (let i = 0; i < data.length; i++) {
                const event = {
                    "title": data[i].title,
                    "date": formatDateDMY(data[i].date, "nl-NL"),
                    "ticket": data[i].ticket,
                    "id": data[i].id
                };
                this.eventList.push(event);
            }
        },
        /**
         * Scroll the event list in either direction.
         * @param direction The direction of the scroll.
         * @param event The click event fired on @click.
         */
        scroll(direction, event) {
            const scrollElement = this.$refs["event-scroll-area"];
            if (!scrollElement) return;
            const childElements = this.$refs["event-item"];
            let scrollAmount = 500;

            // Dynamic Width
            if (childElements && childElements[0]) {
                scrollAmount = childElements[0].$el.offsetWidth;
                scrollAmount += parseInt(getComputedStyle(document.querySelector(".event-area")).gap);
            }

            // Scrolling
            if (direction === "left") {
                if (event.shiftKey) return scrollElement.scrollLeft = 0;
                scrollElement.scrollLeft -= scrollAmount;
            } else if (direction === "right") {
                if (event.shiftKey) return scrollElement.lastElementChild.scrollIntoView({ behavior: "smooth" });
                scrollElement.scrollLeft += scrollAmount;
            }
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <section class='info-area indent'>
            <h2 class='header'>Aankomende Evenementen</h2>
            <div class='info-area-controls'>
                <div class='view-all-wrapper'>
                    <div class='accent'></div>
                    <router-link to='/events'>Bekijk alle</router-link>
                </div>
                <div class='button-container'>
                    <button
                        class='shift-left'
                        type='button'
                        @click="scroll('left', $event)"
                    >
                        ←
                    </button>
                    <button
                        class='shift-right'
                        type='button'
                        @click="scroll('right', $event)"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
        <section ref='event-scroll-area' class='event-area'>
            <div class='offset-block'></div>
            <event-item
                v-for='event in eventList'
                :key='event.id'
                ref='event-item'
                :date='event.date'
                :eventId='event.id'
                :ticket='event.ticket'
                :title='event.title'
            >
            </event-item>
            <div class='offset-block'></div>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.info-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-area-controls {
    display: flex;
    gap: 20px;
}

.accent {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--accent-a);
}

.view-all-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
}

.button-container {
    display: flex;
}

button {
    width: 60px;
    height: 30px;
    background-color: transparent;
    border: 2px solid var(--accent-b);
    color: var(--font-dark);
}

button:hover {
    background-color: var(--accent-b);
    color: var(--font-light);
}

.shift-right {
    border-left: none;
}

.event-area::-webkit-scrollbar {
    display: none;
}

.event-area {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.event-area {
    display: flex;
    gap: 50px;
    overflow: hidden;
    overflow-x: auto;
}

.offset-block {
    width: 0;
}

@media (width <= 680px) {
    .info-area {
        flex-direction: column;
        gap: 20px;
    }

    .info-area-controls {
        gap: 0;
        width: 90%;
        justify-content: space-between;
    }
}

@media (width <= 650px) {
    .offset-block-container {
        gap: 65px;
    }
}

@media (width <= 415px) {
    .header {
        text-align: center;
    }

    .event-area {
        gap: 20px;
    }
}
</style>
