<script>

    // imports
    import HeatStripes from './HeatStripes.svelte';
    import LinePlot from './LinePlot.svelte';
    import { extent, scaleLinear, scaleDiverging, interpolateRdBu, ticks } from 'd3';
    import Line from './Line.svelte';
    import Stripes from './Stripes.svelte';
    import Axis from './Axis.svelte';
    
    // props
    export let data;
    // export let audio;


    /* Variables */

    // formatting / layout
    let width;
    let height;
    const margin = { top: 30, bottom: 30, left: 30, right: 30 };
    const chartPadding = 30;
    $: chartWidth = width - margin.left - margin.right;
    $: chartHeight = (height - margin.top - margin.bottom - chartPadding) / 2;

    // chart objects
    $: co2 = {
        xAccessor: d => new Date(+d.year, +d.month - 1),
        yAccessor: d => +d.average
    };

    let heat = {
        xAccessor: d => new Date(+d.year, 0),
        yAccessor: d => +d.Avg_Tempmax_anomaly,
        colorAccessor: d => +d.Avg_Tempmax_anomaly
    }
    
    // co2, only need to define y domain and scale for co2, want co2
    // and heat charts to be aligned so will use heat xScale since the co2
    // data is contained within the heat data

    // domains
    let co2_yDomain = [310, 420]; // extent(data.co2.map(d => co2.yAccessor(d)))

    // only need to define the y scale for co2, will use the xScale for heat for both
    $: co2_yScale = scaleLinear()
        .domain(co2_yDomain)
        .range([chartHeight, 0]);

    // heat
    // domains
    let heat_xDomain = extent(data.local_temp.map(d => heat.xAccessor(d)));
    let heat_yDomain = extent(data.local_temp.map(d => heat.yAccessor(d)));
    let heat_colorDomain = extent(data.local_temp.map(d => heat.colorAccessor(d)));
    
    // scales
    $: heat_xScale = scaleLinear()
        .domain(extent(data.local_temp.map(d => heat.xAccessor(d))))
        .range([0, chartWidth]);

    $: heat_colorScale = scaleDiverging(t => interpolateRdBu(1 - t))
        .domain([heat_colorDomain[0], 0, heat_colorDomain[1]]);   

    // axes paths
    $: co2_yPath = `M 0 0 V ${chartHeight}`;
    let co2_yTicks = ticks(co2_yDomain[0], co2_yDomain[1], 10);
    let xTicks = ticks(heat_xDomain[0].getFullYear(), heat_xDomain[1].getFullYear(), 10);
    // audio / selection
    let selected = 540;
    let src;
    let audio;
    // let counties = [3, 65, 79, 109, 125, 540];
    let counties = new Map([[3, "Albemarle"], [65, "Fluvanna"], [79, "Greene"], [109, "Louisa"], [125, "Nelson"], [540, "Charlottesville City"]]);
    let show = false;
    let isPlaying = false;

    let selectChange = () => {
        if (audio) audio.pause();
        isPlaying = false;
        show = false;
    };

    let play = () => {
        show = true;
    }

    let playToggle = () => {
        if (isPlaying) {
            isPlaying = false;
            show = false;
            if (audio) audio.pause();
        } else {
            isPlaying = true;
            show = true;
            src = `data/local_county_${selected}_v1.wav`;
            audio = new Audio(src);
            audio.play();
        }
    }

    // animations



</script>

<div class="explore" bind:offsetWidth={width} bind:offsetHeight={height}>
    <!-- <div>
        <h4>
            Explore the Charlottesville Region by Counties
        </h4>
    </div>
-->

    <select bind:value={selected} on:change={selectChange}>
        {#each Array.from(counties.keys()) as k}
            <option value={k}>
                {counties.get(k)}
            </option>
        {/each}
    </select>

    <button on:click={playToggle}>
        {#if isPlaying} 
            stop
        {:else}
            play
        {/if}
    </button>
    <svg {width} {height}>
        <!-- sonification range box-->
        <g transform="translate({margin.left + heat_xScale(new Date(1950, 0))}, {margin.top - 10})">
            <text dy="-5" font-weight=200>sonification range</text>
            <rect 
                x={0} 
                y={0} 
                width={heat_xScale(new Date(2021, 0)) - heat_xScale(new Date(1950, 0))} 
                height={chartHeight*2 + chartPadding + 20}
                fill="#eee"  
                fill-opacity=0.5
            />
        </g>

        <!-- co2, y axis -->
        <g transform="translate({margin.left}, {margin.top})">
            {#each co2_yTicks as y, i}
            <g class="co2-ytick" transform="translate(0, {co2_yScale(y)})">
                <path stroke="#ccc" stroke-dasharray="4" fill="none" d="M 0 0 H {chartWidth}" />
                <text font-weight="200" dy="-2">
                    {#if i == co2_yTicks.length - 1}
                        {`${y} Atmospheric CO2 (ppm)`}
                    {:else}
                        {y}
                    {/if}
                </text>
            </g>
            {/each}
        </g>

        <!-- x axis, year -->
        <g transform="translate({margin.left}, {margin.top + chartHeight + (chartPadding/2)})">
            {#each xTicks as x}
                <g class="xtick" transform="translate({heat_xScale(new Date(x, 0))}, 0)">
                    <text text-anchor="middle" >
                        {x}
                    </text>
                </g>
            {/each}
        </g>



        {#if show}

            <Line 
                data={data.co2.filter(d => +d.year >= 1959)}
                transform="translate({margin.left}, {margin.top})"
                xAccessor={co2.xAccessor}
                yAccessor={co2.yAccessor}
                xScale={heat_xScale}
                yScale={co2_yScale}
                duration={10000}
            />

            <Stripes 
                data={data.local_temp.filter(d => +d.county === selected)}
                transform="translate({margin.left}, {margin.top + chartHeight + chartPadding})"
                xAccessor={heat.xAccessor}
                colorAccessor={heat.colorAccessor}
                xScale={heat_xScale}
                colorScale={heat_colorScale}
                height={chartHeight}
            />

        {/if}

    </svg>
</div>

<style>
    .explore {
        height: 80vh;
        max-width: 100%;
    }
</style>