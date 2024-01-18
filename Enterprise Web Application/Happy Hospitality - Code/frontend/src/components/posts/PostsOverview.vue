<!-- @author Stefan Kruik -->

<script lang='js'>
import PostOverviewItem from "@/components/posts/PostOverviewItem.vue";
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";
import { getItem, setItem } from "@/utilities/sessionController";

export default {
    name: "PostsOverview",
    components: { PostOverviewItem },
    data() {
        return {
            themeFilter: this.$route.query.theme,
            themes_nl: ["energie", "mens", "logistiek", "eiwit", "verspilling", "water"],
            posts: []
        };
    },
    async mounted() {
        documentTitle("Artikelen");
        // Loading Active Theme Filter
        if (!this.themeFilter) {
            const sessionThemeFilter = getItem("postFilterTheme");
            if (sessionThemeFilter) {
                const element = document.getElementById(sessionThemeFilter);
                if (element) element.checked = true;
            }
        } else {
            if (this.themes_nl.includes(this.themeFilter)) {
                setItem("postFilterTheme", this.themeFilter);
                const element = document.getElementById(this.themeFilter);
                if (element) element.checked = true;
            }
        }

        // Loading Active Date Filter
        const sessionDateFilter = getItem("postFilterDate");
        if (sessionDateFilter) {
            const element = document.getElementById(sessionDateFilter);
            if (element) element.checked = true;
        }

        // Filter Themes
        const themeFilters = document.querySelectorAll("input[name='post_theme']");
        const validThemeFilters = ["energie", "eiwit", "water", "verspilling", "mens", "logistiek", "all_themes"];
        for (let i = 0; i < themeFilters.length; i++) {
            themeFilters[i].addEventListener("click", () => {
                const value = themeFilters[i].value;
                if (!validThemeFilters.includes(value)) return;
                setItem("postFilterTheme", value);
                this.loadPosts();
                this.$router.push(this.$route.path);
            });
        }

        // Filter Dates
        const dateFilters = document.querySelectorAll("input[name='post_date']");
        const validDateFilters = ["week", "month", "triomonth", "hexamonth", "all"];
        for (let i = 0; i < dateFilters.length; i++) {
            dateFilters[i].addEventListener("click", () => {
                const value = dateFilters[i].value;
                if (!validDateFilters.includes(value)) return;
                setItem("postFilterDate", value);
                this.loadPosts();
            });
        }

        await this.loadPosts();
    },
    methods: {
        async loadPosts() {
            // Defining
            let query = "";
            const theme = getItem("postFilterTheme");
            const date = getItem("postFilterDate");

            // Constructing
            if (theme) query += `?theme=${theme}`;
            if (!theme && date) {
                query += `?date=${date}`;
            } else if (theme && date) query += `&date=${date}`;

            // Fetching
            this.posts = await fetchApi(`/posts/postOverview${query}`, "GET");
            const element = document.getElementById("postContainer");
            if (this.posts.length === 0) {
                element.classList.add("single-column");
            } else element.classList.remove("single-column");
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <div class='post-filter-container'>
            <h2>Filters</h2>
            <hr>
            <section class="post-filter-item">
                <h3>Thema's</h3>
                <div class="theme-filter-items">
                    <div class="theme-filter-item">
                        <input id="energie" name="post_theme" type="radio" value="energie">
                        <label for="energie">Energie</label>
                    </div>
                    <div class="theme-filter-item">
                        <input id="eiwit" name="post_theme" type="radio" value="eiwit">
                        <label for="eiwit">Eiwit</label>
                    </div>
                    <div class="theme-filter-item">
                        <input id="water" name="post_theme" type="radio" value="water">
                        <label for="water">Water</label>
                    </div>
                    <div class="theme-filter-item">
                        <input id="verspilling" name="post_theme" type="radio" value="verspilling">
                        <label for="verspilling">Verspilling</label>
                    </div>
                    <div class="theme-filter-item">
                        <input id="mens" name="post_theme" type="radio" value="mens">
                        <label for="mens">Mens</label>
                    </div>
                    <div class="theme-filter-item">
                        <input id="logistiek" name="post_theme" type="radio" value="logistiek">
                        <label for="logistiek">Logistiek</label>
                    </div>
                    <div class="theme-filter-item">
                        <input id="all_themes" name="post_theme" type="radio" value="all_themes">
                        <label for="all_themes">Alles</label>
                    </div>
                </div>
            </section>
            <hr>
            <section class="post-filter-item">
                <h3>Datum</h3>
                <div class="date-filter-item">
                    <input id="week" name="post_date" type="radio" value="week">
                    <label for="week">Deze week</label>
                </div>
                <div class="date-filter-item">
                    <input id="month" name="post_date" type="radio" value="month">
                    <label for="month">Deze maand</label>
                </div>
                <div class="date-filter-item">
                    <input id="triomonth" name="post_date" type="radio" value="triomonth">
                    <label for="triomonth">Afgelopen 3 maanden</label>
                </div>
                <div class="date-filter-item">
                    <input id="hexamonth" name="post_date" type="radio" value="hexamonth">
                    <label for="hexamonth">Afgelopen 6 maanden</label>
                </div>
                <div class="date-filter-item">
                    <input id="all" checked name="post_date" type="radio" value="all">
                    <label for="all">Alles</label>
                </div>
            </section>
        </div>
        <div id="postContainer" class='post-overview-container'>
            <p v-if="this.posts.length === 0" class="placeholder-text">Er zijn nog geen artikelen geplaatst die aan deze
                filters voldoen.</p>
            <PostOverviewItem
                v-for='post in this.posts'
                :id='post.id'
                :key='post.id'
                :author='post.author'
                :content='post.content'
                :date='post.date'
                :main-ticket='post.main_ticket'
                :sub-ticket='post.sub_ticket'
                :title='post.title'
                :verified='post.verified'
            ></PostOverviewItem>
        </div>
    </div>
</template>

<style scoped>
.content-wrapper {
    padding-top: 140px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 90%;
    margin: auto;
}

.post-filter-container {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--accent-b);
    max-width: 350px;
    box-sizing: border-box;
    padding: 20px;
    gap: 10px;
    height: fit-content;
}

.post-overview-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.single-column {
    grid-template-columns: 1fr;
}

.post-filter-item,
.theme-filter-items,
.theme-filter-item,
.date-filter-item {
    display: flex;
    gap: 10px;
}

.post-filter-item,
.theme-filter-items {
    flex-direction: column;
}

.theme-filter-item,
.date-filter-item {
    align-items: center;
}

label {
    cursor: pointer;
}

.placeholder-text {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
}
</style>
