<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { File } from '@/assets/customTypes';
import { fileType } from '@/utils/files';

export default defineComponent({
    name: "FileDetailsItem",
    props: {
        "fileDetails": { type: Object as PropType<File>, required: true }
    },
    methods: {
        getFileType(): string {
            return fileType(this.fileDetails.name.split(".")[1])
        }
    }
});
</script>

<template>
    <div class="details-wrapper flex">
        <section class="left-details">
            <img :src="fileDetails.image" class="preview-image" alt="Preview Image">
        </section>
        <span class="splitter"></span>
        <section class="right-details flex-col">
            <div class="file-details-container-item flex-col">
                <h3>General</h3>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Naam</p>
                    <p>{{ fileDetails.name.split(".")[0] }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Type</p>
                    <p>{{ getFileType() }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Nieuwste Versie</p>
                    <p>{{ fileDetails.version }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Grootte</p>
                    <p>{{ fileDetails.size }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">ID</p>
                    <p>{{ fileDetails.id }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Pad</p>
                    <a :href="fileDetails.link" target="_blank">{{ fileDetails.path }}</a>
                </div>
            </div>
            <div class="file-details-container-item flex-col">
                <h3>Author</h3>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Naam</p>
                    <p>{{ fileDetails.createdAuthorName }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Email</p>
                    <p>{{ fileDetails.createdAuthorEmail }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Profiel Afbeelding</p>
                    <img :src="fileDetails.createdAuthorImage" class="profile-picture">
                </div>
            </div>
            <div class="file-details-container-item flex-col">
                <h3>Modifier</h3>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Naam</p>
                    <p>{{ fileDetails.modifiedAuthorName }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Email</p>
                    <p>{{ fileDetails.modifiedAuthorEmail }}</p>
                </div>
                <div class="file-details-item flex">
                    <p class="file-detail-identifier">Profiel Afbeelding</p>
                    <img :src="fileDetails.modifiedAuthorImage" class="profile-picture">
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.details-wrapper {
    box-sizing: border-box;
    padding: 30px;
    align-items: flex-start;
    gap: 10px;
}

.preview-image {
    height: 700px;
    min-width: 500px;
    max-width: 600px;
    object-fit: fill;
}

.right-details {
    gap: 20px;
}

.file-detail-identifier {
    color: #626262;
}

.file-details-item {
    justify-content: space-between;
    width: 600px;
}

.profile-picture {
    height: 40px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid black;
}

.splitter {
    height: 700px;
    width: 2px;
    background-color: var(--color-fill);
}
</style>