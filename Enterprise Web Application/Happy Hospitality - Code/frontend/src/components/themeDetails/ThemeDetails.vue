<!-- @author Stefan Kruik -->

<script lang='js'>
import RelatedPosts from "@/components/themeDetails/RelatedPosts.vue";
import { documentTitle } from "@/utilities/formatController";

export default {
    name: "ThemeDetails",
    components: { RelatedPosts },
    data() {
        return {
            name: this.$route.params.name,
            description: "",
            themes_nl: ["energie", "mens", "logistiek", "eiwit", "verspilling", "water"],
            theme_nl: ""
        };
    },
    created() {
        documentTitle(`Thema ${this.name.charAt(0).toUpperCase()}${this.name.substring(1)}`);
        if (!this.themes_nl.includes(this.name)) return this.$router.push("/404");
        this.theme_nl = this.name;
        fetch(`/data/themes/${this.name}.json`)
            .then((response) => response.json())
            .then((json) => this.setup(json.description))
            .catch(() => this.$router.push("/"));
    },
    methods: {
        setup(description) {
            this.description = description.replace(/\n/g, "<br>");
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <section class='indent button-wrapper'>
            <router-link to='/'
            ><img
                alt='<-'
                class='return-button'
                src='../../assets/icons/arrow-left.svg'
            />
            </router-link>
        </section>
        <section class='indent theme-details'>
            <div class='information-title-wrapper'>
                <h2 class='information-title'>{{ this.theme_nl }}</h2>
            </div>
            <article>
                <p v-html='this.description'></p>
            </article>
            <div class='theme-image-wrapper'>
                <img
                    :src='`https://files.stefankruik.com/themes/${this.name}.svg`'
                    alt='Theme Image'
                    class='theme-image'
                />
            </div>
        </section>
        <!-- Replace with filtered posts. -->
        <RelatedPosts
            :theme_nl='this.theme_nl'
        ></RelatedPosts>
    </div>
</template>

<style scoped>
.content-wrapper {
    padding-top: 140px;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.return-button {
    width: 40px;
    height: 40px;
}

.theme-details {
    display: flex;
    gap: 30px;
}

.information-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
    width: fit-content;
}

.information-title {
    font-weight: 400;
    width: 150px;
    text-transform: uppercase;
}

article {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 70%;
}

.theme-image-wrapper {
    display: flex;
    align-items: flex-end;
}

@media (width <= 800px) {
    .theme-details {
        flex-direction: column;
        align-items: center;
    }

    article {
        width: 100%;
    }
}
</style>
