<script>
	// imports 
	import { line, scaleLinear, extent, ticks } from 'd3';
	import { draw } from 'svelte/transition';
	
	// props
	export let data;
	export let xAccessor;
	export let yAccessor;
	
	// variables
	let width; 
	let height;
	const margin = { top: 50, bottom: 30, left: 50, right: 30 };
	$: chartHeight = height - margin.top - margin.bottom;
	$: chartWidth = width - margin.left - margin.right;
	
	// scales
	let xExtent = extent(data.map(d => xAccessor(d)));
	$: xScale = scaleLinear()
		.domain(xExtent)
		.range([0, chartWidth]);
	
	// let yExtent = extent(data.map(d => yAccessor(d)));
	let yExtent = [310, 420];
	$: yScale = scaleLinear()
		.domain(yExtent)
		.range([chartHeight, 0]);
	
	$: path = line()
		.x(d => xScale(xAccessor(d)))
		.y(d => yScale(yAccessor(d)));

	// axes
	$: xPath = `M 0 0 H ${chartWidth}`;
	let xTicks = ticks(xExtent[0].getFullYear(), xExtent[1].getFullYear(), 10).map(d => new Date(d, 0));
	
	// x axis label formatting
	let xLabel = x => x.getFullYear();

	$: yPath = `M 0 0 V ${chartHeight}`;
	let yTicks = ticks(yExtent[0], yExtent[1], 10);

</script>

<div 
	class="chart"
	bind:offsetWidth={width}
	bind:offsetHeight={height}
>
	<svg {width} {height}>

		<!-- x axis -->
		<g transform="translate({margin.left}, {height - margin.bottom})">
			<path stroke="#ccc" d="{xPath}" fill="none" /> 

			{#each xTicks as x}
			<g class='xtick' transform="translate({xScale(x)},0)">
				<line stroke="#ccc" y2="6" />
				<text dy="20" dx="-20">
					{xLabel(x)}
				</text>
			</g>
			{/each}
		</g>

		<!-- y axis -->
		<g transform="translate({margin.left}, {margin.top})">
			<path stroke="#ccc" d="{yPath}" fill="none" />
			{#each yTicks as y}
			<g class='ytick' transform="translate(0,{yScale(y)})">
				<line stroke="#ccc" x2="-6"/>
				<text dx="-40" dy="6">
					{y}
				</text>
			</g>
			{/each}
		</g>

		<!-- y axis label -->
		<g transform="translate({margin.left}, {margin.top})">
			<text class="axis-label" dy="-20" dx="-10">
				Atmospheric CO2 (ppm)
			</text>
		</g>

		<g class="chart" transform="translate({margin.left}, {margin.top})">
			<path in:draw="{{duration: 8*1000}}"
				d="{path(data)}"
				fill="none"
				stroke="#A31A2C"
				stroke-width=2
				class="co2-line"
			/>
		</g>
	</svg>
</div>

<style>
	.chart {
		height: 100%;
		max-width: 100%;
		border-radius: 5px;
		box-shadow: 1px 1px 6px #cecece;
	}

	.axis-label {
		font-weight: bold;
	}

	.ytick text {
		font-weight: 200;
	}

	.xtick text {
		font-weight: 200;
	}



	/* @keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	} */


</style>