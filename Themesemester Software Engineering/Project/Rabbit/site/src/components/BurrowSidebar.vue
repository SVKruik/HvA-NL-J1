<script setup lang="ts">
import { FileTypes, type Burrow } from "~/assets/customTypes";
import { useFetchRelatedBurrows } from "~/utils/fetch/burrow/useFetchRelatedBurrows";
import ContactFormComponent from "./contactFormComponent.vue";
import ButtonComponent from "./ButtonComponent.vue";

const props = defineProps<{
    burrow: Burrow;
    isPreview?: boolean;
}>();
const userStore = useUserStore();
const router = useRouter();
const showModal = ref(false);
const burrowName = ref(props.burrow.name);
const emails = props.burrow.keepers
    ? props.burrow.keepers.map((keeper) => keeper.email)
    : [];
const { relatedBurrows, fetchRelatedBurrows } =
    useFetchRelatedBurrows(burrowName);

onMounted(() => fetchRelatedBurrows());
</script>

<template>
    <aside
        class="lg:w-80 bg-fill text-font rounded-xl p-4 h-fit sticky top-[72px]"
        :class="{
            'bg-main borderpointer-events-none select-none border border-fill-light':
                isPreview,
        }"
    >
        <div class="flex items-center justify-between mb-6 py-2">
            <img
                :src="getFilePath(burrow.avatar, FileTypes.burrowAvatar)"
                alt="Burrow avatar"
                class="size-12 rounded-full mr-3"
                @error="
                    (e) => {
                        if (e.target)
                            (e.target as HTMLImageElement).src = fallbackImage(
                                FileTypes.burrowAvatar,
                            );
                    }
                "
            />
            <div
                @click="router.push(`/b/${burrow.name}`)"
                class="cursor-pointer flex-1"
            >
                <h2 class="text-lg font-bold">{{ burrow.name }}</h2>
                <p class="text-sm text-font-light -mt-1">
                    {{ burrow.description }}
                </p>
            </div>
        </div>
        <ul class="text-sm mb-8 flex justify-between">
            <li class="flex-1">
                <b><i class="fi fi-ss-cake-birthday"></i> Created</b><br />
                {{
                    new Date(burrow.dateCreation).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                }}
            </li>
            <li class="flex-1">
                <b><i class="fi fi-ss-users-alt"></i> Members</b><br />
                {{ burrow.memberCount }}
                {{ burrow.memberCount === 1 ? "hopper" : "hoppers" }}
            </li>
        </ul>

        <div v-if="burrow.rules && burrow.rules.length && !isPreview">
            <h3 class="font-bold mb-2">
                <i class="fi fi-ss-book-open-cover"></i> Rules
            </h3>
            <ol
                class="list-decimal list-inside space-y-1 text-sm text-font-light"
            >
                <li v-for="(rule, idx) in burrow.rules" :key="idx">
                    {{ rule }}
                </li>
            </ol>
        </div>

        <div v-if="burrow.keepers && burrow.keepers.length" class="mt-6">
            <h3 class="font-bold mb-2">
                <i class="fi fi-ss-chess-queen"></i> Keepers
            </h3>
            <ul class="space-y-1 text-sm text-font-light">
                <li
                    v-for="(mod, idx) in burrow.keepers"
                    :key="idx"
                    class="flex items-center gap-2"
                >
                    <img
                        :src="getFilePath(mod.avatar, FileTypes.hopperAvatar)"
                        alt="Keeper avatar"
                        class="size-8 rounded-full"
                        @error="
                            (e) => {
                                if (e.target)
                                    (e.target as HTMLImageElement).src =
                                        fallbackImage(FileTypes.hopperAvatar);
                            }
                        "
                    />
                    {{ mod.username }}
                </li>
            </ul>
            <ButtonComponent
                v-if="!isPreview"
                label="Contact a Keeper"
                classname="!rounded-full mt-4 w-full"
                @click="showModal = true"
            />
        </div>
        <div v-if="relatedBurrows && relatedBurrows.length" class="mt-6">
            <h3 class="font-bold mb-2">
                <i class="fi fi-ss-users-alt"></i> Related Burrows
            </h3>
            <ul class="space-y-1 text-sm text-font-light">
                <li
                    v-for="(burrow, idx) in relatedBurrows"
                    :key="idx"
                    class="flex items-center gap-2"
                >
                    <NuxtLink
                        :to="`/b/${burrow.name}`"
                        class="flex items-center gap-2"
                    >
                        <img
                            :src="
                                getFilePath(
                                    burrow.avatar,
                                    FileTypes.burrowAvatar,
                                )
                            "
                            alt="Burrow avatar"
                            class="size-8 rounded-full"
                            @error="
                                (e) => {
                                    if (e.target)
                                        (e.target as HTMLImageElement).src =
                                            fallbackImage(
                                                FileTypes.burrowAvatar,
                                            );
                                }
                            "
                        />
                        {{ burrow.name }}
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </aside>
    <ContactFormComponent
        :open="showModal"
        :emails="emails"
        :email-user="userStore.user.email"
        :hopperId="userStore.user.id"
        :hopperName="userStore.user.username"
        :burrowName="burrow.name"
        @close="showModal = false"
        style="z-index: 1050; position: fixed; left: 0; top: 0"
    />
</template>
