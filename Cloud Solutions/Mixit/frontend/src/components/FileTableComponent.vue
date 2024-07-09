<script lang="ts">
import { defineComponent } from 'vue'
import {
    type File,
    type FileOverviewItem,
    type FileTableColumn,
    type PopupItem,
    PromptTypes
} from "@/assets/customTypes";
import { fileType } from "@/utils/files";
import { createTicket } from "@/utils/ticket";
import { fetchFileDetails } from "@/utils/fetch";
import FileDetailsItem from "@/components/FileDetailsItem.vue";

export default defineComponent({
    name: "FileTableComponent",
    components: { FileDetailsItem },
    emits: [
        "popup",
        "refresh"
    ],
    props: {
        files: {
            type: Array<FileOverviewItem>,
            required: true
        },
        columns: {
            type: Array as () => FileTableColumn[],
            default: () => [
                { name: 'ID', field: 'id', sortable: true },
                { name: 'Type', field: 'type', sortable: true },
                { name: 'SharePoint', field: 'link', sortable: false }
            ]
        },
        isRefreshing: {
            type: Boolean,
            default: false
        },
        selectedFileName: {
            type: String,
            default: null
        },
        rootPath: {
            type: String,
            default: "organization"
        }
    },
    data() {
        return {
            selectedFile: null as unknown as File
        }
    },
    created() {
        if (this.selectedFileName) this.loadIndividualFile(this.getFileByName(this.selectedFileName));
    },
    methods: {
        refreshFileOverview(button: HTMLButtonElement): void {
            // Disable Button & Load Icon
            if (button.disabled) return;
            this.$emit("refresh", button);
        },
        handleImageError(file: FileOverviewItem) {
            const image: HTMLImageElement = (this.$refs[`file-icon-${file.id}`] as Array<HTMLImageElement>)[0] as HTMLImageElement;
            image.src = "/File Extensions/unknown.png";
        },
        getFileById(id: number): FileOverviewItem {
            return this.files.filter((file: any) => file.id === id)[0] as FileOverviewItem;
        },
        getFileByName(name: string): FileOverviewItem {
            return this.files.filter((file: any) => file.name === name)[0] as FileOverviewItem;
        },
        getFullFileName(file: FileOverviewItem): string {
            return file.isFolder ? file.name : `${file.name}.${file.type}`;
        },
        selectedFileFolder(): boolean {
            if (!this.$route.params.path) return true;
            const activeFile: string = this.$route.params.path.toString();
            if (activeFile) {
                const file: FileOverviewItem = this.getFileByName(activeFile);
                if (file) return file.isFolder;
                return true;
            } else return true;
        },
        getFileType(rawType: string): string {
            return fileType(rawType);
        },
        async handleFileClick(file: FileOverviewItem): Promise<void> {
            this.$router.push(`/home/files/${this.rootPath}/${file.name}`);
            if (!file.isFolder) await this.loadIndividualFile(file);
        },
        async loadIndividualFile(file: FileOverviewItem): Promise<void> {
            if (!file) return this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.danger,
                "message": "Het bestand met de opgegeven naam bestaat niet. Dit bestand is mogelijk verwijderd.",
                "expiryMilliseconds": 5000
            } as PopupItem);

            this.selectedFile = {} as File;
            const fileDetailsResult: File | boolean = await fetchFileDetails(file.id, file.link);
            if (fileDetailsResult && typeof fileDetailsResult === "object") {
                this.selectedFile = fileDetailsResult;
            } else this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.danger,
                "message": "Er ging iets mis tijdens het ophalen van het geselecteerde bestand.",
                "expiryMilliseconds": 5000
            } as PopupItem);
        }
    },
})

</script>

<template>
    <div class="files-header flex">
        <menu class="breadcrumbs flex">
            <!--      todo: make to dynamic-->
            <RouterLink title="Navigeren" :to="`/home/files/${rootPath}`">/ Documents</RouterLink>
            <RouterLink title="Navigeren" :to="`/home/files/${rootPath}`">/ {{ $route.params.path }}</RouterLink>
        </menu>
        <button v-if="!$route.params.path || getFileByName($route.params.path.toString()).isFolder"
            class="flex refresh-file-overview-button" title="Bestanden Herladen" type="button" ref="refresh-button">
            <span class="click-item"
                @click="refreshFileOverview(($event.target as HTMLSpanElement).parentElement as HTMLButtonElement)"></span>
            <p class="color-invert">Herladen</p>
            <i ref="file-overview-spinner" class="fa-solid fa-spinner fa-spin color-invert file-overview-spinner"
                :class="{ visible: isRefreshing }"></i>
        </button>
    </div>
    <div v-if="selectedFileFolder()" class="full-width">
        <div v-if="!files || !files.length">
            <p>Loading. A skeleton loading animation is planned here.</p>
            <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
        <div class="file-overview-container flex-col full-width">
            <div class="file-overview-item flex">
                <section class="file-item-left flex">
                    <span class="file-icon"></span>
                    <strong>Naam</strong>
                </section>
                <section class="file-item-right flex">
                    <strong v-for="column in columns" :key="column.field">{{ column.name }}</strong>
                </section>
            </div>
            <div v-for="file in files" :key="file.id"
                :class="`file-overview-item flex ${$route.params.path === file.name ? 'selected' : ''}`">
                <section class="file-item-left flex">
                    <img :ref="`file-icon-${file.id}`" :src="`/File Extensions/${file.type}.png`" alt="type"
                        class="file-icon" title="Bestandstype" @error="handleImageError(file)">
                    <p :title="file.isFolder ? 'Openen' : 'Bekijk Details'" class="file-item-name"
                        @click="handleFileClick(file)">
                        {{ file.name }}</p>
                </section>
                <section class="file-item-right flex">
                    <div v-for="column in columns" :key="column.field">
                        <p v-if="column.field === 'type'">{{ getFileType(file.type) }}</p>
                        <a v-else-if="column.field === 'link'" :href="file.link" target="_blank"
                            title="Open in SharePoint">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <p v-else class="file-item-right-small"> {{ file[column.field as keyof FileOverviewItem] }}</p>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <div v-else class="flex-col selected-wrapper">
        <div v-if="$route.params.path && (!selectedFile || !selectedFile.id)">
            <p>Aan het laden. Een animatie hiervoor is nog WIP.</p>
            <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
        <FileDetailsItem v-else :file-details="selectedFile"></FileDetailsItem>
    </div>
</template>

<style scoped>
.loading-icon {
    font-size: 30px;
}

.file-icon {
    width: 20px;
}

.file-overview-container {
    gap: 10px;
}

.files-header {
    justify-content: space-between;
    width: 100%;
}

.file-overview-item {
    width: 100%;
    gap: 20px;
    border-bottom: 1px solid var(--color-fill);
    height: 40px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px 10px;
}

.refresh-file-overview-button {
    position: relative;
}

.file-overview-spinner {
    display: none;
}

.selected {
    background-color: var(--color-fill);
}

.visible {
    display: block;
}

.file-item-left {
    gap: 20px;
}

.file-item-name:hover {
    text-decoration: underline;
    cursor: pointer;
}

.file-item-right {
    gap: 15px;
}

.file-item-right i {
    color: var(--color-fill-dark);
}

.file-item-right * {
    width: 90px;
}

.file-item-right-small {
    width: 30px;
}
</style>
