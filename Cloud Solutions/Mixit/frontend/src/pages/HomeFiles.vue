<script lang="ts">
import { type PopupItem, PromptTypes, type RecentFileItem, type DateFormat } from '@/assets/customTypes';
import { useFileStore } from '@/stores/FileStore';
import { useUserStore } from '@/stores/UserStore';
import { getDate } from '@/utils/date';
import { fetchRecentFiles } from '@/utils/fetch';
import { fileType } from '@/utils/files';
import { createTicket } from '@/utils/ticket';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "HomeFiles",
    emits: [
        "popup"
    ],
    data() {
        return {
            "recentFileItems": [] as Array<RecentFileItem>,
            "path": this.$route.params.path as string,
            "placeholderMessage": null as null | string
        }
    },
    setup() {
        return {
            fileStore: useFileStore(),
            userStore: useUserStore()
        }
    },
    async created() {
        // Recent Files
        this.recentFileItems = this.fileStore.recentFiles;
        if (!this.recentFileItems.length) await this.recentFiles();
    },
    methods: {
        popup(data: PopupItem) {
            this.$emit("popup", data);
        },
        async recentFiles(): Promise<string> {
            const files = await fetchRecentFiles(this.userStore.user.email, 3);
            if (files && typeof files === "object") {
                this.recentFileItems = files;
                this.fileStore.setRecentFiles(files);
                if (files.length === 0) this.placeholderMessage = "U heeft geen recent bewerkte bestanden."
            } else this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.danger,
                "message": "Er ging iets mis tijdens het ophalen van de recente bestanden.",
                "expiryMilliseconds": 5000
            } as PopupItem);
            return typeof files;
        },
        recentFileDate(date: Date): string {
            const rawDate: DateFormat = getDate(date);
            return `Op ${rawDate.date} om ${rawDate.time}`;
        },
        handleImageError(file: RecentFileItem): void {
            const image: HTMLImageElement = (this.$refs[`recent-file-image-${file.id}`] as Array<HTMLImageElement>)[0];
            const icon: HTMLImageElement = (this.$refs[`recent-file-icon-${file.id}`] as Array<HTMLImageElement>)[0];
            icon.classList.add("invisible");
            image.src = icon.src;
        },
        getFileType(rawType: string): string {
            return fileType(rawType);
        },
        recentFileClick(file: RecentFileItem): void {
            this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.warning,
                "message": `Het bekijken van bestandsdetails en mappen is nog WIP. - ${file.name + ", " + this.getFileType(file.type)}`,
                "expiryMilliseconds": 5000
            } as PopupItem);
        }
    }
});
</script>

<template>
    <div class="content-container flex-col">
        <h1>Bestanden</h1>
        <section class="recent-files flex-col full-width">
            <article class="flex-col">
                <h2>Recente Bestanden</h2>
                <p>Door u het laatst bijgewerkt.</p>
            </article>
            <div class="recent-file-container flex full-width">
                <div v-if="!recentFileItems.length" class="flex">
                    <p>{{ placeholderMessage || "Aan het laden. Een animatie hiervoor is nog WIP." }}</p>
                    <i v-if="!placeholderMessage" class="fa-solid fa-spinner fa-spin"></i>
                </div>
                <div v-for="recentFile in recentFileItems" :key="recentFile.id" class="recent-file-item flex">
                    <span @click="recentFileClick(recentFile)" class="click-item"></span>
                    <div class="recent-file-image-container flex">
                        <img :ref="`recent-file-image-${recentFile.id}`" @error="handleImageError(recentFile)"
                            :src="recentFile.image" alt="Recent File Image" class="recent-file-image">
                        <img :ref="`recent-file-icon-${recentFile.id}`" :src="`/File Extensions/${recentFile.type}.png`"
                            class="recent-file-icon" :alt="`${recentFile.type} File`">
                    </div>
                    <article class="recent-file-details flex-col">
                        <h3>{{ recentFile.name }}</h3>
                        <p>{{ recentFileDate(recentFile.lastModified) }}</p>
                        <small>{{ getFileType(recentFile.type) }}</small>
                    </article>
                </div>
            </div>
        </section>
        <section class="file-container flex-col full-width">
            <h2>Overzicht</h2>
            <div class="tabs flex">
                <RouterLink class="tab-link" to="/home/files/organization">Organisatie</RouterLink>
                <RouterLink class="tab-link" to="/home/files/author">Uw Bestanden</RouterLink>
            </div>
            <span class="page-splitter"></span>
            <RouterView @popup="popup"></RouterView>
        </section>
    </div>
</template>

<style scoped>
.content-container {
    gap: 80px;
}

.tabs {
    margin-bottom: -17px;
    z-index: 1;
    gap: 20px;
}

.file-container {
    gap: 15px;
}

.tab-link {
    color: var(--color-text);
    font-size: medium;
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 2px solid var(--color-fill);
}

.active-router-link {
    border-bottom: 2px solid var(--color-fill-dark);
}

.recent-files {
    gap: 30px;
}

.recent-file-item {
    background-color: var(--color-fill);
    box-sizing: border-box;
    padding: 15px;
    border-radius: var(--border-radius-mid);
    position: relative;
    cursor: pointer;
}

.recent-file-item .click-item {
    margin-left: -15px;
}

.recent-file-image-container {
    position: relative;
    width: 180px;
    height: 180px;
}

.recent-file-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
}

.recent-file-image {
    height: 175px;
    width: 175px;
    object-fit: cover;
    border-radius: var(--border-radius-low);
}

.invisible {
    opacity: 0;
}

.recent-file-container {
    justify-content: space-evenly;
    flex-wrap: wrap;
}

.recent-file-details {
    justify-content: space-evenly;
    height: 120px;
}
</style>
