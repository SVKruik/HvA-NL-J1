<script lang="ts">
import { PromptTypes, type PopupItem } from '@/assets/customTypes';
import { useUserStore } from '@/stores/UserStore';
import { fetchCreateFile } from '@/utils/fetch';
import { createTicket } from '@/utils/ticket';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "HomeCreate",
    emits: [
        "popup"
    ],
    data() {
        return {
            "step1": false,
            "step2": Boolean(this.$route.query.type)
        }
    },
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    mounted() {
        if (!this.$route.query.type) return;
        const validFileTypes: Array<string> = ["Word", "PowerPoint"];
        if (!validFileTypes.includes(this.$route.query.type.toString())) {
            this.$router.push("/home/create");
        } else {
            this.step1 = true;
            this.step2 = true;
        };
    },
    methods: {
        handleTypeClick(type: string): void {
            if (type === this.$route.query.type) {
                this.$router.push("/home/create");
                this.step2 = false;
            } else {
                this.$router.push(`/home/create?type=${type}`);
                this.step2 = true;
            }
        },
        getPreviewImage(): string {
            const type = this.$route.query.type;
            switch (type) {
                case "Word":
                    return "/docx-template.png";
                case "PowerPoint":
                    return "/pptx-template.png";
                default:
                    return "/Mixit.png";
            }
        },
        async handleSubmit(event: Event, getPreview: boolean = false): Promise<void> {
            event.preventDefault();
            const type = this.$route.query.type;
            if (!type) return;
            const titleInput = this.$refs["fileCreateTitle"] as HTMLInputElement;
            const subInput = this.$refs["fileCreateSub"] as HTMLInputElement;
            const locationInput = this.$refs["fileCreateLocation"] as HTMLInputElement;

            // Validation
            if ((titleInput.value.length + subInput.value.length + locationInput.value.length) === 0) return this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.danger,
                "message": "Vul alstublieft alle waardes in en probeer opnieuw.",
                "expiryMilliseconds": 5000
            } as PopupItem);

            // Fetching
            const response = await fetchCreateFile(type.toString(), this.userStore.user.email, titleInput.value,
                subInput.value, locationInput.value, getPreview);
            if (response) {
                if (getPreview) {
                    (this.$refs["previewImage"] as HTMLImageElement).setAttribute("src", response.toString());
                } else {
                    if (typeof response === "object") this.$emit("popup", {
                        "id": createTicket(),
                        "type": PromptTypes.success,
                        "message": `Bestand succesvol aangemaakt. U kunt deze nu bekijken op uw SharePoint omgeving. Locatie: ${response.path}`,
                        "expiryMilliseconds": 5000
                    } as PopupItem);
                }
            } else this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.danger,
                "message": "Er ging iets mis tijdens het creëren van uw bestand. Probeer het later nog eens.",
                "expiryMilliseconds": 5000
            } as PopupItem);
        }
    }
});
</script>

<template>
    <div class="content-container flex-col">
        <h1>Creëer</h1>
        <section class="flex-col full-width">
            <article class="flex-col">
                <h2>Recente Gemaakte Bestanden</h2>
                <p>Door u laatst hier of op SharePoint aangemaakt.</p>
            </article>
        </section>
        <section class="flex-col full-width create-container">
            <article class="flex-col">
                <h2>Bestand Aanmaken</h2>
                <p>Kies een template en vul deze in.</p>
            </article>
            <button v-if="!step1" class="file-type-selector file-type-selector-start"
                @click="step1 = true">Creëer</button>
            <div v-if="step1" class="flex button-container full-width">
                <button
                    :class="`file-type-selector file-type-selector-docx ${$route.query.type === 'Word' ? 'selected-docx' : ''}`"
                    @click="handleTypeClick('Word')">Word</button>
                <button
                    :class="`file-type-selector file-type-selector-pptx ${$route.query.type === 'PowerPoint' ? 'selected-pptx' : ''}`"
                    @click="handleTypeClick('PowerPoint')">PowerPoint</button>
            </div>
            <div v-if="step2" class="file-create-form flex">
                <img ref="previewImage" :src="getPreviewImage()" class="preview-image">
                <span class="splitter"></span>
                <form v-if="$route.query.type === 'Word'" class="flex-col">
                    <h3>Vul het Word sjabloon in.</h3>
                    <div class="flex-col">
                        <label for="title">Titel</label>
                        <input id="title" type="text" maxlength="50" ref="fileCreateTitle"
                            placeholder="Vul een titel in." required>
                    </div>
                    <div class="flex-col">
                        <label for="title">Sub Titel</label>
                        <input id="title" type="text" maxlength="50" ref="fileCreateSub"
                            placeholder="Vul een sub-titel in." required>
                    </div>
                    <div class="flex-col">
                        <label for="title">Locatie</label>
                        <input id="title" type="text" maxlength="200" ref="fileCreateLocation"
                            placeholder="Vul een locatie pad in." required>
                    </div>
                    <div class="flex space-between">
                        <button type="submit" class="preview-button"
                            @click="handleSubmit($event, true)">Preview</button>
                        <button type="submit" @click="handleSubmit($event)">Creëer</button>
                    </div>
                </form>
                <form v-else-if="$route.query.type === 'PowerPoint'" class="flex-col">
                    <h3>Vul het PowerPoint sjabloon in.</h3>
                    <div class="flex-col">
                        <label for="title">Titel</label>
                        <input id="title" type="text" maxlength="50" ref="fileCreateTitle"
                            placeholder="Vul een titel in." required>
                    </div>
                    <div class="flex-col">
                        <label for="title">Omschrijving</label>
                        <input id="title" type="text" maxlength="50" ref="fileCreateSub"
                            placeholder="Vul een sub-titel in." required>
                    </div>
                    <div class="flex-col">
                        <label for="title">Locatie</label>
                        <input id="title" type="text" maxlength="200" ref="fileCreateLocation"
                            placeholder="Vul een locatie pad in." required>
                    </div>
                    <div class="flex space-between">
                        <button type="submit" class="preview-button"
                            @click="handleSubmit($event, true)">Preview</button>
                        <button type="submit" @click="handleSubmit($event)">Creëer</button>
                    </div>
                </form>
            </div>
            <strong v-else>Selecteer een bestandstype om verder te gaan.</strong>
        </section>
    </div>
</template>

<style scoped>
.content-container {
    gap: 80px;
}

.create-container {
    gap: 20px;
}

.file-type-selector {
    width: 100%;
    height: 100px;
    border: 1px solid black;
    border-radius: var(--border-radius-mid);
}

.file-type-selector-start {
    background-color: #7aad7a;
    width: 100%;
}

.file-type-selector-docx {
    border: 2px solid blue;
    background-color: #8aa0c8;
}

.file-type-selector-pptx {
    border: 2px solid brown;
    background-color: #ca9e9e;
}

.selected-docx {
    background-color: #4264a3
}

.selected-pptx {
    background-color: #ab5959;
}

.file-create-form {
    width: 100%;
    justify-content: space-evenly;
}

.splitter {
    height: 700px;
    width: 2px;
    background-color: var(--color-fill);
}

.preview-image {
    width: 500px;
    height: 700px;
    object-fit: contain;
}

.space-between {
    justify-content: space-between;
}

.preview-button {
    background-color: green;
}

form {
    gap: 20px;
    width: 350px;
}

form div {
    width: 100%;
}

input {
    border: 1px solid var(--color-fill-dark);
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    border-radius: var(--border-radius-low);
}
</style>
