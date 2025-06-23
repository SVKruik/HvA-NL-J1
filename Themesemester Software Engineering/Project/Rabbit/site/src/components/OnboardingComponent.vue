<script setup lang="ts">
import { ButtonComponent as Button } from "#components";
import { FileTypes, ToastTypes, type ToastItem } from "~/assets/customTypes";
import { useFetchBurrowsByTags } from "~/utils/fetch/burrow/useFetchBurrowsByTags";
import { useFetchTag } from "~/utils/fetch/tag/useFetchTag";
import { AvatarComponent as Avatar } from "#components";
import { useFetchOnboardingFinish } from "~/utils/fetch/user/useFetchOnboardingFinish";

const emit = defineEmits(["close"]);
const userStore = useUserStore();
const { $event } = useNuxtApp();

if (!userStore.user.init) emit("close");

// Reactive Data
const stage: Ref<number> = ref(0);
const nsfw: Ref<boolean> = ref(true);
const selectedCategories: Ref<Array<string>> = ref([]);
const unfilteredTags: Ref<Array<{ "name": string, "category": string }>> = ref([]);
const selectedTags: Ref<Array<{ "name": string, "category": string }>> = ref([]);
const selectedBurrows: Ref<Array<number>> = ref([]);
const availableCategories: Ref<Array<string>> = ref([]);
const availableTags: Ref<Array<{ "name": string, "category": string }>> = ref([]);
const availableBurrows: Ref<Array<{ "id": number, "name": string, "avatar": string }>> = ref([]);

onMounted(async () => {
    const data = await useFetchTag();

    // Setup available tags and categories
    availableCategories.value = [...new Set(data.map((item: { category: string }) => item.category))];
    unfilteredTags.value = data;
});

// Methods

/**
 * Handles the click event for a category.
 */
function handleCategoryClick(category: string): void {
    if (selectedCategories.value.includes(category)) {
        selectedCategories.value.splice(selectedCategories.value.indexOf(category), 1);
    } else selectedCategories.value.push(category);
}

/**
 * Handles the click event for a tag.
 */
function handleTagClick(tag: { name: string, category: string }): void {
    if (selectedTags.value.includes(tag)) {
        selectedTags.value.splice(selectedTags.value.indexOf(tag), 1);
    } else selectedTags.value.push(tag);
}

/**
 * Handles the click event for a Burrow.
 */
function handleBurrowClick(burrow: { id: number, name: string }): void {
    if (selectedBurrows.value.includes(burrow.id)) {
        selectedBurrows.value.splice(selectedBurrows.value.indexOf(burrow.id), 1);
    } else selectedBurrows.value.push(burrow.id);
}

/**
 * Handles general progress through the onboarding steps.
 */
