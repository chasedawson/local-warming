<script>
    // imports
    import Stripes from "./Stripes.svelte";
    import ColorGradientLegend from "./ColorGradientLegend.svelte";
    import {
        scaleLinear,
        scaleDiverging,
        extent,
        interpolateRdBu,
        ticks
    } from "d3";

    // props
    export let data;

    // variables
    let width;
    let height = 500;
    let margin = {top: 80, bottom: 30, left: 30, right: 130};
    $: chartWidth = width - margin.left - margin.right;
    $: chartHeight = height - margin.top - margin.bottom;
    let counties = new Map([[3, "Albemarle"], [65, "Fluvanna"], [79, "Greene"], [109, "Louisa"], [125, "Nelson"], [540, "Charlottesville"]]);
    let num_counties = Array.from(counties.keys()).length;
    $: subChartHeight = chartHeight / num_counties;

    // let x scale and axis
    let xAccessor = d => +d.year;
    let xExtent = extent(data.map(d => xAccessor(d)));
    $: xScale = scaleLinear()
        .domain([xExtent[0], xExtent[1] + 1]) // add one to each side so that bars all actually fit within calculated chart width
        .range([0, chartWidth]);
    $: xPath = `M ${xScale(xExtent[0])} 0 H ${xScale(xExtent[1]) - xScale(xExtent[0])}`;
    let xTicks = ticks(xExtent[0], xExtent[1], 10);


    let colorAccessor = d => +d.Avg_Tempmax_anomaly;
    let colorExtent = extent(data.map(d => colorAccessor(d)));
    $: colorScale = scaleDiverging(t => interpolateRdBu(1 - t))
        .domain([colorExtent[0], 0, colorExtent[1]]);

</script>

<div class="MultiStripes" bind:offsetWidth={width} bind:offsetHeight={height}>
    <svg {width} {height}>
        <ColorGradientLegend 
            title="Temperature Anomaly (°C)"
            width=200
            height=10
            interpolater={t => interpolateRdBu(1 - t)}
            transform="translate({margin.left + 20}, {margin.top / 2})"
            colorDomain={colorExtent}
        />


        <!-- y axis -->
        <g class="y-axis" transform="translate({margin.left + chartWidth}, {margin.top})">
            {#each Array.from(counties.keys()) as k, i}
            <g transform="translate(5, {(subChartHeight * i) + (subChartHeight / 2)})">
                <text class="y-label" dy="5">{counties.get(k)}</text>
            </g>
            {/each}
        </g>

        <!-- x axis -->
        <g class="x-axis" transform="translate({margin.left}, {margin.top + chartHeight + 5})">
            <path stroke="#ccc" d="{xPath}" fill="none" />
            {#each xTicks as x}
            <g class="xtick" transform="translate({xScale(x)}, 0)">
                <line stroke="#ccc" y2="6"/>
                <text dy="20" text-anchor="middle">
                    {x}
                </text>
            </g>
            {/each}
        </g>

        {#each Array.from(counties.keys()) as k, i} 
            <Stripes 
                data={data.filter(d => +d.county === k)}
                transform="translate({margin.left}, {margin.top + (subChartHeight * i)})"
                {xAccessor}
                {xScale}
                {colorAccessor}
                {colorScale}
                height={subChartHeight}
                animate={false}
            />
        {/each}
    </svg>
</div>

<style>
    .MultiSripes {
        height: 500px;
        max-width: 100%;
    }

    .y-label {
        font-weight: 200;
    }

    .xtick {
        font-weight: 300;
    }
</style>