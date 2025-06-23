<script setup lang="ts">
import {
    ButtonComponent as Button,
    InputComponent as Input,
} from "#components";
import Callout from "~/components/admin/components/Callout.vue";
import { debounce } from "~/utils/debounce";
import SkeletonTable from "~/components/admin/components/SkeletonTable.vue";
import { getPageButtons } from "~/components/admin/utils";
import type {
    Burrow,
    KeeperTypes,
    PaginatedKeeperBurrowTypes,
    ToastItem,
} from "~/assets/customTypes";
import { FileTypes, ToastTypes } from "~/assets/customTypes";
import { useFetchKeepersEditTable } from "~/utils/fetch/burrow/useFetchKeepersEditTable";
import { useFetchNewKeeperEmail } from "~/utils/fetch/burrow/useFetchNewKeeperEmail";
import { useFetchRemoveKeeperEmail } from "~/utils/fetch/burrow/useFetchRemoveKeeperEmail";
const props = withDefaults(
    defineProps<{
        burrow: Burrow;
        burrowId: number;
    }>(),
    {},
);
const { $event } = useNuxtApp();

const MIN_PAGE_VALUE = 1;
const search: Ref<string> = ref("");
const searchError: Ref<boolean> = ref(false);
const validSearchRegex = /^[a-zA-Z0-9/.]*$/;
const loading: Ref<boolean> = ref(true);
const error: Ref<boolean> = ref(false);
const showConfirmModal = ref(false);
const selectedKeeper = ref<KeeperTypes | null>(null);

const paginatedKeepers: Ref<PaginatedKeeperBurrowTypes> = ref({
    data: [],
    pagination: {
        page: 1,
        total_pages: 1,
    },
});
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
async function fetchPaginatedKeepers(
    selectedPage: number,
    search: string,
): Promise<void> {
    loading.value = true;
    try {
        const response = await useFetchKeepersEditTable(search, selectedPage);
        paginatedKeepers.value = response;
        loading.value = false;
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
    }
}

const fetchPreviousPage = (): void => {
    if (paginatedKeepers.value.pagination.page > MIN_PAGE_VALUE) {
        fetchPaginatedKeepers(
            paginatedKeepers.value.pagination.page - 1,
            search.value,
        );
    }
};

const fetchNextPage = (): void => {
    if (
        paginatedKeepers.value.pagination.page <
        paginatedKeepers.value.pagination.total_pages
    ) {
        fetchPaginatedKeepers(
            paginatedKeepers.value.pagination.page + 1,
            search.value,
        );
    }
};

