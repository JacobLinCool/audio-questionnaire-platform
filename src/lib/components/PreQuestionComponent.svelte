<script lang="ts">
	import type {
		PreQuestion,
		TextQuestionResponse,
		MultipleChoiceQuestionResponse,
		ScaleQuestionResponse
	} from '$lib/types';

	export let question: PreQuestion;
	export let onAnswer: (
		answer: TextQuestionResponse | MultipleChoiceQuestionResponse | ScaleQuestionResponse
	) => void;

	let textValue = '';
	let selectedOption = '';
	let scaleValue: number | null = null;

	function handleSubmit() {
		if (question.type === 'short-answer' || question.type === 'long-answer') {
			onAnswer({
				question: question.question,
				response: textValue
			});
		} else if (question.type === 'multiple-choice') {
			onAnswer({
				question: question.question,
				response: selectedOption
			});
		} else if (question.type === 'scale') {
			if (scaleValue !== null) {
				onAnswer({
					question: question.question,
					response: scaleValue
				});
			}
		}
	}

	function isValid(): boolean {
		if (question.type === 'short-answer' || question.type === 'long-answer') {
			return !!textValue.trim();
		} else if (question.type === 'multiple-choice') {
			return !!selectedOption;
		} else if (question.type === 'scale') {
			return scaleValue !== null;
		}
		return false;
	}
</script>

<div class="question-container">
	<h3 class="mb-4 text-xl font-semibold">{question.question}</h3>

	{#if question.type === 'short-answer'}
		<div class="mb-4">
			<input
				type="text"
				class="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={textValue}
				placeholder="Your answer"
			/>
		</div>
	{:else if question.type === 'long-answer'}
		<div class="mb-4">
			<textarea
				class="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={textValue}
				placeholder="Your answer"
				rows="4"
			></textarea>
		</div>
	{:else if question.type === 'multiple-choice'}
		<div class="mb-4">
			{#each question.options as option, i}
				<div class="mb-2 flex items-center">
					<input
						type="radio"
						id="option{i}"
						name="mcq-option"
						class="mr-2"
						value={option}
						bind:group={selectedOption}
					/>
					<label for="option{i}" class="cursor-pointer">{option}</label>
				</div>
			{/each}
		</div>
	{:else if question.type === 'scale'}
		<div class="mb-4">
			<div class="mb-1 flex justify-between">
				<span>{question.min}</span>
				<span>{question.max}</span>
			</div>
			<input
				type="range"
				class="w-full"
				min={question.min}
				max={question.max}
				step={question.step}
				bind:value={scaleValue}
			/>
			{#if scaleValue !== null}
				<div class="mt-2 text-center">Selected: {scaleValue}</div>
			{/if}
		</div>
	{/if}

	<button
		class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
		on:click={handleSubmit}
		disabled={!isValid()}
	>
		Next
	</button>
</div>
