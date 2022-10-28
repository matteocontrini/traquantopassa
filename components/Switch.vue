<script setup lang="ts">
defineProps<{
    isBus: boolean;
    busSlug: string;
    trainSlug: string;
}>();
</script>

<template>
    <div class="flex justify-center text-sm gap-x-2">
        <NuxtLink
            :to="`/${busSlug}`"
            class="cursor-pointer px-3 py-1 rounded-md no-underline"
            :class="{
                'bg-neutral-100': isBus,
                'hover:bg-neutral-200': isBus,
                'text-neutral-800': isBus,
                'font-semibold': isBus,
                'bg-neutral-800': !isBus,
                'hover:bg-neutral-700': !isBus,
            }"
        >
            Autobus
        </NuxtLink>
        <NuxtLink
            :to="`/treni/${trainSlug}`"
            class="cursor-pointer px-3 py-1 rounded-md no-underline"
            :class="{
                'bg-neutral-100': !isBus,
                'hover:bg-neutral-200': !isBus,
                'text-neutral-800': !isBus,
                'font-semibold': !isBus,
                'bg-neutral-800': isBus,
                'hover:bg-neutral-700': isBus,
            }"
        >
            Treni
        </NuxtLink>
    </div>
</template>
