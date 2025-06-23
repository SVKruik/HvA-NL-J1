<script setup lang="ts">
import {
    ButtonComponent as Button,
    TextareaComponent as Textarea,
} from "#components";
import Callout from "~/components/admin/components/Callout.vue";
import { debounce } from "~/utils/debounce";
import SkeletonTable from "~/components/admin/components/SkeletonTable.vue";
import { getPageButtons } from "~/components/admin/utils";
import type {
    PaginatedHoppers,
    ToastItem,
    AdminOverviewHopper,
} from "~/assets/customTypes";
import { ToastTypes, FileTypes } from "~/assets/customTypes";
import { useFetchHoppers } from "~/utils/fetch/admin/useFetchHoppers";
import { useBanHopper } from "~/utils/fetch/admin/useBanHopper";
import { getBurrows } from "~/utils/fetch/admin/getBurrows";

const { $event } = useNuxtApp();

const showMenuPopover = ref(false);
const menuPopoverRef = ref<HTMLElement | null>(null);
const menuPopoverPosition = ref({ top: 0, left: 0 });
const activeMenuIndex = ref<number | null>(null);

const showBanModal = ref(false);
const selectedHopper = ref<AdminOverviewHopper | null>(null);
const banReason: Ref<string> = ref("");

const showBurrowPopover = ref(false);
const burrowPopoverRef = ref<HTMLElement | null>(null);
const burrowPopoverPosition = ref({ top: 0, left: 0 });
const burrowFilterButtonRef = ref<HTMLElement | null>(null);
const selectedFilterBurrow: Ref<string> = ref("");

const MIN_PAGE_VALUE = 1;
const search: Ref<string> = ref("");
const searchError: Ref<boolean> = ref(false);
const validSearchRegex = /^[a-zA-Z0-9/.]*$/;
const loading: Ref<boolean> = ref(true);
const error: Ref<boolean> = ref(false);
const paginatedHoppers: Ref<PaginatedHoppers> = ref({
    data: [],
    pagination: {
        page: 1,
        total_pages: 1,
    },
});

const burrows: Ref<string[]> = ref([]);

async function fetchPaginatedHoppers(
    selectedPage: number,
    searchQuery: string,
    burrowFilter: string,
): Promise<void> {
    loading.value = true;
    try {
        const response = await useFetchHoppers(
            searchQuery,
            selectedPage,
            burrowFilter,
        );
        paginatedHoppers.value = response;
        error.value = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        error.value = true;
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: e.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    } finally {
        loading.value = false;
    }
}

async function fetchBurrows(): Promise<void> {
    try {
        const response = await getBurrows();
        burrows.value = response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: e.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

async function processBanHopper(): Promise<void> {
    if (!selectedHopper.value) return;

    try {
        await useBanHopper(
            selectedHopper.value.id,
            banReason.value,
            selectedHopper.value.email,
        );
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: `Hopper ${selectedHopper.value.username} has been banned successfully.`,
            duration: 3,
        } as ToastItem);
        showBanModal.value = false;
        banReason.value = "";
        selectedHopper.value = null;
        fetchPaginatedHoppers(
            paginatedHoppers.value.pagination.page,
            search.value,
            selectedFilterBurrow.value,
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Failed to ban hopper. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

const fetchPreviousPage = (): void => {
    if (paginatedHoppers.value.pagination.page > MIN_PAGE_VALUE) {
        fetchPaginatedHoppers(
            paginatedHoppers.value.pagination.page - 1,
            search.value,
            selectedFilterBurrow.value,
        );
    }
};

const fetchNextPage = (): void => {
    if (
        paginatedHoppers.value.pagination.page <
        paginatedHoppers.value.pagination.total_pages
    ) {
        fetchPaginatedHoppers(
            paginatedHoppers.value.pagination.page + 1,
            search.value,
            selectedFilterBurrow.value,
        );
    }
};

const debouncedSearch = debounce(async (value: string) => {
    fetchPaginatedHoppers(MIN_PAGE_VALUE, value, selectedFilterBurrow.value);
}, 300);

function onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (validSearchRegex.test(target.value)) {
        searchError.value = false;
        search.value = target.value;
        debouncedSearch(target.value);
    } else {
        searchError.value = true;
    }
}

const toggleMenuPopover = (event: MouseEvent, index: number) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    menuPopoverPosition.value = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 96,
    };

    if (activeMenuIndex.value === index && showMenuPopover.value) {
        showMenuPopover.value = false;
        activeMenuIndex.value = null;
        selectedHopper.value = null;
    } else {
        showMenuPopover.value = true;
        activeMenuIndex.value = index;
        selectedHopper.value =
            paginatedHoppers.value.data[activeMenuIndex.value];
    }
};

