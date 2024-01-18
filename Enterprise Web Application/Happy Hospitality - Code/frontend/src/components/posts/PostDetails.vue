<!-- @author Milou Hogendoorn -->

<script lang='js'>
import { documentTitle, formatDateDMY } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "PostDetails",
    data() {
        return {
            id: this.$route.params.id,
            imageBaseUrl: "https://files.stefankruik.com/uploads/posts/",
            selectedPost: {}
        };
    },
    created() {
        this.getPost();
    },
    methods: {
        toNotFound() {
            this.$router.push(`/404`);
        },
        async getPost() {
            const data = await fetchApi(`/posts/findById/${this.id}`, "GET");
            documentTitle(data.title);
            if (data.id === undefined) return this.toNotFound();

            this.selectedPost = {
                "id": data.id,
                "author": data.author,
                "content": data.content,
                "date": formatDateDMY(data.date, "nl-NL"),
                "title": data.title,
                "verified": data.verified,
                "main_ticket": data.main_ticket,
                "sub_ticket": data.sub_ticket,
                "sub_ticket_title": data.sub_ticket_title,
                "large_ticket": data.large_ticket,
                "second_content": data.second_content
            };
        }
    }
};
</script>

<template>
    <div>
        <img :src="this.imageBaseUrl + selectedPost.main_ticket + '.png'" alt='Post Image'
             class='post-image'
             loading='lazy'>
    </div>
    <div class='post-intro-wrapper'>
        <section class='post-info-container'>
            <div class='post-title'>
                <h2>{{ selectedPost.title }}</h2>
            </div>
        </section>
        <section class='post-sub-info-container'>
            <p>{{ selectedPost.date }} - Geschreven door {{ selectedPost.author }}</p>
        </section>
    </div>
    <div class='information-section-wrapper'>
        <div class='information-title-wrapper'>
            <h2 class='information-title'>Details</h2>
        </div>
        <article>
            <p>{{ selectedPost.content }}</p>
        </article>
        <section v-if='selectedPost.sub_ticket !== null' class='information-image-container'>
            <section class='information-image-title'>
                <p>{{ selectedPost.sub_ticket_title }}</p>
            </section>
            <img :src="this.imageBaseUrl + selectedPost.sub_ticket + '.png'" alt='Post Sub Image'
                 class='post-image'
                 loading='lazy'>
        </section>
    </div>
    <section v-if='selectedPost.large_ticket !== null' class='information-image-container-large'>
        <img :src="this.imageBaseUrl + selectedPost.large_ticket + '.png'" alt='Post Large Image'
             class='information-image-large'
             loading='lazy'>
    </section>
    <div v-if='selectedPost.second_content !== null' class='information-section-wrapper'>
        <div class='information-title-wrapper'>
            <h2 class='information-title'>Meer informatie</h2>
        </div>
        <article>
            <p>{{ selectedPost.second_content }}</p>
        </article>
    </div>
</template>

<style scoped>
a:hover {
    text-decoration: none;
}

.post-intro-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    max-height: 700px;
    padding: 80px;
}

.post-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    margin-left: 50px;
}

.post-title {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: max-content;
}

.post-sub-info-container {
    display: flex;
    justify-content: flex-end;
    width: max-content;
}

.post-image {
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
    .post-intro-wrapper {
        flex-direction: column;
        gap: 30px;
    }

    .post-info-container {
        flex-direction: column;
        align-items: center;
        margin: 0;
    }

    .post-title {
        text-align: center;
    }

    .post-image {
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