async function handleProgress(): Promise<void> {
    try {
        if (stage.value === 2) {
            // Set available tags based on selected categories
            availableTags.value = [];
            for (const category of selectedCategories.value) {
                const tags = unfilteredTags.value.filter((item: { category: string }) => item.category === category);
                availableTags.value.push(...tags);
            }

            // Scramble tags to randomize the order
            availableTags.value = availableTags.value.sort(() => Math.random() - 0.5);
        } else if (stage.value === 3) {
            // Get available burrows based on selected tags
            availableBurrows.value = await useFetchBurrowsByTags(selectedTags.value);
        } else if (stage.value === 4) {
            await useFetchOnboardingFinish(userStore.user.id, nsfw.value, selectedBurrows.value);
        }
        stage.value++;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Unlocks the next stage of the onboarding process.
 */
function getRequirements(): boolean {
    if (stage.value === 2) return selectedCategories.value.length > 0;
    if (stage.value === 3) return selectedTags.value.length > 0;
    return true;
}
</script>

<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full fixed top-0 left-0 bg-black bg-opacity-80 backdrop-blur-sm z-30">
        <form @submit.prevent class="flex flex-col items-center gap-8">
            <div class="flex flex-col items-center justify-center text-center gap-2 max-w-[550px] min-h-[400px]">
                <template v-if="stage === 0">
                    <h1 class="text-2xl font-bold mb-4">Welcome to Rabbit,
                        <ClientOnly>{{ userStore.user.username }}</ClientOnly>!
                    </h1>
                    <p>We are glad to have you here.</p>
                    <p>Let's get you started with a few quick steps to setup your
                        feed. This will only take a minute!</p>
                </template>
                <template v-else-if="stage === 1">
                    <h1 class="text-2xl font-bold mb-4">Before we start . . .</h1>
                    <p>Are NSFW / 18+ Burrows allowed?</p>
                    <p>Rabbit does not aim to be all about 18+ content, but Hoppers are still able to post sensitive or
                        graphic content in Burrows that allow it</p>
                </template>
                <template v-else-if="stage === 2">
                    <h1 class="text-2xl font-bold mb-4">Step 1: Choose your general interests</h1>
                    <p>Select the topics you are interested in.</p>
                    <p>This will help us personalize your feed.</p>
                    <div class="flex flex-wrap gap-2 max-w-[500px] justify-center mt-8">
                        <div class="bg-brand rounded-full w-max box-border px-2 cursor-pointer"
                            :class="{ 'bg-brand-alt': selectedCategories.includes(category) }"
                            v-for="category in availableCategories" :key="category"
                            @click="handleCategoryClick(category)">
                            {{ category }}
                        </div>
                    </div>
                </template>
                <template v-else-if="stage === 3">
                    <h1 class="text-2xl font-bold mb-4">Step 2: Choose your topics</h1>
                    <p>Let's fine tune your feed further.</p>
                    <p>Select the topics you are interested in.</p>
                    <div class="flex flex-wrap gap-2 max-w-[500px] justify-center mt-8">
                        <div class="bg-brand rounded-full w-max box-border px-2 cursor-pointer"
                            :class="{ 'bg-brand-alt': selectedTags.includes(tag) }" v-for="tag in availableTags"
                            :key="tag.name" @click="handleTagClick(tag)">
                            {{ tag.name }}
                        </div>
                    </div>
                </template>
                <template v-else-if="stage === 4">
                    <h1 class="text-2xl font-bold mb-4">Step 3: Choose some Burrows</h1>
                    <template v-if="availableBurrows.length">
                        <p>Based on your selection, we have come up with these Burrows.</p>
                        <p>Burrows are communities specializing in specific niches.</p>
                        <p>This is optional, you can always search and join
                            Burrows later.</p>
                        <div class="flex flex-wrap gap-2 max-w-[500px] justify-center mt-8">
                            <div class="flex items-center gap-4 pr-4 bg-brand rounded-full w-max box-border cursor-pointer"
                                :class="{ 'bg-brand-alt': selectedBurrows.includes(burrow.id) }"
                                v-for="burrow in availableBurrows" :key="burrow.id" @click="handleBurrowClick(burrow)">
                                <Avatar :src="getFilePath(burrow.avatar, FileTypes.burrowAvatar)"></Avatar>
                                b/{{ burrow.name }}
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <p>Your selection was too unique!</p>
                        <p>We couldn't find any Burrows that match your interests.</p>
                        <p>Don't worry, you can always search and join Burrows later.</p>
                        <p>And maybe, create your own Burrow about your topics!</p>
                    </template>
                </template>
                <template v-else>
                    <h1 class="text-2xl font-bold mb-4">All set!</h1>
                    <p>You are all set to start using Rabbit.</p>
                    <p>You can always change your preferences later.</p>
                    <p class="mt-4 text-sm">Apart from the Burrow and NSFW selection, your
                        answers are not shared nor saved. This was only needed for initial Burrow selection!</p>
                </template>
            </div>
            <div v-if="stage === 1" class="flex items-center justify-center gap-2">
                <Button type="button" @click="nsfw = false; handleProgress()" title="Hide any content marked as NSFW."
                    classname="w-32 h-8">No, hide
                </Button>
                <Button type="button" @click="handleProgress()" title="Allow NSFW marked content."
                    classname="w-32 h-8">Yes,
                    allow</Button>
            </div>
            <Button v-else-if="stage === 5" type="button" title="Confirm" @click="userStore.user.init = false"
                classname="w-32 h-8 bg-brand-alt hover:bg-brand-alt-hover">Hop in!</Button>
            <div v-else class="flex items-center justify-center gap-2">
                <Button v-if="stage !== 0" type="button" variant="outline" title="Go back one step" @click="stage--"
                    classname="w-32 h-8">Back</Button>
                <Button type="submit" @click="handleProgress()" v-if="getRequirements()" title="Next step"
                    classname="w-32 h-8">Next</Button>
            </div>
        </form>
    </div>
</template>