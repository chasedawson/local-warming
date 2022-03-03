<script>
    // imports
    import { scaleLinear, scaleDiverging, interpolateRdBu } from "d3";
    import { fly, fade } from 'svelte/transition';

    // props
    export let data;
    export let height;
    export let transform;
    export let xAccessor;
    export let colorAccessor;
    // export let yAccessor = colorAccessor;
    export let xScale;
    export let colorScale;

    // optional props
    export let animate = false;

    // layout variables
    $: barWidth = xScale(xAccessor(data[1])) - xScale(xAccessor(data[0]));


</script>

<g {transform}>
    {#if animate}
        {#each data as d, i}
            {#if +d.year < 1950}
                <rect 
                    transition:fade
                    x={xScale(xAccessor(d)) - (barWidth / 2)}
                    y={0}
                    width={barWidth}
                    {height}
                    style="fill: {colorScale(colorAccessor(d))}"
                />
            {:else}
                <rect 
                    in:fade="{{duration: 100, delay: (240000/130)*(+d.year - 1950) + 500, x: 0, y: 50}}"
                    out:fade
                    x={xScale(xAccessor(d)) - (barWidth / 2)}
                    y={0}
                    width={barWidth}
                    {height}
                    style="fill: {colorScale(colorAccessor(d))}"
                />
            {/if}
        {/each}
    {:else}
        {#each data as d, i}
            <rect 
                x={xScale(xAccessor(d)) - (barWidth / 2)}
                y={0}
                width={barWidth}
                {height}
                style="fill: {colorScale(colorAccessor(d))}"
            />
        {/each}
    {/if}
</g>