<!-- @author Stefan Kruik -->

<script>
export default {
    name: "FilterItem",
    props: {
        id: String,
        title: String,
        type: String
    },
    methods: {
        destroy() {
            this.$emit("deleteFilter", this.type, this.id, this.title);
        }
    }
};
</script>

<template>
    <div ref='filter-item' class='filter-item'>
        <p>{{ this.title }}</p>
        <button @click='this.destroy'>
            <img alt='x' src='../../assets/icons/plus.svg'>
        </button>
    </div>
</template>

<style scoped>
.filter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 120px;
    height: 30px;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 10px;
    background-color: lightgray;
    border: 1px solid dimgray;
}

button {
    width: 15px;
    height: 15px;
    background-color: white;
    border: 1px solid var(--font-dark);
    border-radius: 50%;
    color: var(--font-dark);
    user-select: none;
}

button:hover > * {
    rotate: -45deg;
}

button > * {
    rotate: 45deg;
}
</style>