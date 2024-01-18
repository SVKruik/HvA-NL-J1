<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "AdminDeveloperItem",
    props: {
        name: String,
        id: Number,
        image: String,
        url: String,
        title: String
    }
};
</script>

<template>
    <a :href='this.url' class='developer-item' target='_blank'>
        <img :src='this.image' alt='Profile'/>
        <div class='information-container'>
            <small
            ><strong>{{ this.name }}</strong></small
            >
            <small>{{ this.title }}</small>
        </div>
    </a>
</template>

<style scoped>
.developer-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.information-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
}
</style>
