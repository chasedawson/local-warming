<script>
    // imports
    import { scaleLinear, scaleDiverging, interpolateRdBu } from "d3";
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

</script>

<g {transform}>
    {#each data as d, i}
        <rect 
            x={xScale(xAccessor(d))}
            y={0}
            width={barWidth}
            {height}
            style="fill: {colorScale(colorAccessor(d))}"
        />
    {/each}
</g>