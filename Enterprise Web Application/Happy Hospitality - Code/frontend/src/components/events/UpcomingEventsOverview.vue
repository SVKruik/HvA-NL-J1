<!-- @author Stefan Kruik -->

<script lang='js'>
import FilterItem from "@/components/events/FilterItem.vue";
import UpcomingEventItem from "@/components/events/UpcomingEventItem.vue";
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { deleteItem, getItem, setItem } from "@/utilities/sessionController";
import { createTicket } from "@/utilities/ticketController";

export default {
    name: "UpcomingEventsOverview",
    components: { FilterItem, UpcomingEventItem },
    data() {
        return {
            eventList: [],
            retroLimit: 3,
            futureEvents: 0,
            retroEvents: 0,
            monthFilter: false,
            activeTypes: [],
            currentDate: `${new Date().getFullYear()}-${(new Date().getMonth() + 1) < 10 ? "0" : ""}${new Date().getMonth() + 1}`,
            validTypes: ["Workshop", "Netwerken", "Training", "Outdoor", "Conferentie", "Feest", "Presentatie", "Demonstratie", "Beurs", "Tentoonstelling", "Webinar", "Online"]
        };
    },
    async created() {
        documentTitle("Evenementen");
        if (!getItem("monthFilter") && (!getItem("typeFilter") || getItem("typeFilter").length === 0)) {
            this.eventList = await this.populateEvents("upcoming", 100);
        } else this.setupEvents();
    },
    methods: {
        async populateEvents(type, limit) {
            // Data Fetching
            const newList = [];
            const data = await fetchApi(`/events/${type}/${limit}`, "GET");
            if (data.length === 0) return;

            // Update Static Count
            if (type === "upcoming") {
                this.futureEvents = data.length;
            } else if (type === "previous") this.retroEvents = data.length;

            // Load Events
            for (let i = 0; i < data.length; i++) {
                newList.push({
                    "title": data[i].title,
                    "date": formatDateDMY(data[i].date, "nl-NL"),
                    "ticket": data[i].ticket,
                    "id": data[i].id,
                    "price": data[i].price,
                    "active": type === "upcoming",
                    "first": i === 0
                });
            }
            return newList;
        },
        async loadPrevious() {
            const button = this.$refs["previous-button"];
            button.disabled = true;
            button.classList.add("disabled-class");
            const previousEvents = await this.populateEvents("previous", 3);
            this.eventList = previousEvents.concat(this.eventList);
        },
        async setupEvents() {
            if (!getItem("monthFilter") && (!getItem("typeFilter") || getItem("typeFilter").length === 0)) {
                return this.eventList = await this.populateEvents("upcoming", 100);
            }
            const month = getItem("monthFilter");
            const rawTypes = JSON.parse(getItem("typeFilter")) || [];
            const types = [];

            // Prepare Types
            for (let i = 0; i < rawTypes.length; i++) {
                types.push(rawTypes[i].title);
            }

            // Loading Events
            const data = await fetchApi(`/events/filtered?month=${month}&types=${types}`, "GET");
            this.eventList = [];
            for (let i = 0; i < data.length; i++) {
                this.eventList.push({
                    "title": data[i].title,
                    "date": formatDateDMY(data[i].date, "nl-NL"),
                    "ticket": data[i].ticket,
                    "id": data[i].id,
                    "price": data[i].price,
                    "active": true,
                    "first": i === 0
                });
            }
        },
        deleteFilter(type, id, title) {
            if (type === "Month") {
                this.monthFilter = false;
                this.$refs["month-picker"].value = this.currentDate;
                deleteItem("monthFilter");
            } else if (type === "Type") {
                // Update Vue List
                const typeIndex = this.activeTypes.findIndex(item => item.id === id);
                if (typeIndex !== -1) this.activeTypes.splice(typeIndex, 1);

                // Update Session List
                let sessionTypes = getItem("typeFilter") || [];
                if (sessionTypes.length > 0) sessionTypes = JSON.parse(sessionTypes);
                sessionTypes = sessionTypes.filter(filteredType => filteredType.id !== id);
                setItem("typeFilter", JSON.stringify(sessionTypes));

                // Update Select Element
                const typeInput = this.$refs["type-picker"];
                typeInput.classList.remove("disabled-select");
                typeInput.disabled = false;
                const option = document.createElement("option");
                option.value = option.innerHTML = title;
                typeInput.appendChild(option);
            }
            const container = document.getElementsByClassName("active-filter-container")[0];
            if ((container.childElementCount - 1) === 0) {
                return this.resetFilters();
            } else return this.setupEvents();
        },
        async resetFilters() {
            if (!getItem("monthFilter") && (!getItem("typeFilter") || getItem("typeFilter").length === 0)) return;
            // Reset Session Items
            deleteItem("typeFilter");
            deleteItem("monthFilter");

            // Reset Types
            this.activeTypes = [];
            const typePicker = this.$refs["type-picker"];
            typePicker.innerHTML = "";
            const defaultOption = document.createElement("option");
            defaultOption.value = "default";
            defaultOption.innerHTML = "Evenement Type";
            typePicker.appendChild(defaultOption);

            // Rest Select Element
            for (let i = 0; i < this.validTypes.length; i++) {
                const option = document.createElement("option");
                option.value = option.innerHTML = this.validTypes[i];
                typePicker.appendChild(option);
            }

            // Reset Month
            this.monthFilter = false;
            this.$refs["month-picker"].value = this.currentDate;

            this.eventList = await this.populateEvents("upcoming", 100);
        },
        setupMonth() {
            const monthInput = this.$refs["month-picker"];
            const sessionMonth = getItem("monthFilter");

            // Update Date Picker
            if (sessionMonth) {
                this.monthFilter = true;
                monthInput.min = this.currentDate;
                monthInput.value = sessionMonth;
            } else monthInput.value = monthInput.min = this.currentDate;
            monthInput.addEventListener("change", () => {
                if (!monthInput.value.length) {
                    this.monthFilter = false;
                    deleteItem("monthFilter");
                    monthInput.value = this.currentDate;
                    return;
                }
                this.monthFilter = true;
                setItem("monthFilter", monthInput.value);
                this.setupEvents();
            });
        },
        setupTypes() {
            let sessionTypes = JSON.parse(getItem("typeFilter")) || [];
            const typeInput = this.$refs["type-picker"];

            // Populate Vue List & Update Select Element
            for (let i = 0; i < sessionTypes.length; i++) {
                this.activeTypes.push(sessionTypes[i]);
                const selectedOption = typeInput.querySelector(`option[value="${sessionTypes[i].title}"]`);
                if (selectedOption) selectedOption.remove();
            }

            // Disable Select Element
            if (this.activeTypes.length === 12 || typeInput.children.length - 1 === 0) {
                typeInput.classList.add("disabled-select");
                typeInput.disabled = true;
            }

            // Event On Option Click
            typeInput.addEventListener("change", () => {
                // Validation
                if (typeInput.value === "default") return;
                const exists = this.activeTypes.some(type => type.title === typeInput.value);

                // Add Type
                if (!exists) {
                    const newType = {
                        "id": createTicket(),
                        "title": typeInput.value,
                        "type": "Type"
                    };
                    this.activeTypes.push(newType);

                    // Update Session List
                    let sessionTypes = getItem("typeFilter") || [];
                    if (sessionTypes.length > 0) sessionTypes = JSON.parse(sessionTypes);
                    sessionTypes.push(newType);
                    setItem("typeFilter", JSON.stringify(sessionTypes));

                    // Update Select Element
                    const selectedOption = typeInput.querySelector(`option[value="${typeInput.value}"]`);
                    if (selectedOption) {
                        typeInput.removeChild(selectedOption);
                        if (typeInput.children.length - 1 === 0) {
                            typeInput.classList.add("disabled-select");
                            typeInput.disabled = true;
                        }
                    }
                }
                // Return to Default Value
                typeInput.value = "default";
                this.setupEvents();
            });
        },
        createTicket() {
            return createTicket();
        }
    },
    async mounted() {
        this.setupMonth();
        this.setupTypes();
        if (this.$route.query.previous) await this.loadPrevious();
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <section class='filter-wrapper'>
            <h2>Filteren</h2>
            <div class='filter-container'>
                <input ref='month-picker' class='month-picker' type='month'>
                <select ref='type-picker' class='type-picker'>
                    <option value='default'>Evenement Type</option>
                    <option value='Workshop'>Workshop</option>
                    <option value='Netwerken'>Netwerken</option>
                    <option value='Training'>Training</option>
                    <option value='Outdoor'>Outdoor</option>
                    <option value='Conferentie'>Conferentie</option>
                    <option value='Feest'>Feest</option>
                    <option value='Presentatie'>Presentatie</option>
                    <option value='Demonstratie'>Demonstratie</option>
                    <option value='Beurs'>Beurs</option>
                    <option value='Tentoonstelling'>Tentoonstelling</option>
                    <option value='Webinar'>Webinar</option>
                    <option value='Online'>Online</option>
                </select>
                <button class='reset-button' type='reset' @click='this.resetFilters()'>Filters wissen</button>
            </div>
        </section>
        <section class='event-content-container'>
            <section class='edge'>
                <h2>Alle aankomende evenementen</h2>
                <div class='control-container'>
                    <button ref='previous-button' @click='this.loadPrevious()'>
                        Afgelopen evenementen
                    </button>
                    <div class='active-filter-container'>
                        <FilterItem v-if='this.monthFilter' :id='this.createTicket()'
                                    ref='monthFilter' :title="this.$refs['month-picker'].value" :type="'Month'"
                                    @deleteFilter='this.deleteFilter'></FilterItem>
                        <FilterItem v-for='type in this.activeTypes' :id='type.id' :key='type.id' :title='type.title'
                                    :type='type.type' @deleteFilter='this.deleteFilter'></FilterItem>
                    </div>
                </div>
            </section>
            <section>
                <div v-if='this.eventList.length' class='event-container'>
                    <UpcomingEventItem
                        v-for='event in this.eventList'
                        :key='event.id'
                        :active='event.active'
                        :date='event.date'
                        :eventId='event.id'
                        :first='event.first'
                        :price='event.price'
                        :ticket='event.ticket'
                        :title='event.title'
                    ></UpcomingEventItem>
                </div>
                <div v-else class='placeholder'>
                    <p>Er zijn geen evenementen beschikbaar met deze filters.</p>
                </div>
            </section>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper {
    display: grid;
    padding-top: 140px;
    grid-template-columns: 350px 3fr;
    width: 90%;
    margin: 0 auto;
    gap: 20px;
}

/* Filters */
.filter-wrapper,
.filter-container {
    display: flex;
    flex-direction: column;
}

.filter-container {
    box-sizing: border-box;
    padding: 10px;
    gap: 10px;
}

.month-picker,
.type-picker {
    border: 1px solid var(--font-dark);
    height: 45px;
    box-sizing: border-box;
    padding: 10px;
    cursor: pointer;
}

.reset-button {
    width: 100%;
}

/* Events */
.event-content-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.event-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
}

.edge {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.control-container {
    display: flex;
    align-items: flex-start;
    gap: 20px;
}

.disabled-class,
.disabled-select {
    opacity: 0.5;
    cursor: not-allowed;
}

.disabled-class {
    background-color: grey;
}

.disabled-class:hover {
    border: none;
}

button {
    width: 260px;
}

.active-filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;
}

@media (width <= 960px) {
    .content-wrapper {
        grid-template-columns: 200px 1fr;
    }
}

@media (width <= 760px) {
    .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .control-container {
        flex-direction: column;
        align-items: center;
    }
}
</style>
