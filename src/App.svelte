<script>
	import { onMount } from 'svelte';
	import { csv } from 'd3';
	import LinePlot from './LinePlot.svelte';
	import HeatStripes from './HeatStripes.svelte';
	import ExploreTool from './ExploreTool.svelte';
	import Scroll from './Scrolly.svelte';
	import MultiStripes from './MultiStripes.svelte';
	
	// variables
	let data;
	let dataIsLoaded;
	let stepTracker = [undefined, undefined, undefined];
	let isPlaying = false;
	
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
			"<p>Global warming first became a public issue on June 23, 1988, when the undeniable link between greenhouse gas emissions and global temperatures was presented before the U.S. Senate Energy and Natural Resources Committee. Of course, this was hardly the first time anyone had spoken about the issue, yet it marked the moment in which the climate crisis entered public consciousness. </p>",
			"<p>By now, most of us are all too familiar with the chart on the right, marking the steady, ever-increasing carbon dioxide (CO2) emissions in our atmosphere. CO2 is just one of many greenhouse gasses emitted by human activities, but it is our most abundantly produced. </p>",
			"<p>n this story, we’re asking not just how CO2 has impacted global temperatures but also how is global warming impacting  us here in Charlottesville? We combine audio and visual techniques so that you’re not just seeing the changes in your community–you’re hearing them as well. Hopefully, you walk away with a greater understanding of how global warming is going to affect you here, locally. </p>",
			"<p>To accomplish that, you must get acquainted with the audio  elements. Use the play button below to hear our encoding of CO22. We mapped the CO2 levels in parts per million to the pitch of a siren-y note–you should hear it get higher and higher with time.  </p>"
		],
		[
			"<p>Carbon dioxide is only part of the picture. To better understand the relationship between greenhouse gasses and warming, we also need to look at global temperature. </p>",
			"<p>Temperature anomaly is a common way of talking about warming relative to the baseline period, often preindustrial times. Each stripe represents temperature change in °Celsius relative to the 20th century average.</p>",
			"<p>Use the play button below to hear our encoding of temperature. We mapped temperature anomalies to a melody played in varying octaves. A year lasts 4 beats, with higher sounding melodies meaning that year was warmer.</p>",
		],
		[
			"<p>To understand the impact of climate change here in Charlottesville, we examine the local data and compute temperature anomalies relative to the 20th century average. Local data is a bit noisier, which is why these heat stripes aren’t as smooth a gradient. </p>",
			"<p>Finally, keep scrolling to use the audio-visual tool below to hear how climate change has impacted your community. Parts of the sonificiation are overlaid with media recordings from that year to provide greater context. For example, in 2005 you’ll hear a short clip from a White House press briefing following the aftermath of hurricane Katrina.</p>"
		]
	];
	
	$: if (stepTracker[0] == 0) {
		
	} else if (stepTracker[0] == 1) {
		
	} else if (stepTracker[0] == 2) {
		// audio = new Audio('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/co2.mp3');
		// audio.play();
	} else if (stepTracker[0] == 3) {
		
	} else if (stepTracker[1] == 2) {
		// audio = new Audio('https://raw.githubusercontent.com/chasedawson/supreme-disco/main/warm_year.mp3');
		// audio.play();
	} else if (stepTracker[1] == 3) {
		// if (audio) audio.pause();
	}
	
	let counties = [3, 65, 79, 109, 125, 540];

	let co2_audio; 
	let isCO2Playing = false;
	let toggleCO2 = () => {
		if (co2_audio) co2_audio.pause();
		if (!isCO2Playing) {
			let src = 'data/co2_isolated.wav';
			co2_audio = new Audio(src);
			co2_audio.onended = () => {
				isCO2Playing = false;
			}
			co2_audio.play();
		}
		isCO2Playing = !isCO2Playing;
	}

	let heat_audio;
	let isHeatPlaying = false;
	let toggleHeat = () => {
		if (heat_audio) heat_audio.pause();
		if (!isHeatPlaying) {
			let src = 'data/heat_isolated.wav';
			heat_audio = new Audio(src);
			heat_audio.onended = () => {
				isHeatPlaying = false;
			}
			heat_audio.play();
		}
		isHeatPlaying = !isHeatPlaying;
	}

	let togglePlay = (i) => {
		// always pause in case something else is playing
		if (audio) audio.pause();

		// if not currently playing, start playing
		if (!isPlaying) {
			if (i == 0) { // play co2 isolated
				let src = 'data/co2_isolated.wav';
				audio = new Audio(src);
				audio.play();
			} else if (i == 1) { // play heat isolated
				let src = 'data/heat_isolated.wav';
				audio = new Audio(src);
				audio.play();
			}
		}

		// toggle isPlaying
		isPlaying = !isPlaying;
	}
	
	
	
</script>

<section>
	<div class="header">
		<div class="title">
			<h1>
				<span style="text-decoration: line-through">Global</span> Local Warming
			</h1>
			<h3>
				By Chase Dawson
			</h3>
		</div>

		<div class="img-container">
			<img src='data/everyoneatwall_cropped.jpeg' alt="">
		</div>

		<div class="description">
			<p>Painted by a collaboration between local youth participating in the Boys & Girls Club summer camp, the Community Climate Collaborative (C3), and James "Jae" Johnson of the Bridge Progressive Arts Initiative, this mural located on the Red Cross building in the Rose Hill neigborhood of Charlottesville depicts 123 years of local climate change.</p>
			<p>This project, by the Democratization of Data Initiative at the Equity Center, builds on that art project and explores the underlying climate data, applying audio-visual techniques to give viewers more ways to experience how the local climate is changing. </p>
		</div>
	</div>
	
	<div class="section-container">
		<div class="steps-container">
			<Scroll bind:value={stepTracker[0]}>
				{#each steps[0] as text, i}
				<div class="step" class:active={stepTracker[0] === i}>
					<div class="step-content">
						{@html text}
						<!-- add play button on correct step -->
						{#if i == 3}
							<button class="play-btn" on:click={toggleCO2}>
								{isCO2Playing ? "stop" : "play"}
							</button>
						{/if}
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
						{#if i === 2}
							<button class="play-btn" on:click={toggleHeat}>
								{isHeatPlaying ? "stop" : "play"}
							</button>
						{/if}
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

	<div class="section-container">
		<div class="steps-container">
			<Scroll bind:value={stepTracker[2]}>
				{#each steps[2] as text, i}
				<div class="step" class:active={stepTracker[2] === i}>
					<div class="step-content">
						{@html text}
					</div>
				</div>
				{/each}
			</Scroll>
		</div>
		<div class="sticky">
			{#if dataIsLoaded}
				<div class="graphic3-container">
					<MultiStripes data={data.local_temp} />
				</div>
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
		height: 90vh;
		display: flex;
		flex-direction: column;
		place-items: center;
		margin-top: 10vh;
	}

	.title {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 20px;
		box-shadow: 1px 1px 6px #cecece;
		padding: 20px;
		border-radius: 10px;
	}

	.title h1 {
		margin: 0px 5px 0px 0px;
	}
	
	.header h3 {
		margin: 0px 0px 5px 0px;
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

	.graphic3-container {
		height: 60vh;
	}

	.img-container img {
		height: 400px;
	}

	.header .description {
		width: 50%
	}

</style>



