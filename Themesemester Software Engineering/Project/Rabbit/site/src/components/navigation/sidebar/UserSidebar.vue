<script lang="ts" setup>
import { ButtonComponent as Button } from "#components";
import { FileTypes, type BurrowSideBar } from "~/assets/customTypes";
import NewBurrow from "~/components/newBurrow.vue";
import { useFetchBurrowsUser } from "~/utils/fetch/user/useFetchBurrowsUser";
import { useFetchPopularBurrows } from "~/utils/fetch/user/useFetchPopularBurrows";
const showModal = ref(false);

const userStore = useUserStore();
const useBurrowStore = useburrowSideBar();
const userLoggedIn = userStore.isLoggedIn;
const { $event } = useNuxtApp();
const burrows = ref<BurrowSideBar[]>([]);
const recentBurrows = ref<BurrowSideBar[]>([]);
const showAll = ref(false);
const showPopular = ref(false);

const alwaysVisible = 5;
const expandedBurrows = computed(() => {
    if (showAll.value) return burrows.value;
    return burrows.value.slice(0, alwaysVisible);
});
const canExpand = computed(() => burrows.value.length > alwaysVisible);
// emits a toast
function toast(
    message: string,
    type: "success" | "info" | "warning" | "danger" = "info",
    duration = 5,
) {
    $event("emit-toast", {
        id: createTicket(),
        message,
        type,
        duration,
    });
}
// Watches for changes in the recent burrow fisited.
watch(
    () => useBurrowStore.recentBurrows,
    (newValue) => {
        recentBurrows.value = newValue;
    },
);

// Loads a Hoppers Joined burrow or popular if none joined
onMounted(async () => {
    try {
        recentBurrows.value = useBurrowStore.recentBurrows;
        let result: BurrowSideBar[] = [];
        const emptyArray = 0;
        if (userStore.user.id) {
            const userBurrows = await useFetchBurrowsUser(userStore.user.id);
            if (Array.isArray(userBurrows) && userBurrows.length > 0) {
                result = userBurrows;
            }
        }
        if (result.length === emptyArray) {
            result = await useFetchPopularBurrows();
            showPopular.value = !showPopular.value;
        }
        burrows.value = result;
    } catch (err) {
        const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (err as { message?: string })?.message ||
            "Failed to fetch burrows. Please try again or contact admin.";

        toast(errorMessage, "danger");
    }
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <Button
                label="Home"
                classname="bg-main hover:!bg-black active:!bg-black !justify-start"
                @click="navigateTo('/?sort=new')"
            >
                <i class="fi fi-ss-house-chimney size-3.5" />
            </Button>
            <Button
                label="Trending"
                classname="bg-main hover:!bg-black active:!bg-black !justify-start"
                @click="navigateTo('/?sort=trending')"
                ><i class="fi fi-sr-arrow-trend-up size-3.5"
            /></Button>
        </div>

        <div class="flex flex-col gap-1">
            <p
                v-if="recentBurrows.length > 0"
                class="text-sm font-bold text-white"
            >
                Recent
            </p>
            <Button
                v-for="(burrow, index) in recentBurrows"
                :key="index"
                color="fill"
                classname="!justify-start !pl-2 gap-3 !p-6 -ml-1"
                :label="'b/' + burrow.name"
                @click="navigateTo(`/b/${burrow.name}`)"
            >
                <img
                    :src="getFilePath(burrow.avatar, FileTypes.burrowAvatar)"
                    alt="Burrow Avatar"
                    class="object-cover size-8 rounded-lg"
                    @error="
                        (e) => {
                            if (e.target) {
                                (e.target as HTMLImageElement).src =
                                    fallbackImage(FileTypes.burrowAvatar);
                            }
                        }
                    "
                />
            </Button>
        </div>

        <div class="flex flex-col gap-1">
            <p class="text-sm font-bold text-white">
                {{ showPopular ? "Popular" : "Burrows" }}
            </p>
            <transition-group
                name="burrow-fade"
                tag="div"
                class="overflow-hidden transition-all duration-500"
                :style="{
                    maxHeight: showAll
                        ? `${Math.max(burrows.length, alwaysVisible) * 56}px`
                        : `${alwaysVisible * 56}px`,
                }"
            >
                <Button
                    v-for="burrow in expandedBurrows"
                    :key="burrow.name"
                    color="fill"
                    classname="!justify-start !pl-2 gap-3 !rounded-xl !p-6 w-full"
                    :label="'b/' + burrow.name"
                    @click="navigateTo(`/b/${burrow.name}`)"
                >
                    <img
                        :src="
                            getFilePath(burrow.avatar, FileTypes.burrowAvatar)
                        "
                        alt="Burrow Avatar"
                        class="object-cover size-8 rounded-lg"
                        @error="
                            (e) => {
                                if (e.target) {
                                    (e.target as HTMLImageElement).src =
                                        fallbackImage(FileTypes.burrowAvatar);
                                }
                            }
                        "
                    />
                </Button>
            </transition-group>
            <Button
                v-if="canExpand"
                :label="showAll ? 'Collapse' : 'Expand'"
                classname="!rounded-full mt-2"
                @click="showAll = !showAll"
            />
            <Button
                v-if="userLoggedIn"
                label="Create new burrow"
                classname="!rounded-full mt-2"
                @click="showModal = true"
            >
                <i class="fi fi-sr-plus size-3.5 before:!leading-[0.875rem]" />
            </Button>
        </div>
    </div>
    <NewBurrow :open="showModal" @close="showModal = false" />
</template>
