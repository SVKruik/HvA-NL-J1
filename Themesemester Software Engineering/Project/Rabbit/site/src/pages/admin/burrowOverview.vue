<script setup lang="ts">
import {
    ButtonComponent as Button,
    TextareaComponent as Textarea,
    DeleteBurrowModal,
} from "#components";
import TagList from "~/components/admin/components/TagList.vue";
import SkeletonTable from "~/components/admin/components/SkeletonTable.vue";
import Callout from "~/components/admin/components/Callout.vue";
import { getPageButtons } from "~/components/admin/utils";
import { debounce } from "~/utils/debounce";
import type { PaginatedAllBurrows, ToastItem } from "~/assets/customTypes";
import { ToastTypes, FileTypes } from "~/assets/customTypes";
import { useFetchAllBurrows } from "~/utils/fetch/admin/useFetchAllBurrows";
import { useFetchBurrowTags } from "~/utils/fetch/admin/getBurrowTags";
import { useBanBurrow } from "~/utils/fetch/admin/useBanBurrow";

const { $event } = useNuxtApp();

const MIN_PAGE_VALUE = 1;
const search: Ref<string> = ref("");
const searchError: Ref<boolean> = ref(false);
const banReason: Ref<string> = ref("");

const showMenuPopover = ref(false);
const menuPopoverRef = ref<HTMLElement | null>(null);
const menuPopoverPosition = ref({ top: 0, left: 0 });
const activeMenuIndex = ref<number | null>(null);

const showTagPopover = ref(false);
const tagPopoverRef = ref<HTMLElement | null>(null);
const tagPopoverPosition = ref({ top: 0, left: 0 });
const tagFilterButtonRef = ref<HTMLElement | null>(null);

const validSearchRegex = /^[a-zA-Z0-9/.]*$/;
const selectedFilterTag: Ref<string> = ref("");
const loading: Ref<boolean> = ref(true);
const error: Ref<boolean> = ref(false);
const paginatedBurrows: Ref<PaginatedAllBurrows> = ref({
    data: [],
    pagination: {
        page: 1,
        total_pages: 1,
    },
});

const burrowTags = ref<Array<string>>([]);

const showBanModal = ref(false);
const showDeleteModal = ref(false);
const selectedBurrow = ref<string | null>(null);
const banned: Ref<boolean> = ref(false);
const deleted: Ref<boolean> = ref(false);

async function fetchPaginatedBurrows(
    selectedPage: number,
    searchQuery: string,
    tag: string,
): Promise<void> {
    loading.value = true;
    try {
        const response = await useFetchAllBurrows(
            searchQuery,
            selectedPage,
            tag,
        );
        paginatedBurrows.value = response;
        error.value = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        error.value = true;
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    } finally {
        loading.value = false;
    }
}

