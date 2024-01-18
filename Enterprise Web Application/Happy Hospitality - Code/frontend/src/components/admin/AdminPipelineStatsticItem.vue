<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "AdminPipelineStatsticItem",
    mounted() {
        this.$refs["pipeline-item"].addEventListener("mouseenter", () => this.hover());
        this.$refs["pipeline-item"].addEventListener("mouseleave", () => this.unHover());
    },
    props: {
        creation: String,
        id: Number,
        status: String,
        url: String
    },
    methods: {
        hover() {
            this.$refs["pipeline-hover-item"].classList.remove("hidden");
        },
        unHover() {
            this.$refs["pipeline-hover-item"].classList.add("hidden");
        }
    }
};
</script>

<template>
    <div ref='pipeline-item' :class='this.status' class='pipeline-item'>
        <div ref='pipeline-hover-item' class='hover-item hidden'>
            <div class='hover-item-content'>
                <small
                ><strong>Pipeline ID: {{ this.id }}</strong></small
                >
                <small
                >Status:
                    {{
                        status.charAt(0).toUpperCase() + status.substring(1)
                    }}</small
                >
                <small>Datum: {{ this.creation }}</small>
                <small
                ><a :href='this.url' target='_blank'
                >Link
                    <img
                        alt='Link'
                        class='link-image'
                        src='../../assets/icons/external-link.svg'/></a
                ></small>
            </div>
            <div class='arrow'></div>
        </div>
    </div>
</template>

<style scoped>
.pipeline-item {
    height: 50px;
    width: 8px;
    border-radius: 3px;
    background-color: grey;
}

.success {
    background-color: var(--green);
}

.failed {
    background-color: var(--orange);
}

.canceled {
    background-color: cornflowerblue;
}

.hover-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    top: -75px;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    padding: 5px;
    background-color: var(--fill);
    width: max-content;
    border-radius: 5px;
    z-index: 1;
}

.hidden {
    display: none;
}

.hover-item-content {
    display: flex;
    flex-direction: column;
}

.arrow {
    width: 15px;
    height: 15px;
    background-color: var(--fill);
    rotate: 45deg;
    margin-bottom: -12px;
    border-radius: 2px;
}

@media (width <= 1250px) {
    .pipeline-item {
        width: 4px;
    }
}

@media (width <= 690px) {
    .pipeline-item {
        width: 20px;
        height: 20px;
    }
}
</style>
