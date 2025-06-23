<template>
    <tbody>
        <tr v-for="index in 20" :key="index" class="odd:bg-fill h-12">
            <td class="w-10">
                <div
                    class="size-8 ml-2 rounded-full animate-pulse bg-gray-500"
                />
            </td>
            <td class="w-32">
                <div class="flex flex-col text-left ml-2">
                    <div
                        class="h-3.5 w-32 rounded-full animate-pulse bg-gray-500"
                    />
                </div>
            </td>
            <td class="w-min">
                <div class="w-64 ml-2">
                    <div
                        class="h-6 w-full rounded-full animate-pulse bg-gray-500"
                    />
                </div>
            </td>
            <td class="max-w-32">
                <div
                    class="h-3.5 ml-2 w-32 rounded-full animate-pulse bg-gray-500"
                />
            </td>
            <td class="w-12">
                <div class="flex ml-2 px-2 justify-center items-center">
                    <div class="size-8 rounded-lg animate-pulse bg-gray-500" />
                </div>
            </td>
        </tr>
    </tbody>
</template>
