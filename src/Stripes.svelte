<script>
    // imports
    import { scaleLinear, scaleDiverging, interpolateRdBu } from "d3";
    import { fly } from 'svelte/transition';

    // props
    export let data;
    export let height;
    export let transform;
    export let xAccessor;
    export let colorAccessor;
    // export let yAccessor = colorAccessor;
    export let xScale;
    export let colorScale;

    // layout variables
    $: barWidth = xScale(xAccessor(data[1])) - xScale(xAccessor(data[0]));

    const flyIn = (i) => {
        // set duration and delay
        let duration;
        let delay;
        if (+data[i].year < 1950) {
            duration = 100;
            delay = 100*i;
        } else {
            duration = 1000;
            let k = 1949 - (+data[0].year);
            delay = 100*k + 1000 * (i-k);
        }
            
        return {
            duration: duration,
            y: 0, 
            x: 200,
            delay: delay
        }
    }

</script>

<g {transform}>
    {#each data as d, i}
        {#if +d.year < 1950}
            <rect
                x={xScale(xAccessor(d))}
                y={0}
                width={barWidth}
                {height}
                style="fill: {colorScale(colorAccessor(d))}"
            />
        {:else}
            <rect in:fly="{{duration: (240000/130), delay: (240000/130)*(+d.year - 1950) + 500, x: 0, y: 50}}"
                x={xScale(xAccessor(d))}
                y={0}
                width={barWidth}
                {height}
                style="fill: {colorScale(colorAccessor(d))}"
            />
        {/if}
    {/each}
</g>