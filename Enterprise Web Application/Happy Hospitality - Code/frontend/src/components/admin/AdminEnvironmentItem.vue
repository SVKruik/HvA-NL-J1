<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "AdminEnvironmentItem",
    props: {
        id: Number,
        name: String,
        slug: String,
        url: String,
        state: String
    },
    data() {
        return {
            status: this.state
        };
    },
    mounted() {
        switch (this.state) {
            case "available":
                return this.status = "Actief";
            default:
                return this.status = "Inactief";
        }
    }
};
</script>

<template>
    <div class='environment-item'>
        <section class='information-section'>
            <div class='title-container'>
                <h4>
                    <strong>{{ this.name }}</strong>
                </h4>
                <small>{{ this.slug }} {{ this.id }}</small>
            </div>
            <p v-if='this.url'>
                <a :href='this.url' target='_blank'
                >Link
                    <img
                        alt='Link'
                        class='link-image'
                        src='../../assets/icons/external-link.svg'
                    /></a>
            </p>
        </section>
        <hr/>
        <section class='status-section'>
            <div
                :class="this.status === 'Actief' ? 'active' : 'inactive'"
                class='status-icon'
            ></div>
            <p class='status'>
                {{
                    this.state.charAt(0).toUpperCase() + this.state.substring(1)
                }}
            </p>
        </section>
    </div>
</template>

<style scoped>
.environment-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 33%;
    max-width: 500px;
    height: 120px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid var(--accent-b);
}

.information-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    min-height: 50px;
}

.title-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.active {
    background-color: var(--green);
}

.inactive {
    background-color: var(--red);
}

@media (width <= 1050px) {
    .environment-item {
        height: 140px;
    }

    .information-section {
        align-items: center;
        min-height: 70px;
    }

    .title-container {
        flex-direction: column;
    }
}

@media (width <= 900px) {
    .environment-item {
        width: 100%;
    }
}
</style>
