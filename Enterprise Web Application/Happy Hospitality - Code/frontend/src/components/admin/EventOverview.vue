<!-- @author Stefan Kruik -->

<script lang='js'>
import AdminEventItem from "@/components/admin/AdminEventItem.vue";
import AdminReturn from "@/components/admin/AdminReturn.vue";
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "EventOverview",
    components: { AdminEventItem, AdminReturn },
    async created() {
        documentTitle("Administratie - Evenementen");
        if (!getItem("admin")) return this.$router.push("/");
        const data = await fetchApi("/events/upcoming/9999", "GET") || [];
        for (let i = 0; i < data.length; i++) {
            this.eventList.push(this.eventItemConstructor(data[i]));
        }
    },
    data() {
        return {
            eventList: []
        };
    },
    methods: {
        eventItemConstructor(data) {
            return {
                "id": data.id,
                "title": data.title,
                "ticket": data.ticket,
                "description": data.description,
                "date": formatDateDMY(data.date, "nl-NL"),
                "type": data.type,
                "creation": formatDateDMY(data.creation, "nl-NL"),
                "price": `€${data.price}`
            };
        },
        eventDelete(id) {
            const index = this.eventList.findIndex(event => event.id === id);
            if (index !== -1) this.eventList.splice(index, 1);
        }
    }
};
</script>

<template>
    <AdminReturn></AdminReturn>
    <h3>Aankomende Evenementen</h3>
    <div class='previous-button-wrapper'>
        <router-link class='previous-button' to='/events?previous=true'
        >Afgelopen evenementen
        </router-link>
    </div>
    <div class="event-container">
        <AdminEventItem
            v-for='event in this.eventList'
            :id='event.id'
            :key='event.id'
            :creation='event.creation'
            :date='event.date'
            :description='event.description'
            :price='event.price'
            :ticket='event.ticket'
            :title='event.title'
            :type='event.type'
            @event-delete='this.eventDelete'
        ></AdminEventItem>
    </div>
    <h3 v-if='this.eventList.length === 0' ref="placeholder-text">
        <strong>Er zijn geen aankomende evenementen gevonden.</strong>
    </h3>
</template>

<style scoped>
h3 {
    font-weight: bold;
}

.event-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.previous-button-wrapper {
    display: flex;
    width: 100%;
}

.previous-button {
    width: fit-content;
    background-color: var(--accent-b);
    box-sizing: border-box;
    padding: 10px;
    color: var(--font-light);
}

.previous-button:hover {
    outline: 1px solid var(--accent-b);
    background-color: transparent;
    text-decoration: none;
    color: var(--font-dark);
}

@media (width <= 550px) {
    .previous-button-wrapper {
        justify-content: center;
    }
}
</style>