const handleClickOutsideMenu = (event: MouseEvent) => {
    if (
        menuPopoverRef.value &&
        !menuPopoverRef.value.contains(event.target as Node)
    ) {
        showMenuPopover.value = false;
        activeMenuIndex.value = null;
    }
};

const openBanHopperModal = () => {
    if (activeMenuIndex.value !== null) {
        banReason.value = "";
        showBanModal.value = true;
    }
    showMenuPopover.value = false;
    activeMenuIndex.value = null;
};

const toggleTagPopover = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    burrowPopoverPosition.value = {
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
    };

    showBurrowPopover.value = !showBurrowPopover.value;
};

const handleClickOutsideBurrowPopover = (event: MouseEvent) => {
    if (
        burrowPopoverRef.value &&
        !burrowPopoverRef.value.contains(event.target as Node) &&
        burrowFilterButtonRef.value &&
        !burrowFilterButtonRef.value.contains(event.target as Node)
    ) {
        showBurrowPopover.value = false;
    }
};

onMounted(() => {
    fetchPaginatedHoppers(
        paginatedHoppers.value.pagination.page,
        search.value,
        selectedFilterBurrow.value,
    );
    fetchBurrows();
    document.addEventListener("mousedown", handleClickOutsideMenu);
    document.addEventListener("mousedown", handleClickOutsideBurrowPopover);
});

onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleClickOutsideMenu);
    document.removeEventListener("mousedown", handleClickOutsideBurrowPopover);
});

// definePageMeta({
//     middleware: ["auth", "admin"],
// });
</script>

