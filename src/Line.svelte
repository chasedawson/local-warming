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

    $: path = line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));

    $: console.log(data);

</script>

<g {transform}>
    <path in:draw="{{duration: 63*(240000/130), delay: 8*(240000/130) + 500, easing: t => t}}"
        class="line"  
        d="{path(data)}"
        fill="none"
        stroke="#A31A2C"
        stroke-width=2        
    />
</g>

<style>

</style>