const debouncedSearch = debounce(async (value: string) => {
    if (validSearchRegex.test(value)) {
        fetchPaginatedKeepers(paginatedKeepers.value.pagination.page, value);
    }
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

onMounted(() => {
    fetchPaginatedKeepers(paginatedKeepers.value.pagination.page, search.value);
});

function requestToggleKeeper(keeper: KeeperTypes) {
    selectedKeeper.value = keeper;
    showConfirmModal.value = true;
}

async function confirmToggleKeeper() {
    if (!selectedKeeper.value) return;

    const keeper = selectedKeeper.value;
    if (keeper.keeper) {
        try {
            await useFetchRemoveKeeperEmail(
                keeper.email,
                keeper.id,
                props.burrowId,
                props.burrow.name,
            );
            toast("Keeper removed successfully.", "success");
        } catch (error) {
            toast(
                (error as { message?: string })?.message ||
                    "Failed to remove keeper. Please try again.",
                "danger",
            );
        }
        keeper.keeper = false;
    } else {
        try {
            await useFetchNewKeeperEmail(
                keeper.email,
                keeper.id,
                props.burrowId,
                props.burrow.name,
            );
            keeper.keeper = true;
        } catch (error) {
            toast(
                (error as { message?: string })?.message ||
                    "Failed to invite keeper. Please try again.",
                "danger",
            );
        }
    }
    showConfirmModal.value = false;
    selectedKeeper.value = null;
}

function cancelToggleKeeper() {
    showConfirmModal.value = false;
    selectedKeeper.value = null;
}
</script>

<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div
            class="w-full max-w-3xl px-4 mt-2 mb-4 bg-fill rounded-lg shadow-lg"
        >
            <h1 class="text-2xl font-bold text-white mb-2">Manage Keepers</h1>
            <p class="text-sm text-gray-400 mt-2">
                Invite a member or remove an existing member below from from
                your keepers list, a Keeper is a member who can manage your
                Burrow, a keeper will not be ble to alter your Burrow. A Keeper
                can only help you monitor Posts.
            </p>
        </div>
        <div class="w-full max-w-3xl px-4">
            <div
                class="w-full flex justify-between items-center flex-col sm:flex-row"
            >
                <h1 class="font-bold text-white flex items-center h-8 lg:h-10">
                    Members
                </h1>

                <div class="flex flex-row gap-2">
                    <Input
                        color="Ebony Clay"
                        :fill="false"
                        icon
                        label="Enter...."
                        :maxLength="0"
                        :required="false"
                        size="small"
                        :smallText="false"
                        type="text"
                        :value="search"
                        @input="onInputChange"
                    />
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${paginatedKeepers.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                        @click="fetchPreviousPage"
                        ><i class="fi fi-sr-angle-left fill-white size-3.5"
                    /></Button>
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${
                            paginatedKeepers.pagination.page >=
                                paginatedKeepers.pagination.total_pages &&
                            'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'
                        }`"
                        @click="fetchNextPage"
                        ><i class="fi fi-sr-angle-right fill-white size-3.5"
                    /></Button>
                </div>
            </div>

            <div class="w-3xl overflow-x-auto">
                <Callout
                    v-if="error"
                    title="An error occurred"
                    description="Unable to load event logs. Please try again later."
                    variant="error"
                />
                <Callout
                    v-if="
                        !error && paginatedKeepers.pagination.total_pages === 0
                    "
                    title="No data found"
                    description="No event logs matched your search or there are currently
                        no event logs available."
                    variant="warning"
                />

                <table v-else class="w-full mt-4 border-collapse">
                    <thead>
                        <tr>
                            <th class="w-11">
                                <p class="text-left ml-2">Avatar</p>
                            </th>
                            <th class="ml-2 w-full">
                                <p class="text-left ml-2">Member</p>
                            </th>
                        </tr>
                    </thead>

                    <SkeletonTable v-if="loading" />

                    <tbody v-else>
                        <tr
                            v-for="(keeper, index) in paginatedKeepers?.data ||
                            []"
                            :key="index"
                            class="odd:bg-fill h-12"
                        >
                            <td class="w-10">
                                <img
                                    :src="
                                        getFilePath(
                                            keeper.avatar,
                                            FileTypes.hopperAvatar,
                                        )
                                    "
                                    alt="Keeper avatar"
                                    class="size-8 rounded-full"
                                    @error="
                                        (e) => {
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
                            <td class="w-full">
                                <div
                                    class="flex items-center justify-between w-full px-2"
                                >
                                    <div class="flex items-center gap-2">
                                        <p
                                            class="text-left text-sm whitespace-nowrap"
                                        >
                                            {{ keeper.name }}
                                        </p>
                                        <i
                                            v-if="keeper.keeper"
                                            class="fi fi-sr-rabbit fill-yellow-500 size-4 mt-[-0.25rem]"
                                        />
                                        <i
                                            v-if="keeper.owner"
                                            class="fi fi-sr-crown fill-yellow-500 size-4 mt-[-0.25rem]"
                                        />
                                    </div>

                                    <Button
                                        v-if="!keeper.owner"
                                        :label="
                                            keeper.keeper ? 'Remove' : 'Invite'
                                        "
                                        color="orange"
                                        :disabled="false"
                                        :fill="false"
                                        icon-path="/icons/up.svg"
                                        iconposition="right"
                                        :variant="
                                            keeper.keeper
                                                ? 'outline'
                                                : 'primary'
                                        "
                                        @click="
                                            () => requestToggleKeeper(keeper)
                                        "
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="flex flex-col lg:flex-row gap-4 mt-4 mb-8 items-center lg:justify-between"
            >
                <div class="flex flex-row gap-2">
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${paginatedKeepers.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                        @click="fetchPreviousPage"
                        ><i class="fi fi-sr-angle-left fill-white size-3.5"
                    /></Button>
                    <Button
                        v-for="page in getPageButtons(
                            paginatedKeepers.pagination.total_pages,
                            paginatedKeepers.pagination.page,
                        )"
                        :key="page"
                        size="medium"
                        color="fill"
                        :label="String(page)"
                        :classname="`size-8 lg:size-10 ${page === paginatedKeepers.pagination.page && 'bg-link text-white'}`"
                        @click="fetchPaginatedKeepers(page, search)"
                    />
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${
                            paginatedKeepers.pagination.page >=
                                paginatedKeepers.pagination.total_pages &&
                            'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'
                        }`"
                        @click="fetchNextPage"
                        ><i class="fi fi-sr-angle-right fill-white size-3.5"
                    /></Button>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <input
                        class="bg-fill rounded-lg w-16 h-8 lg:h-10 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        :value="paginatedKeepers.pagination.page"
                        :min="MIN_PAGE_VALUE"
                        :max="paginatedKeepers.pagination.total_pages"
                        @input="
                            (event: Event) => {
                                const value = Number(
                                    (event.target as HTMLInputElement).value,
                                );
                                fetchPaginatedKeepers(value, search);
                            }
                        "
                    />
                    <p class="text-sm">
                        of
                        {{ paginatedKeepers.pagination.total_pages }}
                    </p>
                </div>
            </div>
        </div>
        <template v-if="showConfirmModal">
            <div
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
                <div
                    class="bg-fill rounded-xl p-6 shadow-xl max-w-sm w-full text-center"
                >
                    <p class="text-white mb-4">
                        Are you sure you want to
                        {{ selectedKeeper?.keeper ? "remove" : "invite" }}
                        <strong>{{ selectedKeeper?.name }}</strong
                        >?
                    </p>
                    <div class="flex justify-center gap-4">
                        <Button label="Cancel" @click="cancelToggleKeeper" />
                        <Button
                            :label="
                                selectedKeeper?.keeper ? 'Revoke' : 'Invite'
                            "
                            color="orange"
                            :variant="
                                selectedKeeper?.keeper ? 'outline' : 'primary'
                            "
                            @click="confirmToggleKeeper"
                        />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
