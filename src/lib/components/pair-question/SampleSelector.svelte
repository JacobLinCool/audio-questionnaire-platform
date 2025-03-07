<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { PairQuestion } from '$lib/types';

	export let question: PairQuestion;

	const dispatch = createEventDispatcher<{
		select: 0 | 1 | 2;
	}>();

	let selectedOption: 0 | 1 | 2 | null = null;

	function selectOption(choice: 0 | 1 | 2) {
		selectedOption = choice;
		dispatch('select', choice);
	}
</script>

<div class="sample-selector mb-6">
	<p class="mb-4 text-center">{question.question}</p>

	<div class="sample-selection flex justify-between">
		<div
			class={`sample-option flex-1 ${selectedOption === 1 ? 'selected' : ''}`}
			on:click={() => selectOption(1)}
		>
			<div class="sample-label">Sample A</div>
			<div class="sample-box bg-blue-200"></div>
			<div class="mt-2 text-center">
				<button class="select-button">
					{selectedOption === 1 ? '✓ Selected' : 'Select'}
				</button>
			</div>
		</div>

		{#if question.allowNeutral}
			<div
				class={`sample-option neutral flex-1 ${selectedOption === 0 ? 'selected' : ''}`}
				on:click={() => selectOption(0)}
			>
				<div class="sample-label">No Preference</div>
				<div class="sample-box bg-blue-200"></div>
				<div class="mt-2 text-center">
					<button class="select-button">
						{selectedOption === 0 ? '✓ Selected' : 'Select'}
					</button>
				</div>
			</div>
		{/if}

		<div
			class={`sample-option flex-1 ${selectedOption === 2 ? 'selected' : ''}`}
			on:click={() => selectOption(2)}
		>
			<div class="sample-label">Sample B</div>
			<div class="sample-box bg-blue-200"></div>
			<div class="mt-2 text-center">
				<button class="select-button">
					{selectedOption === 2 ? '✓ Selected' : 'Select'}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.sample-option {
		width: 45%;
		cursor: pointer;
		padding: 10px;
		border-radius: 8px;
		transition: all 0.2s ease;
	}
	.sample-option:hover {
		background-color: #f0f9ff;
	}
	.sample-option.selected {
		background-color: #ebf8ff;
		border: 2px solid #3182ce;
	}
	.sample-option.neutral {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: auto;
		min-width: 100px;
		margin: 0 10px;
	}
	.select-button {
		background-color: #ebf8ff;
		border: 1px solid #3182ce;
		color: #3182ce;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}
	.selected .select-button {
		background-color: #3182ce;
		color: white;
	}
	.sample-box {
		height: 80px;
		border-radius: 8px;
		transition: all 0.3s ease;
	}
</style>
