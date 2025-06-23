<script setup lang="ts">
import type { Hopper } from "~/assets/customTypes";
import { FileTypes } from "~/assets/customTypes";

const props = defineProps<{
    hopper: Hopper;
}>();

// Methods

function achievementData(title: string): any {
    return getAchievementData(title);
}

const router = useRouter();
</script>

<template>
<aside class="lg:w-80 bg-fill text-font rounded-xl p-4 h-fit sticky top-[72px] flex flex-col gap-10">
    <div class="flex items-center justify-between py-2">
        <img :src="getFilePath(hopper.avatar, FileTypes.hopperAvatar)" alt="Hopper avatar"
            class="size-12 rounded-full mr-3"
            @error="(e) => { if (e.target) (e.target as HTMLImageElement).src = fallbackImage(FileTypes.hopperAvatar); }" />
        <div @click="router.push(`/h/${hopper.username}`)" class="cursor-pointer flex-1">
            <h2 class="text-lg font-bold">{{ hopper.username }}</h2>
        </div>
    </div>
    <p v-if="hopper.description" class="text-sm text-font-light -mt-4">{{ hopper.description }}</p>
    <ul class="text-sm grid grid-cols-2 gap-5">
        <li>
            <i class="fi fi-ss-cake-birthday"></i> <b>Joined</b><br />
            {{
                new Date(hopper.date_creation).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            }}
        </li>
        <li>
            <b> Carrots</b><br />
            {{ formatNumber(hopper.carrots) }} <i class="fi fi-ss-carrot"></i>
        </li>
        <li>
            <b>Reputation</b><br />
            <i class="fi fi-ss-star"></i> {{ formatNumber(hopper.reputation) }}
        </li>
        <li>
            <b>Buddies</b><br />
            <i class="fi fi-sr-users"></i> {{ formatNumber(hopper.buddies) }}
        </li>
    </ul>

    <div>
        <h3 class="font-bold mb-2"><i class="fi fi-ss-trophy"></i> Achievements</h3>
        <ul v-if="hopper.achievements && Object.keys(hopper.achievements).length"
            class="space-y-1 text-sm text-font-light">
            <li v-for="(date, key) in hopper.achievements" :key="key"
                class="flex flex-col border border-border p-2 rounded-lg">
                <b>{{ key }}</b>
                <p>{{ achievementData(key).description }}</p>
                <span class="text-xs text-font-light italic mt-2" v-if="date">
                    Achieved on {{ new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) }}
                </span>
            </li>
        </ul>
        <p v-else class="text-sm text-font-light italic">No achievements yet.</p>
    </div>
</aside>
</template>
