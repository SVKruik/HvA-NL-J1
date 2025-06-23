<script setup lang="ts">
import { ButtonComponent as Button } from "#components";
import { FileTypes, type Buddy } from "~/assets/customTypes";
import { fallbackImage, getFilePath } from "~/utils/file";
import { navigateTo } from "#app";

const userStore = useUserStore();

const props = defineProps<{
    buddy: Buddy;
    isCurrentUser: boolean;
    isBuddyLoading: boolean;
    handleBuddyRequest: (mode: boolean, id: number) => void;
}>();


</script>

<template>
<div v-if="buddy.isAccepted || (isCurrentUser && buddy.isPending)"
    class="bg-main border border-fill hover:bg-main-hover hover:border-main-hover flex-1 rounded-lg p-4 flex gap-4 items-center justify-between">
    <div class="flex items-center gap-4">
        <img :src="getFilePath(buddy.avatar, FileTypes.hopperAvatar)" class="size-12 rounded-full" @error="(e) => {
            if (e.target) {
                (e.target as HTMLImageElement).src = fallbackImage(FileTypes.hopperAvatar);
            }
        }" />

        <div class="flex flex-col">
            <h3 class="text-sm font-semibold flex items-center gap-1">
                {{ buddy.username }} {{ buddy.username === userStore.user?.username ? '(You)' : '' }}
                <i v-if="buddy.is_favorite" class="fi fi-sr-star text-yellow-400" title="Favorite Buddy"></i>
            </h3>
            <Button label="View Profile"
                class="px-3 py-1 mt-1 rounded-full text-xs border h-6 border-brand text-font flex items-center gap-2 !bg-brand-hover"
                rounded @click="navigateTo(`/h/${buddy.username}`)" />
        </div>
    </div>

    <div class="flex items-center gap-2">
        <!-- Pending incoming request -->
        <template v-if="isCurrentUser && buddy.isPending && buddy.isIncoming">
            <Button label="Accept"
                class="px-3 py-1 rounded-full text-xs border h-6 border-brand text-font flex items-center gap-2 bg-brand"
                :disabled="isBuddyLoading" rounded @click="handleBuddyRequest(true, buddy.id)" />

            <Button label="Decline" class="px-3 py-1 rounded-full text-xs border h-6 text-font flex items-center gap-2"
                variant="outline" :disabled="isBuddyLoading" rounded @click="handleBuddyRequest(false, buddy.id)" />
        </template>

        <!-- Pending outgoing request -->
        <template v-else-if="isCurrentUser && buddy.isPending && buddy.isOutgoing">
            <Button label="Cancel Request"
                class="px-3 py-1 rounded-full text-xs border h-6 text-font flex items-center gap-2" variant="outline"
                :disabled="isBuddyLoading" rounded @click="handleBuddyRequest(false, buddy.id)" />
        </template>

        <!-- Accepted buddy -->
        <template v-else-if="isCurrentUser && buddy.isAccepted">
            <Button label="Remove Buddy"
                class="px-3 py-1 rounded-full text-xs border h-6 text-font flex items-center gap-2" variant="outline"
                :disabled="isBuddyLoading" rounded @click="handleBuddyRequest(false, buddy.id)" />
        </template>
    </div>
</div>
</template>
