<!-- @author Stefan Kruik -->

<script lang='js'>
import PostItem from "@/components/themeDetails/PostItem.vue";
import { formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "RelatedPosts",
    components: { PostItem },
    props: {
        theme_nl: String
    },
    data() {
        return {
            postList: []
        };
    },
    created() {
        this.populatePosts();
    },
    methods: {
        async populatePosts() {
            const data = await fetchApi(`/posts/related/${this.theme_nl}`, "GET");
            if (data.length === 0) return;
            for (let i = 0; i < data.length; i++) {
                const post = {
                    "title": data[i].title,
                    "date": formatDateDMY(data[i].date, "nl-NL"),
                    "ticket": data[i].main_ticket,
                    "id": data[i].id,
                    "verified": data[i].verified
                };
                this.postList.push(post);
            }
        },
        /**
         * Scroll the post list in either direction.
         * @param direction The direction of the scroll.
         * @param event The click post fired on @click.
         */
        scroll(direction, event) {
            const scrollElement = this.$refs["post-scroll-area"];
            if (!scrollElement) return;
            const childElements = this.$refs["post-item"];
            let scrollAmount = 500;

            // Dynamic Width
            if (childElements && childElements[0]) {
                scrollAmount = childElements[0].$el.offsetWidth;
                scrollAmount += parseInt(getComputedStyle(document.querySelector(".post-area")).gap);
            }

            // Scrolling
            if (direction === "left") {
                if (event.shiftKey) return scrollElement.scrollLeft = 0;
                scrollElement.scrollLeft -= scrollAmount;
            } else if (direction === "right") {
                if (event.shiftKey) return scrollElement.lastElementChild.scrollIntoView({ behavior: "smooth" });
                scrollElement.scrollLeft += scrollAmount;
            }
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <section class='info-area indent'>
            <h2 class='header'>Recente artikelen met dit thema</h2>
            <div class='info-area-controls'>
                <div class='view-all-wrapper'>
                    <div class='accent'></div>
                    <router-link :to='`/posts?theme=${this.theme_nl}`'
                    >Bekijk alle
                    </router-link>
                </div>
                <div class='button-container'>
                    <button
                        class='shift-left'
                        type='button'
                        @click="scroll('left', $event)"
                    >
                        ←
                    </button>
                    <button
                        class='shift-right'
                        type='button'
                        @click="scroll('right', $event)"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
        <section
            v-if='postList.length > 0'
            ref='post-scroll-area'
            class='post-area'
        >
            <div class='offset-block'></div>
            <PostItem
                v-for='post in postList'
                :key='post.id'
                ref='post-item'
                :date='post.date'
                :postId='post.id'
                :ticket='post.ticket'
                :title='post.title'
            >
            </PostItem>
            <div class='offset-block'></div>
        </section>
        <h4 v-else class='placeholder'>
            Geen recente artikelen gevonden met dit thema.
        </h4>
    </div>
</template>

<style scoped>
.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.placeholder {
    width: 80%;
    margin: auto;
}

.info-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-area-controls {
    display: flex;
    gap: 20px;
}

.accent {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--accent-a);
}

.view-all-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
}

.button-container {
    display: flex;
}

button {
    width: 60px;
    height: 30px;
    background-color: transparent;
    border: 2px solid var(--accent-b);
    color: var(--font-dark);
}

button:hover {
    background-color: var(--accent-b);
    color: var(--font-light);
}

.shift-right {
    border-left: none;
}

.post-area::-webkit-scrollbar {
    display: none;
}

.post-area {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.post-area {
    display: flex;
    gap: 50px;
    overflow: hidden;
    overflow-x: auto;
}

.offset-block {
    width: 0;
}

@media (width <= 680px) {
    .info-area {
        flex-direction: column;
        gap: 20px;
    }

    .info-area-controls {
        gap: 0;
        width: 90%;
        justify-content: space-between;
    }
}

@media (width <= 415px) {
    .header {
        text-align: center;
    }

    .post-area {
        gap: 20px;
    }
}
</style>
