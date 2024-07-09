import type { FileOverviewItem, RecentFileItem } from "@/assets/customTypes";
import { defineStore } from "pinia";
import { useSessionStorage } from "@vueuse/core";

export const useFileStore = defineStore("FileStore", {
    state: () => {
        return {
            recentFiles: useSessionStorage("recentFiles", [] as Array<RecentFileItem>),
            overviewFiles: useSessionStorage("overviewFiles", [] as Array<FileOverviewItem>),
            authorFiles: useSessionStorage("authorFiles", [] as Array<FileOverviewItem>)
        }
    },
    actions: {
        setRecentFiles(recentFileItems: Array<RecentFileItem>): void {
            this.recentFiles = recentFileItems;
        },
        setOverviewFiles(fileOverviewItems: Array<FileOverviewItem>): void {
            this.overviewFiles = fileOverviewItems;
        },
        setAuthorFiles(fileOverviewItems: Array<FileOverviewItem>): void {
            this.authorFiles = fileOverviewItems;
        },
        signOut(): void {
            this.recentFiles = [];
            this.overviewFiles = [];
        }
    }
});