<template>
    <div>
        <div class="flex flex-col justify-center items-center w-full">
            <div class="w-full max-w-3xl px-4">
                <div
                    class="w-full flex justify-between items-center flex-col sm:flex-row"
                >
                    <h1
                        class="font-bold text-white flex items-center h-8 lg:h-10"
                    >
                        Hoppers
                    </h1>
                    <div class="flex flex-row gap-2">
                        <input
                            :class="`w-full sm:w-48 h-8 lg:h-10 rounded-lg bg-fill mr-2 px-4 ${searchError && 'border border-red-500'}`"
                            placeholder="Search"
                            :value="search"
                            @input="onInputChange"
                        />
                        <Button
                            ref="burrowFilterButtonRef"
                            size="medium"
                            color="fill"
                            classname="size-8 lg:size-10 mr-2"
                            @click="toggleTagPopover"
                        >
                            <i
                                class="fi fi-sr-bars-filter fill-white size-3.5"
                            />
                        </Button>
                        <Button
                            size="medium"
                            color="fill"
                            :disabled="
                                paginatedHoppers.pagination.page <=
                                MIN_PAGE_VALUE
                            "
                            :classname="`size-8 lg:size-10 ${paginatedHoppers.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                            @click="fetchPreviousPage"
                            ><i class="fi fi-sr-angle-left fill-white size-3.5"
                        /></Button>
                        <Button
                            size="medium"
                            color="fill"
                            :disabled="
                                paginatedHoppers.pagination.page >=
                                paginatedHoppers.pagination.total_pages
                            "
                            :classname="`size-8 lg:size-10 ${
                                paginatedHoppers.pagination.page >=
                                    paginatedHoppers.pagination.total_pages &&
                                'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'
                            }`"
                            @click="fetchNextPage"
                            ><i
                                class="fi fi-sr-angle-right fill-white size-3.5"
                        /></Button>
                    </div>
                </div>

                <div class="w-3xl overflow-x-auto">
                    <Callout
                        v-if="error"
                        title="An error occurred"
                        description="Unable to load hoppers. Please try again later."
                        variant="error"
                    />
                    <Callout
                        v-if="
                            !error &&
                            !loading &&
                            paginatedHoppers.data.length === 0
                        "
                        title="No data found"
                        description="No hoppers matched your search or there are currently
                        no hoppers available."
                        variant="warning"
                    />

                    <table v-else class="w-full mt-4 border-collapse">
                        <thead>
                            <tr>
                                <th class="min-w-1"></th>
                                <th class="w-10"></th>
                                <th class="min-w-16 max-w-32">
                                    <p class="text-left ml-2 truncate">User</p>
                                </th>
                                <th class="w-full">
                                    <p class="text-left w-full ml-2">Email</p>
                                </th>
                                <th class="w-12"></th>
                            </tr>
                        </thead>

                        <SkeletonTable v-if="loading" />

                        <tbody v-else-if="paginatedHoppers.data.length > 0">
                            <tr
                                v-for="(hopper, index) in paginatedHoppers.data"
                                :key="index"
                                class="odd:bg-fill h-12"
                            >
                                <th class="min-w-1 flex-shrink-0 h-full">
                                    <div
                                        v-if="hopper.is_banned"
                                        class="w-1 h-12 bg-yellow-500 p-0"
                                    />
                                </th>
                                <td class="min-w-10">
                                    <img
                                        :src="
                                            getFilePath(
                                                hopper?.avatar,
                                                FileTypes.hopperAvatar,
                                            )
                                        "
                                        class="size-8 ml-2 rounded-full w-8 flex-shrink-0"
                                        @error="
                                            (e: Event) => {
                                                if (e.target)
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src = fallbackImage(
                                                        FileTypes.hopperAvatar,
                                                    );
                                            }
                                        "
                                    />
                                </td>
                                <td class="min-w-16 w-32">
                                    <div class="text-left ml-2">
                                        <p class="text-sm leading-4 truncate">
                                            {{ hopper.username }}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div class="w-full ml-2">
                                        <p class="text-sm leading-4 truncate">
                                            {{ hopper.email }}
                                        </p>
                                    </div>
                                </td>
                                <td class="w-12">
                                    <div
                                        class="flex justify-center items-center"
                                    >
                                        <Button
                                            size="medium"
                                            variant="ghost"
                                            color="fill"
                                            classname="size-8"
                                            @click="
                                                (event: MouseEvent) =>
                                                    toggleMenuPopover(
                                                        event,
                                                        index,
                                                    )
                                            "
                                        >
                                            <i
                                                class="fi fi-sr-menu-dots size-3.5 fill-white"
                                            />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    v-if="paginatedHoppers.data.length > 0 && !loading"
                    class="flex flex-col lg:flex-row gap-4 mt-4 mb-8 items-center lg:justify-between"
                >
                    <div class="flex flex-row gap-2">
                        <Button
                            size="medium"
                            color="fill"
                            :disabled="
                                paginatedHoppers.pagination.page <=
                                MIN_PAGE_VALUE
                            "
                            :classname="`size-8 lg:size-10 ${paginatedHoppers.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                            @click="fetchPreviousPage"
                            ><i class="fi fi-sr-angle-left fill-white size-3.5"
                        /></Button>
                        <Button
                            v-for="page in getPageButtons(
                                paginatedHoppers.pagination.total_pages,
                                paginatedHoppers.pagination.page,
                            )"
                            :key="page"
                            size="medium"
                            color="fill"
                            :label="String(page)"
                            :classname="`size-8 lg:size-10 ${page === paginatedHoppers.pagination.page && 'bg-link text-white hover:bg-link-hover'}`"
                            @click="
                                fetchPaginatedHoppers(
                                    page,
                                    search,
                                    selectedFilterBurrow,
                                )
                            "
                        />
                        <Button
                            size="medium"
                            color="fill"
                            :disabled="
                                paginatedHoppers.pagination.page >=
                                paginatedHoppers.pagination.total_pages
                            "
                            :classname="`size-8 lg:size-10 ${
                                paginatedHoppers.pagination.page >=
                                    paginatedHoppers.pagination.total_pages &&
                                'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'
                            }`"
                            @click="fetchNextPage"
                            ><i
                                class="fi fi-sr-angle-right fill-white size-3.5"
                        /></Button>
                    </div>
                    <div class="flex flex-row gap-2 items-center">
                        <input
                            class="bg-fill rounded-lg w-16 h-8 lg:h-10 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            type="number"
                            :value="paginatedHoppers.pagination.page"
                            :min="MIN_PAGE_VALUE"
                            :max="
                                paginatedHoppers.pagination.total_pages > 0
                                    ? paginatedHoppers.pagination.total_pages
                                    : MIN_PAGE_VALUE
                            "
                            @input="
                                (event: Event) => {
                                    let value = Number(
                                        (event.target as HTMLInputElement)
                                            .value,
                                    );
                                    if (value < MIN_PAGE_VALUE)
                                        value = MIN_PAGE_VALUE;
                                    if (
                                        value >
                                            paginatedHoppers.pagination
                                                .total_pages &&
                                        paginatedHoppers.pagination
                                            .total_pages > 0
                                    )
                                        value =
                                            paginatedHoppers.pagination
                                                .total_pages;
                                    if (
                                        paginatedHoppers.pagination
                                            .total_pages === 0
                                    )
                                        value = MIN_PAGE_VALUE;
                                    (event.target as HTMLInputElement).value =
                                        String(value);
                                    fetchPaginatedHoppers(
                                        value,
                                        search,
                                        selectedFilterBurrow,
                                    );
                                }
                            "
                        />
                        <p class="text-sm">
                            of
                            {{
                                paginatedHoppers.pagination.total_pages > 0
                                    ? paginatedHoppers.pagination.total_pages
                                    : 1
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showMenuPopover"
            ref="menuPopoverRef"
            class="absolute z-30"
            :style="{
                top: `${menuPopoverPosition.top}px`,
                left: `${menuPopoverPosition.left}px`,
            }"
        >
            <div
                class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-fill-light ml-auto mr-2"
            ></div>
            <div class="bg-fill-light rounded-lg shadow-md w-32 py-1">
                <Button
                    size="medium"
                    color="fill"
                    classname="w-full !h-10 !justify-start bg-inherit hover:bg-fill px-3"
                    label="View"
                    fill
                    @click="navigateTo(`/h/${selectedHopper?.username}`)"
                    ><i class="fi fi-sr-eye fill-white size-3.5 mr-2"
                /></Button>
                <Button
                    v-if="selectedHopper && !selectedHopper.is_banned"
                    size="medium"
                    color="fill"
                    classname="w-full !h-10 !justify-start bg-inherit hover:bg-fill text-red-400 hover:text-red-300 px-3 group"
                    label="Ban"
                    fill
                    @click="openBanHopperModal"
                    ><i
                        class="fi fi-sr-gavel fill-red-400 group-hover:fill-red-300 size-3.5 mr-2"
                /></Button>
            </div>
        </div>

        <div
            v-if="showBanModal && selectedHopper"
            class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75"
            @click.self="showBanModal = false"
        >
            <div
                class="bg-fill p-4 rounded-lg shadow-xl w-full max-w-md flex flex-col m-4 min-h-[280px]"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="`ban-modal-title-${selectedHopper.id}`"
            >
                <div class="flex justify-between items-start mb-2">
                    <h2
                        :id="`ban-modal-title-${selectedHopper.id}`"
                        class="text-sm font-bold text-white truncate pr-2"
                    >
                        Confirm Ban: {{ selectedHopper.username }}
                    </h2>
                    <Button
                        variant="ghost"
                        color="fill"
                        size="medium"
                        classname="size-6 p-0"
                        aria-label="Close ban modal"
                        @click="showBanModal = false"
                    >
                        <i
                            class="fi fi-sr-cross-small size-5 text-gray-400 hover:text-white"
                        ></i>
                    </Button>
                </div>

                <p class="text-xs text-gray-400 mb-4">
                    Are you sure you want to ban hopper "{{
                        selectedHopper.username
                    }}" ({{ selectedHopper.email }})?
                </p>

                <Textarea
                    v-model="banReason"
                    color="Ebony Clay"
                    fill
                    label="Reason for the ban (optional)"
                    :max-length="1000"
                    :required="false"
                    size="large"
                    small-text
                    type="text"
                    classname="mb-4 flex-grow"
                />

                <div class="flex justify-end gap-2 mt-auto pt-2">
                    <Button
                        size="medium"
                        variant="outline"
                        color="fill"
                        label="Cancel"
                        classname="h-8 px-3"
                        @click="showBanModal = false"
                    />
                    <Button
                        size="medium"
                        color="fill"
                        label="Confirm Ban"
                        classname="h-8 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
                        @click="processBanHopper"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="showBurrowPopover"
            ref="burrowPopoverRef"
            class="absolute z-30"
            :style="{
                top: `${burrowPopoverPosition.top}px`,
                left: `${burrowPopoverPosition.left}px`,
                transform: 'translateX(-50%)',
            }"
        >
            <div
                class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-fill-light mx-auto"
            ></div>
            <div
                class="bg-fill-light rounded-lg shadow-md p-4 w-48 max-h-64 overflow-y-auto"
            >
                <p class="text-white text-sm mb-2">Burrow filter</p>
                <Button
                    size="medium"
                    color="fill"
                    :classname="`w-full !justify-start whitespace-nowrap truncate mb-1 ${'' === selectedFilterBurrow ? 'bg-orange-950 hover:bg-orange-950 active:bg-orange-950 border border-orange-500' : 'hover:bg-fill'}`"
                    label="All Burrows"
                    fill
                    @click="
                        selectedFilterBurrow = '';
                        fetchPaginatedHoppers(1, search, selectedFilterBurrow);
                        showBurrowPopover = false;
                    "
                />
                <div class="flex flex-col gap-1">
                    <Button
                        v-for="(tag, i) in burrows"
                        :key="i"
                        size="medium"
                        color="fill"
                        :classname="`w-full !justify-start whitespace-nowrap truncate ${tag.name === selectedFilterBurrow ? 'bg-orange-950 hover:bg-orange-950 active:bg-orange-950 border border-orange-500' : 'hover:bg-fill'}`"
                        :label="tag.name"
                        fill
                        @click="
                            selectedFilterBurrow = tag.name;
                            fetchPaginatedHoppers(
                                1,
                                search,
                                selectedFilterBurrow,
                            );
                            showBurrowPopover = false;
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>
