<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "UserItem",
    props: {
        id: Number,
        name: String,
        type: String,
        blockedTitle: Boolean
    },
    methods: {
        blockUser(event) {
            event.preventDefault();
            this.$emit(`block${this.type}`, this.id, event);
        },
        deleteUser(event) {
            event.preventDefault();
            this.$emit(`delete${this.type}`, this.id, event);
        }
    }
};
</script>

<template>
    <div class='user-item'>
        <section class='information-container'>
            <p>{{ this.name }}</p>
        </section>
        <section class='control-container'>
            <button
                :class="this.blockedTitle ? 'unblock-button' : 'block-button'"
                type='submit'
                @click='this.blockUser($event)'
            >
                {{ this.blockedTitle ? "Deblokkeer" : "Blokkeer" }}
            </button>
            <button
                class='delete-button'
                type='submit'
                @click='this.deleteUser($event)'
            >
                Verwijder
            </button>
        </section>
    </div>
</template>

<style scoped>
.user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid var(--accent-b);
    box-sizing: border-box;
    padding: 10px;
    height: 100px;
}

.information-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.control-container {
    display: flex;
    align-items: center;
}

button {
    width: 100px;
}

.block-button {
    background-color: transparent;
    color: orange;
}

.block-button:hover {
    color: coral;
    border: none;
}

.unblock-button {
    background-color: transparent;
    color: forestgreen;
}

.unblock-button:hover {
    color: darkgreen;
    border: none;
}

.delete-button {
    background-color: transparent;
    color: red;
}

.delete-button:hover {
    color: darkred;
    border: none;
}
</style>
