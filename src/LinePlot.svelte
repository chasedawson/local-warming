<script>
	// imports 
	import { line, scaleLinear, extent, ticks, bisector } from 'd3';
	import { draw } from 'svelte/transition';
	import TooltipPoint from './TooltipPoint.svelte';
	
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

	// tooltip
	let bisect = bisector((d) => xAccessor(d)).center;

	let m = {x: 0, y: 0};
	let point = {x: xAccessor(data[0]), y: yAccessor(data[0])};
	let tooltip = {width: 0, height: 0};
	let toolipVisible = false;
	let handleMouseMove = (event) => {
		m.x = event.offsetX;
		m.y = event.offsetY;

		// returns closest point to our cur mouse position
		let i = bisect(data, xScale.invert(m.x - margin.left));

		point = {x: xAccessor(data[i]), y: yAccessor(data[i])};
	}

	let handleMouseOver = (event) => {
		toolipVisible = true;
	}

	// TODO: implement
	let handleFocus = (event) => {

	}

	let handleMouseOut = (event) => {
		toolipVisible = false;
	}

	// TODO: implement
	let handleBlur = (event) => {

	}

	let getTooltipDateLabel = (date) => {
		return date.toLocaleString('default', { month: 'long' }) + ", " + date.getFullYear();
	}



</script>

<div 
	class="chart"
	bind:offsetWidth={width}
	bind:offsetHeight={height}
>

	{#if toolipVisible}
		<div 
			bind:offsetWidth={tooltip.width}
			bind:offsetHeight={tooltip.height}
			class="tooltip" 
			style="left: {margin.left + xScale(point.x) - (tooltip.width / 2)}px; top: {margin.top + yScale(point.y) - tooltip.height - 20}px;" 
		>
			<p class="date" >{getTooltipDateLabel(point.x)}</p>
			<hr />
			<p class="co2">{`${point.y} ppm`}</p>

		</div>
	{/if}

	<svg {width} {height} 
	
		on:mousemove={handleMouseMove} 
		on:mouseover={handleMouseOver}
		on:mouseout={handleMouseOut}
		on:focus={handleFocus}
		on:blur={handleBlur}>

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

		{#if toolipVisible}
			<TooltipPoint x={margin.left + xScale(point.x)} y={margin.top + yScale(point.y)} fill="#A31A2C"/>
		{/if}
	</svg>


</div>

<style>
	.chart {
		height: 100%;
		max-width: 100%;
		border-radius: 5px;
		/* box-shadow: 1px 1px 6px #cecece; */
	}

	.axis-label {
		font-weight: 300;
	}

	.ytick text {
		font-weight: 200;
	}

	.xtick text {
		font-weight: 200;
	}

	.tooltip {
		box-shadow: 1px 1px 6px #cecece;
		position: absolute;
		z-index: 10;
		background-color: white;
		padding: 10px;
	}

	.tooltip p {
		padding: 0px 0px 0px 0px;
		margin: 0px;
	}

	.tooltip .date {
		font-weight: 200;
		font-size: 12px;
		text-align: left;
	}

	.tooltip .co2 {
		font-size: 14px;
		text-align: left;
	}

	.tooltip hr {
		border-style: solid none none none;
		border-top: 1px solid #ccc;
		padding: 0px;
		margin-top: 2px;
		margin-bottom: 5px;
	}

</style>