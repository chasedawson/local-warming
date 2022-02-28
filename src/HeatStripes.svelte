<script>
	// imports 
	import { scaleLinear, extent, scaleSequential, interpolateRdBu, ticks, scaleDiverging } from 'd3';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	
	// props
	export let data;
	export let currentStep;
	export let xAccessor;
	export let yAccessor;
		
	// layout variables
	let width;
	let height; // set here and also in style
	$: barWidth = xScale(xAccessor(data[1])) - xScale(xAccessor(data[0]));
	const margin = { top: 30, bottom: 40, left: 50, right: 30 };
	$: chartHeight = height - margin.top - margin.bottom;
	$: chartWidth = width - margin.left - margin.right;


	// tweening!
	let tweenedBarHeight;
	$: if (height) {
		tweenedBarHeight = tweened(data.map(d => chartHeight));
	} 
	let tweenedY = tweened(data.map(d => 0)); // determines start y from which rects are drawn
	let isUniform = true; // meaning bar height is uniform

	// toggle() switches between uniform height heatstripe and varying height heatstripe
	const toggle = () => {
		if (isUniform) {
			tweenedBarHeight.set(data.map(d => {
				if (yAccessor(d) < 0) return yScale(yAccessor(d)) - zeroYPos;
				else return zeroYPos - yScale(yAccessor(d)); 
			}));

			// change starting y position
			tweenedY.set(data.map(d => {
				if (yAccessor(d) < 0) return zeroYPos;
				else return yScale(yAccessor(d));
			}));
		} else {
			// return to uniform
			tweenedBarHeight.set(data.map(d => chartHeight));
			tweenedY.set(data.map(d => 0));
		}
		isUniform = !isUniform;
	}
	
	// scales
	let xExtent = extent(data.map(d => xAccessor(d)));
	// let xExtent = [1880, 2020];
	$: xScale = scaleLinear()
		.domain(xExtent)
		.range([0, chartWidth]);
	
	// use absolute value of y accessor to determine extent because when the chart flips, the 
	// absolute value of the temperature shoud determine height
	let yAbsExtent = extent(data.map(d => Math.abs(yAccessor(d))));
	let yExtent = extent(data.map(d => yAccessor(d)));

	$: heightScale = scaleLinear()
		.domain(yExtent[0], yExtent[1])
		.domain([0, 1])

	// $: yScale = scaleLinear()
	// 	.domain(yAbsExtent)
	// 	.range([0, chartHeight / 2]);


	// create temp, unused y scale to determine where 0 should be on the chart
	$: yScale = scaleLinear()
		.domain(yExtent)
		.range([chartHeight, 0]);
	$: zeroYPos = yScale(0);

	$: console.log(yExtent, yScale, zeroYPos, chartHeight);
	
	// color and y will access the same variable
	$: colorScale = scaleDiverging(t => interpolateRdBu(1 - t))
		.domain([yExtent[0], 0, yExtent[1]]); // change back to [1, -1] later

	// axes
	// starting at barWidth / 2 because tick marks are aligned with the middle of the rect 
	// for that year. ending at chartWidth + (barWidth / 2) for the same reason
	$: xPath = `M ${(barWidth / 2)} 5 H ${chartWidth + (barWidth / 2)}`;
	let xTicks = ticks(xExtent[0], xExtent[1], 10);

	$: yPath = `M -5 0 V ${chartHeight}`;
	let yTicks = ticks(yExtent[0], yExtent[1], 10);
	
	$: if (currentStep == 1) {
		toggle();
	} else if (currentStep == 3) {
		toggle();
	}

</script>

<div class="chart-container" bind:offsetWidth={width} bind:offsetHeight={height} >
	{#if width}
		<svg {width} {height}>
			<!-- x axis -->
			<g transform="translate({margin.left}, {height - margin.bottom})">
				<path stroke="#ccc" d="{xPath}" fill="none" />
				{#each xTicks as x}
					<g class="xtick" transform="translate({xScale(x) + (0.5 * barWidth)}, 5)">
						<line stroke="#ccc" y2="6" />
						<text dy="20" dx="-17">
							{x}
						</text>
					</g>
				{/each}
			</g>

			<!-- y axis -->
			{#if !isUniform}
				<g transform="translate({margin.left}, {margin.top})" transition:fade>
					<path stroke="#ccc" d="{yPath}" fill="none" />
					{#each yTicks as y} 
						<g class="ytick" transform="translate(-5, {yScale(y)})">
							<line stroke="#ccc" x2="-6" />
							<text text-anchor="end" dx="-10" dy="5">
								{y}
							</text>
						</g>
					{/each}
				</g>
			{/if}

			<!-- actual viz -->
			<!-- height={$tweenedBarHeight[i]}, y={$tweenedY[i]} -->
			<g class="chart" transform="translate({margin.left}, {margin.top})">
				{#each data as d, i}
					<rect 
						x={xScale(xAccessor(d))}
						y={$tweenedY[i]}
						width={barWidth}
						height={$tweenedBarHeight[i]}
						style="fill: {colorScale(yAccessor(d))}"
					/>
				{/each}
			</g>
		</svg>
	{/if}
</div>

<style>
	
	.chart-container {
		height: 100%; /* have to have height here and in code, will break chart otherwise */
		max-width: 100%;
		border-radius: 5px;
		box-shadow: 1px 1px 6px #cecece;
	}

	.xtick text {
		font-weight: 350;
	}

	.ytick text {
		font-weight: 200;
	}

</style>