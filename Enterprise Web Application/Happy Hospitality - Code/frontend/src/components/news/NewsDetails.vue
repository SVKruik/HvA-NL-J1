<!-- @author Jenelle Davelaar -->

<script lang='js'>
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "NewsDetails",
    data() {
        return {
            id: this.$route.params.id,
            imageBaseUrl: "https://files.stefankruik.com/news/",
            selectedNews: {}
        };
    },
    created() {
        this.getNews();
    },
    methods: {
        toNotFound() {
            this.$router.push(`/404`);
        },
        async getNews() {
            const data = await fetchApi(`/news/findById/${this.id}`, "GET");
            if (data.id === undefined) return this.toNotFound();
            documentTitle(data.title);

            this.selectedNews = {
                "title": data.title,
                "date": formatDateDMY(data.date, "nl-NL"),
                "description": data.description,
                "ticket": data.ticket,
                "type": data.type,
                "sub_ticket": data.sub_ticket,
                "sub_ticket_title": data.sub_ticket_title,
                "large_ticket": data.large_ticket,
                "second_description": data.second_description,
                "id": data.id
            };
        }
    }
};
</script>

<template>
    <div>
        <img :src="this.imageBaseUrl + selectedNews.ticket + '.png'" alt='News Image'
             class='news-image'
             loading='lazy'>
    </div>
    <div class='news-intro-wrapper'>
        <section class='news-info-container'>
            <div class='news-title'>
                <h2>{{ selectedNews.title }}</h2>
            </div>
        </section>
        <section class='news-sub-info-container'>
            <p>{{ selectedNews.date }} - {{ selectedNews.type }}</p>
        </section>
    </div>
    <div class='information-section-wrapper'>
        <div class='information-title-wrapper'>
            <h2 class='information-title'>Over het news</h2>
        </div>
        <article>
            <p>{{ selectedNews.description }}</p>
        </article>
        <section v-if='selectedNews.sub_ticket !== null' class='information-image-container'>
            <section class='information-image-title'>
                <p>{{ selectedNews.sub_ticket_title }}</p>
            </section>
            <img :src="this.imageBaseUrl + selectedNews.sub_ticket + '.png'" alt='News Sub Image'
                 class='news-image'
                 loading='lazy'>
        </section>
    </div>
    <section v-if='selectedNews.large_ticket !== null' class='information-image-container-large'>
        <img :src="this.imageBaseUrl + selectedNews.large_ticket + '.png'" alt='News Large Image'
             class='information-image-large'
             loading='lazy'>
    </section>
    <div v-if='selectedNews.second_description !== null' class='information-section-wrapper'>
        <div class='information-title-wrapper'>
            <h2 class='information-title'>Meer informatie</h2>
        </div>
        <article>
            <p>{{ selectedNews.second_description }}</p>
        </article>
    </div>
</template>

<style scoped>
a:hover {
    text-decoration: none;
}

.news-intro-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    max-height: 700px;
    padding: 80px;
}

.news-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    margin-left: 50px;
}

.news-title {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: max-content;
}

.news-sub-info-container {
    display: flex;
    justify-content: flex-end;
    width: max-content;
}

.news-image {
    display: flex;
    width: 100%;
    justify-content: center;
    aspect-ratio: 1;
    object-fit: cover;
    max-height: 400px;
}

.information-section-wrapper {
    display: flex;
    gap: 50px;
    margin: 10px 0 50px 0;
    padding: 50px 80px 50px 80px;
}

.information-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
}

.information-title {
    font-weight: 400;
    width: 150px;
    text-transform: uppercase;
}

.information-image-container {
    display: flex;
    width: 230px;
    height: 230px;
    padding-bottom: 30px;
    justify-content: flex-end;
    align-self: flex-end;
    flex-direction: column;
}

.information-image-title {
    padding: 10px;
}

.information-image-container-large {
    display: flex;
    width: 100%;
    justify-content: center;
}

.information-image-large {
    width: 150%;
    height: 100%;
    aspect-ratio: 2;
    object-fit: cover;
    max-width: 80%;
    max-height: 100%;
}


article {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
    width: 60%;
}

@media (width <= 800px

) {
    .news-intro-wrapper {
        flex-direction: column;
        gap: 30px;
    }

    .news-info-container {
        flex-direction: column;
        align-items: center;
        margin: 0;
    }

    .news-title {
        text-align: center;
    }

    .news-image {
        margin: auto;
        max-width: 400px;
        max-height: 400px;
    }

    .information-section-wrapper {
        flex-direction: column;
        gap: 20px;
    }

    .information-title-wrapper {
        margin: auto;
    }

    article {
        text-align: center;
        width: 90%;
        padding-bottom: 60px;
        margin: auto;
    }
}
</style>