<script>
    // imports
    import {
        scaleDiverging,
        scaleLinear,
    } from "d3";

    // props
    export let title;
    export let width;
    export let height;
    export let colorDomain;
    export let interpolater;
    export let transform;

    $: xScale = scaleLinear()
        .domain(colorDomain)
        .range([0, width]);

    $: zeroPos = xScale(0);

    $: colorScale = scaleDiverging(interpolater)
        .domain([xScale(colorDomain[0]), zeroPos, xScale(colorDomain[1])]);

    let gradient = [];
    for (let i = 0; i < width; i += 1) gradient.push(i);
    

    let labels = [colorDomain[0], 0, colorDomain[1]]

</script>

<g class="ColorGradientLegend" {transform}>
    <!-- title -->
    <text dy="-5" class="title">
        {title}
    </text>

    <!-- ticks -->
    <g class="labels">
        {#each labels as l}
            <g class="label" transform="translate({xScale(l)}, {height})">
                <text dy="15" text-anchor="middle">
                    {Math.round(l*10) / 10}
                </text>
            </g>
        {/each}
    </g>

    {#each gradient as g, i}
        <rect 
            x={i}
            y={0}
            width={1}
            {height}
            style="fill: {colorScale(g)}"
        />
    {/each}
</g>

<style>

    .title {
        font-size: 16px;
        font-weight: 300;
    }

    .label text {
        font-size: 14px;
        font-weight: 200;
    }
</style>
