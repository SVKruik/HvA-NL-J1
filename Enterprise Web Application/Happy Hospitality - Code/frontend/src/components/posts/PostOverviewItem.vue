<script>
import { formatDateDMY } from "@/utilities/formatController.js";

export default {
    name: "PostOverviewItem",
    methods: {
        formatDateDMY,
        link() {
            this.$router.push(`/posts/${this.id}`)
        }
    },
    data() {
        return {
            "processedContent": this.content
        }
    },
    created() {
        if (this.content.length > 150) this.processedContent = this.content.slice(0, 150) + "...";
    },
    props: {
        id: Number,
        author: String,
        content: String,
        date: String,
        title: String,
        verified: Boolean,
        mainTicket: String,
        subTicket: String
    }
};
</script>

<template>
    <div class='post-overview-item' @click="this.link">
        <img
            :src='`https://files.stefankruik.com/uploads/posts/${this.mainTicket}.png`'
            alt='Post Image'
            class='post-image'
        />
        <hr>
        <div class='content-container'>
            <h3>{{ this.title }}</h3>
            <div class="small-subheader">
                <small>{{ this.author }}</small>
                <p><strong>⋅</strong></p>
                <small>{{ formatDateDMY(this.date, "nl-NL") }}</small>
            </div>
            <p>{{ this.processedContent }}</p>
        </div>
    </div>
</template>

<style scoped>
.post-overview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    width: 100%;
    max-width: 450px;
    box-sizing: border-box;
    border: 1px solid var(--accent-b);
    padding: 10px;
    cursor: pointer;
}

.post-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.content-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
}

.small-subheader {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
    justify-content: flex-end;
}
</style>
