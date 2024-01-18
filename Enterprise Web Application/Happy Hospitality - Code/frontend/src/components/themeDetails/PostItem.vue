<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "PostItem",
    props: {
        title: String,
        date: String,
        postId: Number,
        ticket: String,
        verified: Boolean
    },
    methods: {
        linkPost() {
            this.$router.push("/posts/" + this.postId);
        }
    }
};
</script>

<template>
    <div class='post-container'>
        <div class='image-container' @click='linkPost()'>
            <img
                :src='`https://files.stefankruik.com/uploads/posts/${this.ticket}.png`'
                alt='Post Image'
                class='post-image'
                loading='lazy'
            />
        </div>
        <div class='information-container' @click='linkPost()'>
            <h2 class='post-title'>{{ this.title }}</h2>
            <p class='post-date'>{{ this.date }}</p>
        </div>
    </div>
</template>

<style scoped>
.post-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 350px;
    height: 350px;
    background-color: var(--fill);
    cursor: pointer;
}

.post-image {
    width: 320px;
    height: 320px;
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

    .post-image {
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
