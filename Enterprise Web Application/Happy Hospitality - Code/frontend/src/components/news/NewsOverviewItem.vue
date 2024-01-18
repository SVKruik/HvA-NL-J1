<!-- @author Jenelle Davelaar -->

<script>
export default {
    name: "NewsOverviewItem",
    props: {
        newsId: Number,
        ticket: String,
        type: String,
        title: String,
        date: String
    },
    data() {
        return {
            imageBaseUrl: "https://files.stefankruik.com/news/"
        };
    },
    methods: {
        link() {
            this.$router.push("/news/" + this.newsId);
        }
    }
};
</script>

<template>
    <div class='news-list-item' @click='this.link()'>
        <section class='left'>
            <img :src="this.imageBaseUrl + this.ticket + '.png'" alt='News Image' class='news-list-image'
                 loading='lazy'>
            <div class='news-list-text'>
                <h2 class='news-list-title'>{{ this.title }}</h2>
            </div>
        </section>
        <section class='middle'>
            <p class='thema'>thema:</p>
            <h3>{{ this.type }}</h3>
        </section>
        <section class='right'>
            <h4 class='news-list-date'>{{ this.date }}</h4>
        </section>
    </div>
</template>

<style scoped>

.news-list-item {
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 150px;
    border-bottom: 2px solid var(--fill);
    box-sizing: border-box;
    padding: 10px;
}

.left {
    display: flex;
    align-items: center;
    gap: 40px;
}

.middle {
    flex-direction: column;
}

.thema {
    color: var(--main-hover);
}

.news-list-image {
    width: 130px;
    height: 130px;
    object-fit: cover;
    background-color: var(--fill);
}

.news-list-text {
    display: flex;
    gap: 20px;
    flex-direction: column;
}
</style>