<script lang="ts">
    import { onMount } from 'svelte';
    import type { Trip } from '$lib/Trip';
    import StopPosition from './StopPosition.svelte';

    export let trip: Trip;

    let stopElements: (HTMLDivElement | undefined)[] = [];

	// on load show the last passed stop in the middle so it's easier to see
    onMount(() => {
        const elementToScroll = stopElements[trip.currentStopSequenceNumber - 1];
        if (elementToScroll) {
            elementToScroll.scrollIntoView({ block: 'center' });
        }
    });
</script>

<div class="mb-2 flex-auto items-center gap-x-4">
    <div class="px-4 py-2 rounded-xl" style="background-color: #5d5d5d">
        <div class="overflow-y-scroll h-40">
            {#each trip.stopTimes as routeTime, i}
                <div bind:this={stopElements[i]}>
                    <StopPosition
                        stopTime={routeTime}
                        color={trip.routeColor}
                        wasPassed={trip.currentStopSequenceNumber > i}
                    />
                </div>
            {/each}
        </div>
    </div>
</div>