async function fetchBurrowTags(): Promise<void> {
    try {
        const result = await useFetchBurrowTags();
        burrowTags.value = Array.isArray(result) ? result : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

async function processBanBurrow(): Promise<void> {
    try {
        await useBanBurrow(selectedBurrow.value!, banReason.value);
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: `Burrow ${selectedBurrow.value} has been banned successfully.`,
            duration: 3,
        } as ToastItem);
        showBanModal.value = false;
        banReason.value = "";
        selectedBurrow.value = null;
        fetchPaginatedBurrows(
            paginatedBurrows.value.pagination.page,
            search.value,
            selectedFilterTag.value,
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
    if (paginatedBurrows.value.pagination.page > MIN_PAGE_VALUE) {
        fetchPaginatedBurrows(
            paginatedBurrows.value.pagination.page - 1,
            search.value,
            selectedFilterTag.value,
        );
    }
};

const fetchNextPage = (): void => {
    if (
        paginatedBurrows.value.pagination.page <
        paginatedBurrows.value.pagination.total_pages
    ) {
        fetchPaginatedBurrows(
            paginatedBurrows.value.pagination.page + 1,
            search.value,
            selectedFilterTag.value,
        );
    }
};

const debouncedSearch = debounce(async (value: string) => {
    fetchPaginatedBurrows(
        paginatedBurrows.value.pagination.page,
        value,
        selectedFilterTag.value,
    );
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

const toggleMenuPopover = (
    event: MouseEvent,
    index: number,
    burrowName: string,
    isBanned: boolean,
    date_deleted: Date | null,
) => {
    selectedBurrow.value = burrowName;
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    menuPopoverPosition.value = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 96,
    };

    if (activeMenuIndex.value === index && showMenuPopover.value) {
        showMenuPopover.value = false;
        banned.value = false;
        deleted.value = false;
        activeMenuIndex.value = null;
    } else {
        showMenuPopover.value = true;
        activeMenuIndex.value = index;
        banned.value = isBanned;
        deleted.value = date_deleted !== null;
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

const toggleTagPopover = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    tagPopoverPosition.value = {
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
    };

    showTagPopover.value = !showTagPopover.value;
};

const handleClickOutsideTagPopover = (event: MouseEvent) => {
    if (
        tagPopoverRef.value &&
        !tagPopoverRef.value.contains(event.target as Node) &&
        tagFilterButtonRef.value &&
        !tagFilterButtonRef.value.contains(event.target as Node)
    ) {
        showTagPopover.value = false;
    }
};

const openBanModal = () => {
    showBanModal.value = true;
    showMenuPopover.value = false;
    activeMenuIndex.value = null;
};

const openDeleteModal = () => {
    showDeleteModal.value = true;
    showMenuPopover.value = false;
    activeMenuIndex.value = null;
};

onMounted(() => {
    fetchPaginatedBurrows(
        paginatedBurrows.value.pagination.page,
        search.value,
        selectedFilterTag.value,
    );
    fetchBurrowTags();
    document.addEventListener("mousedown", handleClickOutsideMenu);
    document.addEventListener("mousedown", handleClickOutsideTagPopover);
});

onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleClickOutsideMenu);
    document.removeEventListener("mousedown", handleClickOutsideTagPopover);
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
                        Burrows
                    </h1>
                    <div class="flex flex-row gap-2">
                        <input
                            :class="`w-full sm:w-48 h-8 lg:h-10 rounded-lg bg-fill mr-2 px-4 ${searchError && 'border border-red-500'}`"
                            placeholder="Search"
                            :value="search"
                            @input="onInputChange"
                        />
                        <Button
                            ref="tagFilterButtonRef"
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
                            :classname="`size-8 lg:size-10 ${paginatedBurrows.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                            @click="fetchPreviousPage"
                            ><i class="fi fi-sr-angle-left fill-white size-3.5"
                        /></Button>
                        <Button
                            size="medium"
                            color="fill"
                            :classname="`size-8 lg:size-10 ${
                                paginatedBurrows.pagination.page >=
                                    paginatedBurrows.pagination.total_pages &&
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
                        description="Unable to load burrows. Please try again later."
                        variant="error"
                    />
                    <Callout
                        v-if="
                            !error &&
                            !loading &&
                            paginatedBurrows.data.length === 0
                        "
                        title="No data found"
                        description="No burrows matched your search or there are
                            currently no burrows available."
                        variant="warning"
                    />

                    <table
                        v-else-if="!error && paginatedBurrows.data.length > 0"
                        class="w-full mt-4 border-collapse"
                    >
                        <thead>
                            <tr>
                                <th class="min-w-1"></th>
                                <th class="w-10"></th>
                                <th class="min-w-16 max-w-32">
                                    <p class="text-left ml-2 truncate">
                                        Burrow
                                    </p>
                                </th>
                                <th class="w-full">
                                    <p class="text-left w-full ml-2">Tags</p>
                                </th>
                                <th class="min-w-16 max-w-32">
                                    <p class="text-left ml-2 truncate">Date</p>
                                </th>
                                <th class="w-12"></th>
                            </tr>
                        </thead>

                        <SkeletonTable v-if="loading" />

                        <tbody v-else>
                            <tr
                                v-for="(
                                    burrow, index
                                ) in paginatedBurrows?.data || []"
                                :key="index"
                                class="odd:bg-fill h-12"
                            >
                                <th class="min-w-1 flex-shrink-0 h-full">
                                    <div
                                        v-if="burrow.is_banned"
                                        class="w-1 h-12 bg-yellow-500 p-0"
                                    />
                                    <div
                                        v-if="burrow.date_deleted !== null"
                                        class="w-1 h-12 bg-red-500 p-0"
                                    />
                                </th>
                                <td class="min-w-10">
                                    <img
                                        :src="
                                            getFilePath(
                                                burrow?.avatar,
                                                FileTypes.burrowAvatar,
                                            )
                                        "
                                        class="size-8 ml-2 rounded-full w-8 flex-shrink-0"
                                        @error="
                                            (e: Event) => {
                                                if (e.target)
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src = fallbackImage(
                                                        FileTypes.burrowAvatar,
                                                    );
                                            }
                                        "
                                    />
                                </td>
                                <td class="min-w-16 w-32">
                                    <div class="flex flex-col text-left ml-2">
                                        <p class="text-sm leading-4 truncate">
                                            {{ burrow.name }}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div class="w-full ml-2">
                                        <TagList :tags="burrow.tag" />
                                    </div>
                                </td>
                                <td class="min-w-16 max-w-32">
                                    <p class="ml-2 text-left text-sm truncate">
                                        {{
                                            burrow.dateCreation.substring(0, 10)
                                        }}
                                    </p>
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
                                                (e: MouseEvent) =>
                                                    toggleMenuPopover(
                                                        e,
                                                        index,
                                                        burrow.name,
                                                        burrow.is_banned,
                                                        burrow.date_deleted,
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
                    v-if="!error && paginatedBurrows.data.length > 0"
                    class="flex flex-col lg:flex-row gap-4 mt-4 mb-8 items-center lg:justify-between"
                >
                    <div class="flex flex-row gap-2">
                        <Button
                            size="medium"
                            color="fill"
                            :classname="`size-8 lg:size-10 ${paginatedBurrows.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                            @click="fetchPreviousPage"
                            ><i class="fi fi-sr-angle-left fill-white size-3.5"
                        /></Button>
                        <Button
                            v-for="page in getPageButtons(
                                paginatedBurrows.pagination.total_pages,
                                paginatedBurrows.pagination.page,
                            )"
                            :key="page"
                            size="medium"
                            color="fill"
                            :label="String(page)"
                            :classname="`size-8 lg:size-10 ${page === paginatedBurrows.pagination.page ? 'bg-link text-white' : 'hover:bg-fill-light'}`"
                            @click="
                                fetchPaginatedBurrows(
                                    page,
                                    search,
                                    selectedFilterTag,
                                )
                            "
                        />
                        <Button
                            size="medium"
                            color="fill"
                            :classname="`size-8 lg:size-10 ${
                                paginatedBurrows.pagination.page >=
                                    paginatedBurrows.pagination.total_pages &&
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
                            :value="paginatedBurrows.pagination.page"
                            :min="MIN_PAGE_VALUE"
                            :max="
                                paginatedBurrows.pagination.total_pages > 0
                                    ? paginatedBurrows.pagination.total_pages
                                    : MIN_PAGE_VALUE
                            "
                            @input="
                                (event: Event) => {
                                    const value = Math.max(
                                        MIN_PAGE_VALUE,
                                        Math.min(
                                            Number(
                                                (
                                                    event.target as HTMLInputElement
                                                ).value,
                                            ),
                                            paginatedBurrows.pagination
                                                .total_pages || MIN_PAGE_VALUE,
                                        ),
                                    );
                                    if (
                                        !isNaN(value) &&
                                        value !==
                                            paginatedBurrows.pagination.page
                                    ) {
                                        fetchPaginatedBurrows(
                                            value,
                                            search,
                                            selectedFilterTag,
                                        );
                                    } else if (
                                        isNaN(value) ||
                                        (value === 0 &&
                                            paginatedBurrows.pagination
                                                .total_pages > 0)
                                    ) {
                                        (
                                            event.target as HTMLInputElement
                                        ).value = String(
                                            paginatedBurrows.pagination.page,
                                        );
                                    }
                                }
                            "
                        />
                        <p class="text-sm">
                            of
                            {{ paginatedBurrows.pagination.total_pages || 0 }}
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
            <div class="bg-fill-light rounded-lg shadow-md w-32">
                <Button
                    size="medium"
                    color="fill"
                    classname="w-full !h-10 !justify-start bg-inherit hover:bg-fill"
                    label="View"
                    fill
                    @click="navigateTo(`/b/${selectedBurrow}`)"
                    ><i class="fi fi-sr-eye fill-white size-3.5 mr-2"
                /></Button>
                <Button
                    v-if="!banned"
                    size="medium"
                    color="fill"
                    classname="w-full !h-10 !justify-start bg-inherit hover:bg-fill text-red-400 hover:text-red-300"
                    label="Ban"
                    fill
                    @click="openBanModal"
                    ><i
                        class="fi fi-sr-gavel fill-red-400 group-hover:fill-red-300 size-3.5 mr-2"
                /></Button>
                <Button
                    v-if="!deleted"
                    size="medium"
                    color="fill"
                    classname="w-full !h-10 !justify-start bg-inherit hover:bg-fill text-red-400 hover:text-red-300"
                    label="Delete"
                    fill
                    @click="openDeleteModal"
                    ><i
                        class="fi fi-sr-trash fill-red-400 group-hover:fill-red-300 size-3.5 mr-2"
                /></Button>
            </div>
        </div>

        <div
            v-if="showTagPopover"
            ref="tagPopoverRef"
            class="absolute z-30"
            :style="{
                top: `${tagPopoverPosition.top}px`,
                left: `${tagPopoverPosition.left}px`,
                transform: 'translateX(-50%)',
            }"
        >
            <div
                class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-fill-light mx-auto"
            ></div>
            <div
                class="bg-fill-light rounded-lg shadow-md p-4 w-48 max-h-64 overflow-y-auto"
            >
                <p class="text-white text-sm mb-2">Tag Filter</p>
                <Button
                    size="medium"
                    color="fill"
                    :classname="`w-full !justify-start whitespace-nowrap truncate mb-1 ${'' === selectedFilterTag ? 'bg-orange-950 hover:bg-orange-950 active:bg-orange-950 border border-orange-500' : 'hover:bg-fill'}`"
                    label="All Tags"
                    fill
                    @click="
                        selectedFilterTag = '';
                        fetchPaginatedBurrows(1, search, selectedFilterTag);
                        showTagPopover = false;
                    "
                />
                <div class="flex flex-col gap-1 w-full">
                    <Button
                        v-for="(tag, i) in burrowTags"
                        :key="i"
                        size="medium"
                        color="fill"
                        :classname="`w-full min-w-0 !justify-start whitespace-nowrap [&>p]:truncate ${tag === selectedFilterTag ? 'bg-orange-950 hover:bg-orange-950 active:bg-orange-950 border border-orange-500' : 'hover:bg-fill'}`"
                        :label="tag"
                        fill
                        @click="
                            selectedFilterTag = tag;
                            fetchPaginatedBurrows(1, search, selectedFilterTag);
                            showTagPopover = false;
                        "
                    />
                </div>
            </div>
        </div>

        <!-- Ban Confirmation Modal -->
        <div
            v-if="showBanModal"
            class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75"
            @click.self="showBanModal = false"
        >
            <div
                class="bg-fill p-4 rounded-lg shadow-xl w-full max-w-md flex flex-col m-4 min-h-[280px]"
                role="dialog"
                aria-modal="true"
            >
                <div class="flex justify-between items-start mb-2">
                    <h2 class="text-sm font-bold text-white truncate pr-2">
                        Confirm Ban: {{ selectedBurrow }}
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

                <p class="text-xs text-gray-500 truncate mb-4">
                    Are you sure you want to ban this burrow?
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
                        @click="processBanBurrow()"
                    />
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <DeleteBurrowModal
            v-if="showDeleteModal"
            :burrowName="selectedBurrow!"
            @close="showDeleteModal = false"
            @delete="
                {
                    selectedBurrow = null;
                    fetchPaginatedBurrows(
                        paginatedBurrows.pagination.page,
                        search,
                        selectedFilterTag,
                    );
                }
            "
        />
    </div>
</template>
