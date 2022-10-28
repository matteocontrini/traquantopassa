<script setup lang="ts">
defineProps<{ train: Train }>();

function getImageUrl(icon: string) {
    return new URL(`../assets/${icon}.svg`, import.meta.url).href;
}
</script>

<template>
    <div class="flex items-center gap-x-4 mb-2">
        <div
            class="h-10 w-20 bg-neutral-600 flex-shrink-0 flex justify-center items-center font-semibold text-xl rounded-md"
        >
            {{ train.time }}
        </div>
        <div class="flex-grow whitespace-nowrap overflow-hidden">
            <span class="block leading-tight text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                <img
                    v-if="train.icon"
                    class="inline-block -mt-1 w-[22px] h-[22px]"
                    :src="getImageUrl(train.icon)"
                    :alt="train.category"
                    :title="train.category"
                />
                {{ train.destination }}
            </span>
            <span class="block text-xs text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap">
                <span class="inline-block w-5" v-if="train.isBlinking">
                    <span class="animate-blink block rounded-full w-2 h-2 bg-white"></span>
                </span>
                <template v-if="train.isReplacedByBus">
                    <span class="font-semibold text-orange-400">Bus sostitutivo</span> •
                </template>
                <template v-if="train.platform">
                    <span class="font-bold">Binario {{ train.platform }}</span> •
                </template>
                {{ train.carrier }} {{ train.number }}
                <template v-if="train.category && !train.icon"> • {{ train.category }}</template>
            </span>
        </div>
        <div class="text-right font-semibold whitespace-nowrap text-red-600" :class="{ 'text-xl': train.isDelayed }">
            {{ train.delay }}
        </div>
    </div>
</template>
