<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "FaqInfo",
    methods: {
        /**
         * Fold the FAQ text in or out.
         * @param event The click event fired on @click.
         * @param id The ID of the target fold out.
         */
        foldOut(event, id) {
            const content = document.getElementById(`content-${id}`);
            const symbol = document.getElementById(`symbol-${id}`);
            if (!content) return;

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                symbol.innerText = "╋";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                symbol.innerText = "━";
            }
        }
    },
    mounted() {
        const elements = document.getElementsByClassName("faq-header");
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", (event) => this.foldOut(event, i + 1));
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <h2>Veelgestelde Vragen</h2>
        <section class='faq-container'>
            <div class='faq-item'>
                <div id='button-1' class='faq-header'>
                    <button type='button'>Wat is het HHC?</button>
                    <div id='symbol-1' class='fold-status-icon'>╋</div>
                </div>
                <p id='content-1' class='faq-text'>
                    Happy Hospitality is een collectief dat vanuit innovatie en
                    samenwerking de markt in beweging zet rondom duurzaamheid
                    binnen hospitality. We leggen de verbinding tussen
                    gebruikers en ketenpartners door innovatiehubs te initiëren
                    en vanuit daar te blijven innoveren voor een duurzame horeca
                    branche.
                </p>
            </div>
            <div class='faq-item'>
                <div id='button-2' class='faq-header'>
                    <button type='button'>Wat doet het HCC?</button>
                    <div id='symbol-2' class='fold-status-icon'>╋</div>
                </div>
                <p id='content-2' class='faq-text'>
                    We pakken de meest actuele duurzame thema’s, de grootste
                    horeca problemen en gaan met elkaar werken aan constructieve
                    oplossingen en innovaties. Dit doen we door het gesprek te
                    faciliteren, een grootschalig onderzoek uit te zetten in de
                    markt, de inzichten te vertalen naar concrete
                    probleemstellingen, deze met experts te analyseren door met
                    verschillende waardeproposities te komen, en deze vervolgens
                    te testen in de markt.
                </p>
            </div>
            <div class='faq-item'>
                <div id='button-3' class='faq-header'>
                    <button type='button'>
                        Hoe kan ik met het HHC in contact komen?
                    </button>
                    <div id='symbol-3' class='fold-status-icon'>╋</div>
                </div>
                <p id='content-3' class='faq-text'>
                    Vul onderop de pagina het formulier in op
                    <a
                        class='marked-link'
                        href='https://www.happyhospitality.online/'
                        target='_blank'
                    >deze</a
                    >
                    website, en wij nemen contact met je op.
                </p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper,
.faq-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
}

.faq-container {
    min-height: 400px;
}

.faq-header {
    display: flex;
    align-items: center;
}

.faq-item {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.fold-status-icon {
    user-select: none;
    cursor: pointer;
}

button {
    background-color: transparent;
    width: 800px;
    text-align: left;
    border-bottom: 2px solid var(--font-dark);
    color: var(--font-dark);
    font-size: 20px;
}

button:hover {
    outline: none;
    border: none;
    border-bottom: 2px solid var(--font-dark);
}

.faq-text {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-out;
    width: 90%;
    max-width: 800px;
}
</style>
