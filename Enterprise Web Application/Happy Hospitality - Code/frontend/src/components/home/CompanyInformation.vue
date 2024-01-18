<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "CompanyInformation",
    methods: {
        scroll() {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <section class='top'>
            <div class='information-title-wrapper'>
                <h2 class='information-title'>Over ons</h2>
            </div>
            <article>
                <p>
                    Happy Hospitality is een collectief dat vanuit innovatie en
                    samenwerking de markt in beweging zet rondom duurzaamheid
                    binnen hospitality. We leggen de verbinding tussen
                    gebruikers en ketenpartners door innovatiehubs te initiëren
                    en vanuit daar te blijven innoveren voor een duurzame horeca
                    branche.
                </p>
            </article>
        </section>
        <section class='bottom'>
            <div class='filler'></div>
            <router-link class='button' to='/about'>Lees meer</router-link>
            <div class='button' @click='this.scroll()'>Nieuwsbrief</div>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper {
    padding-top: 130px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.top,
.bottom {
    display: flex;
    gap: 50px;
}

.information-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
}

.information-title,
.filler {
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

.button:hover {
    text-decoration: underline;
}

@media (width <= 630px) {
    .top {
        flex-direction: column;
    }

    .filler {
        display: none;
    }

    .bottom {
        justify-content: center;
    }

    .content-wrapper {
        flex-direction: column;
        gap: 20px;
    }

    .information-title-wrapper {
        margin: auto;
    }

    article {
        text-align: center;
        width: 90%;
        margin: auto;
    }
}
</style>
