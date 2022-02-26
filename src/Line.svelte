<script>
    // imports
    import { draw } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { line } from 'd3';

    // props
    export let data;
    export let xAccessor; 
    export let yAccessor;
    export let xScale;
    export let yScale;
    export let transform;

    $: path = line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));

    let show = false;
    onMount(() => show = true);

</script>

<g {transform}>
    {#if show}
        <path transition:draw="{{duration: 120*1000}}"
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

