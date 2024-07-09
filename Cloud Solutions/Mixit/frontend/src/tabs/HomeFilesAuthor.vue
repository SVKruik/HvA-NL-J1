<script lang="ts">
import { type FileOverviewItem, ObjectTypes, type PopupItem, PromptTypes } from '@/assets/customTypes';
import { createTicket } from '@/utils/ticket';
import { defineComponent } from 'vue';
import FileTableComponent from "@/components/FileTableComponent.vue";
import { useFileStore } from "@/stores/FileStore";
import { fetchFileAuthorOverview } from "@/utils/fetch";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
    name: "HomeFilesAuthor",
    components: { FileTableComponent },
    emits: [
        "popup"
    ],
    data() {
        return {
            files: [] as Array<FileOverviewItem>,
            selectedFile: null as unknown as string,
            isRefreshingTableData: false as boolean,
            rootPath: 'author'
        }
    },
    setup() {
        return {
            fileStore: useFileStore(),
            userStore: useUserStore()
        }
    },
    async created() {
        this.files = this.fileStore.authorFiles;
        if (!this.fileStore.authorFiles.length) await this.fileOverview();
        if (this.$route.params.path) this.selectedFile = this.$route.params.path.toString();
    },
    methods: {
        popup(data: PopupItem) {
            this.$emit("popup", data);
        },
        async fileOverview(): Promise<string> {
            const files = await fetchFileAuthorOverview(this.userStore.user.email);
            if (files && typeof files === "object") {
                this.files = files;
                this.fileStore.setAuthorFiles(files);
            } else this.$emit("popup", {
                "id": createTicket(),
                "type": PromptTypes.danger,
                "message": "Er ging iets mis tijdens het ophalen van het persoonlijke bestandsoverzicht.",
                "expiryMilliseconds": 5000
            } as PopupItem);
            return typeof files;
        },
        async refreshFileOverview(button: HTMLButtonElement): Promise<void> {
            // Disable Button & Load Icon
            if (button.disabled) return;
            button.disabled = true;
            this.fileStore.setAuthorFiles([])
            this.files = [];
            this.isRefreshingTableData = true;

            const returnType = await this.fileOverview();

            // Finish
            button.disabled = false;
            this.isRefreshingTableData = false;
            if (returnType === ObjectTypes.object) {
                this.$emit("popup", {
                    "id": createTicket(),
                    "type": PromptTypes.success,
                    "message": "Bestandsoverzicht succesvol herladen.",
                    "expiryMilliseconds": 4000
                } as PopupItem);
            }
        },
    }
});
</script>

<template>
    <section class="all-files flex-col full-width">
        <FileTableComponent :files="files" :isRefreshing="isRefreshingTableData" :rootPath="rootPath"
            :selectedFileName="selectedFile" @popup="popup" @refresh="refreshFileOverview" />
    </section>
</template>
.all-files {
gap: 30px;
align-items: center;
}
<style scoped></style>
