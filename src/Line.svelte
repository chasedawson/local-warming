<script>
    // imports
    import { draw } from 'svelte/transition';
    import { linear } from 'svelte/easing';
    import { onMount } from 'svelte';
    import { line, extent } from 'd3';

    // props
    export let data;
    export let xAccessor; 
    export let yAccessor;
    export let xScale;
    export let yScale;
    export let transform;
    export let animate;

    $: path = line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));

    $: console.log(data);

</script>

<g {transform}>
    {#if animate}
        <path in:draw="{{duration: 63*(240000/150), delay: 9*(240000/150) + 100, easing: t => t}}"
            class="line"  
            d="{path(data)}"
            fill="none"
            stroke="#A31A2C"
            stroke-width=2        
        />
    {:else}
        <path
            class="line"  
            d="{path(data)}"
            fill="none"
            stroke="#A31A2C"
            stroke-width=2        
        />
    {/if}
</g>

<style>

</style>

