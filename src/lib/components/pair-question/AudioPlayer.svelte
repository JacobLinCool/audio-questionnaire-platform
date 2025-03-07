<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let audioUrls: string[];
	export let isReplay: boolean = false;
	export let onComplete: () => void = () => {};
	export let usePlayButton: boolean = false;

	let audioElements: HTMLAudioElement[] = [];
	let currentStep = 0;
	let isPlaying = false;
	let currentAudio: HTMLAudioElement | null = null;
	let playbackSessionActive = false;

	onMount(() => {
		// Create audio elements for both samples
		audioElements = audioUrls.map((url) => {
			const audio = new Audio(url);
			audio.addEventListener('ended', handleAudioEnded);
			return audio;
		});

		if (!usePlayButton && !isReplay) {
			startPlaybackSession();
		}
	});

	onDestroy(() => {
		// Clean up audio elements
		audioElements.forEach((audio) => {
			audio.pause();
			audio.removeEventListener('ended', handleAudioEnded);
		});
	});

	function startPlaybackSession() {
		currentStep = 0;
		playbackSessionActive = true;
		playCurrentAudio();
	}

	function playCurrentAudio() {
		if (currentStep < 2) {
			currentAudio = audioElements[currentStep];
			isPlaying = true;

			// Reset and play
			currentAudio.currentTime = 0;
			currentAudio.play().catch((err) => console.error('Failed to play audio:', err));
		}
	}

	function handleAudioEnded() {
		isPlaying = false;

		// If first sample finished, wait before playing the next sample
		if (currentStep === 0) {
			setTimeout(() => {
				currentStep++;
				playCurrentAudio();
			}, 1000);
		} else {
			// Both samples have been played; notify parent
			setTimeout(() => {
				playbackSessionActive = false; // Only now mark the entire session as complete
				onComplete();
			}, 500);
		}
	}
</script>

<div class="audio-player mb-6">
	{#if usePlayButton && !playbackSessionActive}
		<div class="mt-6 flex w-full flex-col items-center justify-center">
			<button
				class="play-button flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={startPlaybackSession}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mr-2"
				>
					<polygon points="5 3 19 12 5 21 5 3"></polygon>
				</svg>
				Play Samples
			</button>
		</div>
	{:else}
		<div class="mb-4 text-center text-lg font-medium">
			{#if isPlaying}
				<p>
					{isReplay ? 'Re-playing' : 'Playing'} Sample {currentStep === 0 ? 'A' : 'B'}
				</p>
			{:else if playbackSessionActive}
				{#if currentStep === 0}
					<p>Preparing to play samples...</p>
				{:else if currentStep === 1}
					<p>Transitioning to next sample...</p>
				{/if}
			{:else}
				<p>Playback complete</p>
			{/if}
		</div>

		<div class="mt-4 flex justify-between">
			<div class="sample-container">
				<div class="sample-label">Sample A</div>
				<div
					class={`sample-box ${isPlaying && currentStep === 0 ? 'pulse bg-blue-500' : 'bg-blue-200'}`}
				></div>
			</div>
			<div class="sample-container">
				<div class="sample-label">Sample B</div>
				<div
					class={`sample-box ${isPlaying && currentStep === 1 ? 'pulse bg-blue-500' : 'bg-blue-200'}`}
				></div>
			</div>
		</div>
	{/if}
</div>

<style>
	.sample-container {
		width: 45%;
		text-align: center;
	}
	.sample-label {
		font-weight: 500;
		margin-bottom: 8px;
	}
	.sample-box {
		height: 80px;
		border-radius: 8px;
		transition: all 0.3s ease;
	}
	.pulse {
		animation: pulse-animation 1.5s infinite;
	}
	@keyframes pulse-animation {
		0% {
			box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
		}
	}
</style>
