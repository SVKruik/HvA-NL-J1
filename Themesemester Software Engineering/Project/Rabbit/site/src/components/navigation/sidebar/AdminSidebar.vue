<script lang="ts" setup>
import { ButtonComponent as Button } from "#components";
</script>

<template>
    <div class="flex flex-col">
        <Button
            label="System logs"
            classname="mb-1 !bg-main hover:!bg-black active:!bg-black !justify-start"
            @click="navigateTo('/admin/systemlogs')"
        >
            <i class="fi fi-sr-form size-3.5" />
        </Button>
        <Button
            label="Burrows overview"
            classname="mb-1 !bg-main hover:!bg-black active:!bg-black !justify-start"
            @click="navigateTo('/admin/burrowOverview')"
            ><i class="fi fi-sr-arrow-trend-up size-3.5"
        /></Button>
        <Button
            label="Hoppers overview"
            classname="mb-1 !bg-main hover:!bg-black active:!bg-black !justify-start"
            @click="navigateTo('/admin/hoppers')"
        >
            <i class="fi fi-sr-users size-3.5" />
        </Button>
        <Button
            label="Reports"
            classname="!bg-main hover:!bg-black active:!bg-black !justify-start"
            @click="navigateTo('/admin/reports')"
            ><i class="fi fi-sr-chart-histogram size-3.5"
        /></Button>
    </div>
</template>
