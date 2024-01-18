<!-- @author Stefan Kruik -->

<script lang='js'>

export default {
    name: "MainEvent",
    props: {
        title: String,
        date: Date,
        id: Number,
        ticket: String
    },
    data() {
        return {
            imageBaseUrl: "https://files.stefankruik.com/uploads/events/"
        };
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <section class='post-info-container'>
            <div class='post-info-title'>
                <h2 class='post-title'>{{ this.title }}</h2>
                <p class='post-date'>
                    {{
                        this.date.toLocaleDateString("nl-NL", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })
                    }}
                </p>
            </div>
            <router-link :to='/events/ + this.id' class='button'
            ><p>Lees meer</p></router-link
            >
        </section>
        <section class='post-image-container'>
            <img
                :src="this.imageBaseUrl + this.ticket + '.png'"
                alt='Event Image'
                class='main-image'
                loading='lazy'
            />
        </section>
    </div>
</template>

<style scoped>
a:hover {
    text-decoration: none;
}

.content-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    max-height: 700px;
}

.post-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}

.post-info-title {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.post-title {
    width: 300px;
}

.post-date {
    font-size: 14px;
}

.post-image-container {
    display: flex;
    width: 100%;
    justify-content: flex-end;
}

.main-image {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    max-width: 700px;
    max-height: 700px;
}

@media (width <= 800px) {
    .content-wrapper {
        flex-direction: column;
        gap: 30px;
    }

    .post-info-container {
        flex-direction: column;
        align-items: center;
    }

    .post-info-title {
        text-align: center;
    }

    .main-image {
        margin: auto;
        max-width: 400px;
        max-height: 400px;
    }
}
</style>
