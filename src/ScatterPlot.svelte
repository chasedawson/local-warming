<script>
	// imports
	import { scaleLinear, extent } from 'd3';
	
	// props
	export let data;
	export let xAccessor;
	export let yAccessor; 
	export let fillAccessor;
	
	// variables
	let width; 
	let height;
	const margin = { top: 30, bottom: 30, left: 30, right: 30 };
	
	// scales
	let xExtent = extent(data.map(d => xAccessor(d)));
	$: xScale = scaleLinear()
		.domain(xExtent)
		.range([margin.left, width - margin.right]);
	
	let yExtent = extent(data.map(d => yAccessor(d)));
	$: yScale = scaleLinear()
		.domain(yExtent)
		.range([height - margin.top, margin.bottom]);
	
	$: console.log(xExtent);
	$: console.log(yExtent);
	$: console.log(width, height);

</script>

<div 
	class="chart"
	bind:offsetWidth={width}
	bind:offsetHeight={height}
>
	<svg {width} {height}>
		{#each data as d}
			<circle cx="{xScale(xAccessor(d))}"
							cy="{yScale(yAccessor(d))}"
							r="5" />
		{/each}
	</svg>
	
</div>

<style>
	.chart {
		height: 80vh;
		max-width: 100%;
		border-radius: 5px;
		box-shadow: 1px 1px 6px #cecece;
	}
</style>
