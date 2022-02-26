<script>
    // imports
    import { ticks } from "d3";

    // props
    export let transform;
    export let xScale;
    // export let data;
    export let width;
    export let xDomain;
    export let tickOffset = 0;

    $: xPath = `M 0 0 H ${width}`;
    let xTicks = ticks(new Date(xDomain[0]).getFullYear(), new Date(xDomain[1]).getFullYear(), 10);


</script>

<g {transform}>
    <!-- <path stroke="#ccc" d="{xPath}" fill="none" /> -->
    {#each xTicks as x}
        <g class="xtick" transform="translate({xScale(new Date(x, 0)) + tickOffset}, 0)">
            <!-- <line stroke="#ccc" y2="6" /> -->
            <text text-anchor="middle" dy="6"> 
                {x}
            </text>
        </g>
    {/each}
</g>
