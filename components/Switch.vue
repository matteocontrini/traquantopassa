<script setup lang="ts">
defineProps<{
    isBus: boolean;
    busSlug: string;
    trainSlug: string;
    align?: string;
}>();
</script>

<template>
    <div class="flex gap-x-2"
    :class="[`justify-${align || 'center'}`]">
        <NuxtLink
            :to="`/${busSlug}`"
            class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
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
            class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
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
