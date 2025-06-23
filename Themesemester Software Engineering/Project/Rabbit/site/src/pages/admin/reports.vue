<script setup lang="ts">
import { ButtonComponent as Button } from "#components";
import Callout from "~/components/admin/components/Callout.vue";
import { debounce } from "~/utils/debounce";
import SkeletonTable from "~/components/admin/components/SkeletonTable.vue";
import { getPageButtons } from "~/components/admin/utils";
import type { PaginatedReports, ToastItem } from "~/assets/customTypes";
import { ToastTypes } from "~/assets/customTypes";
import { useFetchReports } from "~/utils/fetch/admin/useFetchReports";

const { $event } = useNuxtApp();

const MIN_PAGE_VALUE = 1;
const search: Ref<string> = ref("");
const searchError: Ref<boolean> = ref(false);
const validSearchRegex = /^[a-zA-Z0-9/.]*$/;
const loading: Ref<boolean> = ref(true);
const error: Ref<boolean> = ref(false);
const paginatedReports: Ref<PaginatedReports> = ref({
    data: [],
    pagination: {
        page: 1,
        total_pages: 1,
    },
});

async function fetchPaginatedReports(
    selectedPage: number,
    search: string,
): Promise<void> {
    loading.value = true;
    try {
        const response = await useFetchReports(search, selectedPage);
        paginatedReports.value = response;
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
    if (paginatedReports.value.pagination.page > MIN_PAGE_VALUE) {
        fetchPaginatedReports(
            paginatedReports.value.pagination.page - 1,
            search.value,
        );
    }
};

const fetchNextPage = (): void => {
    if (
        paginatedReports.value.pagination.page <
        paginatedReports.value.pagination.total_pages
    ) {
        fetchPaginatedReports(
            paginatedReports.value.pagination.page + 1,
            search.value,
        );
    }
};

const debouncedSearch = debounce(async (value: string) => {
    if (validSearchRegex.test(value)) {
        fetchPaginatedReports(
            paginatedReports.value.pagination.page,
            search.value,
        );
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
    fetchPaginatedReports(paginatedReports.value.pagination.page, search.value);
});

// definePageMeta({
//     middleware: ["auth", "admin"],
// });
</script>

<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div class="w-full max-w-3xl px-4">
            <div
                class="w-full flex justify-between items-center flex-col sm:flex-row"
            >
                <h1 class="font-bold text-white flex items-center h-8 lg:h-10">
                    Reports
                </h1>
                <div class="flex flex-row gap-2">
                    <input
                        :class="`w-full sm:w-48 h-8 lg:h-10 rounded-lg bg-fill mr-2 px-4 ${searchError && 'border border-red-500'}`"
                        placeholder="Search"
                        :value="search"
                        @input="onInputChange"
                    />
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${paginatedReports.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                        @click="fetchPreviousPage"
                        ><i class="fi fi-sr-angle-left fill-white size-3.5"
                    /></Button>
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${
                            paginatedReports.pagination.page >=
                                paginatedReports.pagination.total_pages &&
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
                        !error && paginatedReports.pagination.total_pages === 0
                    "
                    title="No data found"
                    description="No event logs matched your search or there are currently
                        no event logs available."
                    variant="warning"
                />

                <table v-else class="w-full mt-4 border-collapse">
                    <thead>
                        <tr>
                            <th class="w-full">
                                <p class="text-left">Report</p>
                            </th>
                        </tr>
                    </thead>

                    <SkeletonTable v-if="loading" />

                    <tbody v-else>
                        <tr
                            v-for="(report, index) in paginatedReports?.data ||
                            []"
                            :key="index"
                            class="odd:bg-fill h-12"
                        >
                            <td class="w-full">
                                <div class="flex flex-col text-left ml-2">
                                    <p class="text-sm leading-4 mb-1 truncate">
                                        {{ report.category }}
                                    </p>
                                    <p
                                        class="text-gray-500 text-[0.625rem] leading-[0.625rem] truncate"
                                    >
                                        {{ report.description }}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="paginatedReports.data.length > 0 && !loading"
                class="flex flex-col lg:flex-row gap-4 mt-4 mb-8 items-center lg:justify-between"
            >
                <div class="flex flex-row gap-2">
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${paginatedReports.pagination.page <= MIN_PAGE_VALUE && 'cursor-not-allowed border hover:bg-main active:bg-main border-fill bg-main'}`"
                        @click="fetchPreviousPage"
                        ><i class="fi fi-sr-angle-left fill-white size-3.5"
                    /></Button>
                    <Button
                        v-for="page in getPageButtons(
                            paginatedReports.pagination.total_pages,
                            paginatedReports.pagination.page,
                        )"
                        :key="page"
                        size="medium"
                        color="fill"
                        :label="String(page)"
                        :classname="`size-8 lg:size-10 ${page === paginatedReports.pagination.page && 'bg-link text-white'}`"
                        @click="fetchPaginatedReports(page, search)"
                    />
                    <Button
                        size="medium"
                        color="fill"
                        :classname="`size-8 lg:size-10 ${
                            paginatedReports.pagination.page >=
                                paginatedReports.pagination.total_pages &&
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
                        :value="paginatedReports.pagination.page"
                        :min="MIN_PAGE_VALUE"
                        :max="paginatedReports.pagination.total_pages"
                        @input="
                            (event: Event) => {
                                const value = Number(
                                    (event.target as HTMLInputElement).value,
                                );
                                fetchPaginatedReports(value, search);
                            }
                        "
                    />
                    <p class="text-sm">
                        of
                        {{ paginatedReports.pagination.total_pages }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
