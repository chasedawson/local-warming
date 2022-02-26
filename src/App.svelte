<script>
	import { onMount } from 'svelte';
	import { csv } from 'd3';
	import { tweened } from 'svelte/motion';
	import LinePlot from './LinePlot.svelte';
	import HeatStripes from './HeatStripes.svelte';
	import ExploreTool from './ExploreTool.svelte';
	import Scroll from './Scrolly.svelte';
	import ScatterPlot from './ScatterPlot.svelte';
	
	// variables
	let data;
	let countyData;
	let dataIsLoaded;
	let countyDataIsLoaded;
	let currentStep;
	let selected;
	let stepTracker = [undefined, undefined];
	
	// only ever want one sounds / media file to be played at once, so 
	// create global var to control setting and playing of media
	let audio;
	
	// functions
	const loadData = () => {
		return Promise.all([
			csv('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/global_temp_mod.csv'),
			csv('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/co2_mm_mlo.csv'),
			csv('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/local_temp_v.csv')
		]);
	}
	
	onMount(() => {
		loadData().then(files => {

			data = {
				global_temp: files[0],
				co2: files[1],
				local_temp: files[2]
			};

			dataIsLoaded = true;
		});
	});
	
	const steps = [
		[
			"<p>general intro/overview of climate change and relationship between greenhouse gases (ghgs) and global temperature</p>",
			"<p>explain 1.5 / 2 degrees warming in Celcius, what does it mean, why was it chosen, in relation to what?</p>",
			"<p>Play Audio?</p>",
			"<p>Pausing Audio!</p>"
		],
		[
			"<p>description of a heatstripe chart</p>",
			"<p>Toggle!</p>",
			"<p>what does a warmer year sound like?</p>",
			"<p>Toggle Again!</p>"
		]
	];
	
	$: if (stepTracker[0] == 0) {
		
	} else if (stepTracker[0] == 1) {
		
	} else if (stepTracker[0] == 2) {
		// audio = new Audio('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/co2.mp3');
		// audio.play();
	} else if (stepTracker[0] == 3) {
		if (audio) audio.pause();
	} else if (stepTracker[1] == 2) {
		// audio = new Audio('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/warm_year.mp3');
		// audio.play();
	} else if (stepTracker[1] == 3) {
		// if (audio) audio.pause();
	}
	
	let counties = [3, 65, 79, 109, 125, 540];
	
	
	
</script>

<section>
	<div class="header">
		<h1>
			<span style="text-decoration: line-through">Global</span> Local Warming
		</h1>
		<h2>
			By Chase Dawson
		</h2>
	</div>
	
	<div class="section-container">
		<div class="steps-container">
			<Scroll bind:value={stepTracker[0]}>
				{#each steps[0] as text, i}
				<div class="step" class:active={stepTracker[0] === i}>
					<div class="step-content">
						{@html text}
					</div>
				</div>
				{/each}
			</Scroll>
		</div>
		<div class="sticky">
			{#if dataIsLoaded}
				<!-- <ScatterPlot {data} xAccessor="{d => +d.all_co2_emissions}" yAccessor="{d => +d.temp_diff}" /> -->
				<div class='graphic1-container'>
					<LinePlot 
						data={data.co2}
						xAccessor={d => new Date(+d.year, +d.month - 1)}
						yAccessor={d => +d.average}
					/>
				</div>	
			{:else}
				<p>
					Loading ... 
				</p>
			{/if}
		</div>
	</div>
	
	<div class="spacer" />
	
	<div class="section-container">
		<div class="steps-container">
			<Scroll bind:value={stepTracker[1]}>
				{#each steps[1] as text, i}
				<div class="step" class:active={stepTracker[1] === i}>
					<div class="step-content">
						{@html text}
					</div>
				</div>
				{/each}
			</Scroll>
		</div>
		<div class="sticky">
			{#if dataIsLoaded}
				<div class="graphic2-container">
					<HeatStripes 
						data={data.global_temp} currentStep={stepTracker[1]}
						xAccessor={d => +d.Year}
						yAccessor={d => +d.Value}
					/>
				</div>
			{:else}
				<p>
					Loading ...
				</p>
			{/if}
		</div>
	</div>
	
	<div class="spacer" />

	{#if dataIsLoaded}
		<ExploreTool {data} {audio} />
	{:else}
		<p>
			Loading...
		</p>
	{/if}
	
	<!-- <div class="explore">
		<div>
			<h4>
				explore cville region counties
			</h4>
		</div>
		<select bind:value={selected}>
			{#each counties as d}
				<option value={d}>{d}</option>
			{/each}
		</select>
		{#if dataIsLoaded}
			<HeatStripes 
				data={data.local_temp.filter(d => +d.county === selected)}
				xAccessor={d => +d.year}
				yAccessor={d => +d.Avg_Tempmax_anomaly}/>
		{:else}
		<p>
			Loading ...
		</p>
		{/if}
	</div> -->

</section>

<style>
	.header {
		height: 80vh;
		display: flex;
		flex-direction: column;
		place-items: center;
		margin-top: 20vh;
	}
	
	.header h2 {
		margin-top: 0%;
		font-weight: 200;
	}
	.sticky {
		position: sticky;
		top: 10%;
		flex: 1 1 60%;
		width: 60%;
	}
	
	.section-container {
		margin-top: 1em;
		text-align: center;
		transition: background 100ms;
		display: flex;
	}

	.step {
		height: 80vh;
		display: flex;
		place-items: center;
		justify-content: center;
	}
	
	.step-content {
		background: whitesmoke;
		color: #ccc;
		border-radius: 5px;
		padding: 0.5rem 1rem;
		display: flex;
		flex-direction: column;
		transition: background 500ms ease;
		box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
		z-index: 10;
		text-align: left;
		width: 75%;
		margin: auto;
		max-width: 500px;
	}
	
	.step.active .step-content {
		background: white;
		color: black;
	}
	
	.steps-container, .sticky {
		height: 100%;
	}
	
	.steps-container {
		flex: 1 1 40%;
		z-index: 10;
	}
	
	.spacer {
		height: 40vh;
	}
	
	.explore {
		height: 100vh;
	}

	.graphic1-container {
		height: 80vh;
	}

	.graphic2-container {
		height: 60vh;
	}


</style>



