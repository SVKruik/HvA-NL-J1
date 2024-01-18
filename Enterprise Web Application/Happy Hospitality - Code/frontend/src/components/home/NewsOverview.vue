<!-- @author Jenelle Davelaar -->

<script lang='js'>

import NewsOverviewItem from "@/components/news/NewsOverviewItem.vue";
import { formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "NewsOverview",
    components: { NewsOverviewItem },
    data() {
        return {
            newsList: [],
            imageBaseUrl: "https://files.stefankruik.com/news/",
            selectedType: null
        };
    },
    async created() {
        this.newsList = await this.populateAllNews();
    },
    methods: {
        async populateAllNews() {
            this.clearSelection();
            this.newsList.length = 0;

            const newList = [];
            const data = await fetchApi(`/news/allNews`, "GET");
            if (data.length === 0) return newList;

            for (let i = 0; i < data.length; i++) {
                const news = {
                    "title": data[i].title,
                    "date": formatDateDMY(data[i].date, "nl-NL"),
                    "ticket": data[i].ticket,
                    "type": data[i].type,
                    "id": data[i].id
                };
                newList.push(news);
            }

            this.newsList = newList;
            return newList;
        },

        async populateNewsPerType(type) {
            this.newsList.length = 0;

            const validTypes = ["challenges", "research", "networking"];
            if (!validTypes.includes(type)) return false;

            const newsPerTypeList = [];
            const data = await fetchApi(`/news/${type}`, "GET");
            if (data.length === 0) return newsPerTypeList;

            //Add news to list
            for (let i = 0; i < data.length; i++) {
                const news = {
                    "title": data[i].title,
                    "date": formatDateDMY(data[i].date, "nl-NL"),
                    "ticket": data[i].ticket,
                    "type": data[i].type,
                    "id": data[i].id
                };
                newsPerTypeList.push(news);
            }

            this.selectedType = type;
            this.newsList = newsPerTypeList;
        },

        clearSelection() {
            this.selectedType = null;
        },

        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <h2>News</h2>
        <section class='news-container'>
            <!--Generates a block for each type of news-->
            <div
                v-for="type in ['challenges', 'research', 'networking']"
                :key='type'
                :class="{ 'news-item': true, 'selected': type === selectedType }"
                @click='populateNewsPerType(type)'
            >
                <img
                    :src='`${this.imageBaseUrl}${type}.svg`'
                    alt='News Image'
                    class='news-image'
                />
                <p class='news-description'>{{ capitalizeFirstLetter(type) }}</p>
            </div>
        </section>
        <div class='news-title-wrapper' @click='populateAllNews'>
            <h2 class='news-title'>Alle nieuws</h2>
        </div>
        <NewsOverviewItem
            v-for='news in newsList'
            :key='news.id'
            :date='news.date'
            :newsId='news.id'
            :ticket='news.ticket'
            :title='news.title'
            :type='news.type'
        ></NewsOverviewItem>
    </div>
</template>

<style scoped>

.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.news-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 80px;
    row-gap: 40px;
    justify-items: center;
}

.news-item {
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-sizing: border-box;
    border: 1px solid var(--accent-b);
    cursor: pointer;
}

.news-item .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.news-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 80px;
    row-gap: 40px;
    justify-items: center;
}

.news-item {
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-sizing: border-box;
    border: 1px solid var(--accent-b);
    cursor: pointer;
}

.news-item:hover {
    border: 3px solid var(--accent-b);
}

.selected {
    background-color: var(--fill);
}

.news-image {
    width: 60%;
}

.news-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
    width: fit-content;
    margin-top: 15px;
}

.news-title {
    font-weight: 400;
    width: 150px;
    text-transform: uppercase;
}

.news-title-wrapper:hover {
    padding: 15px;
    cursor: pointer;
}

@media (width <= 730px

) {
    .news-container {
        row-gap: 0;
        gap: 30px;
        grid-template-columns: 1fr 1fr;
    }

    .news-item {
        gap: 20px;
    }
}

cus {
    border: 1px solid var(--accent-a);
}

.news-image {
    width: 60%;
}

.news-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
    width: fit-content;
    margin-top: 15px;
}

.news-title {
    font-weight: 400;
    width: 150px;
    text-transform: uppercase;
}

@media (width <= 730px  ) {
    .news-container {
        row-gap: 0;
        gap: 30px;
        grid-template-columns: 1fr 1fr;
    }

    .news-item {
        gap: 20px;
    }
}
</style>