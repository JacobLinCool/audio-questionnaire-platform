<script lang="ts">
	import type { PairQuestion, PairQuestionResponse } from '$lib/types';
	import AudioPlayer from './pair-question/AudioPlayer.svelte';
	import SampleSelector from './pair-question/SampleSelector.svelte';
	import ReplayInfo from './pair-question/ReplayInfo.svelte';

	export let questions: PairQuestion[];
	export let selectedPair: [string, string];
	export let audioFiles: Record<string, string>;
	export let showPreviousAnswers: boolean;
	export let onAnswer: (answers: PairQuestionResponse[]) => void;
	export let onContinue: () => void;

	// Phase state for the two-round workflow
	let phase:
		| 'initial'
		| 'first-listening'
		| 'first-answer'
		| 'ready-for-second'
		| 'second-answer'
		| 'complete' = 'initial';

	let audioUrls = selectedPair.map((id) => audioFiles[id]);

	// Store answers for each round; initialize with nulls
	let answersRoundOne: Array<0 | 1 | 2 | null> = Array(questions.length).fill(null);
	let answersRoundTwo: Array<0 | 1 | 2 | null> = Array(questions.length).fill(null);

	function startFirstListening() {
		phase = 'first-listening';
	}

	function handleFirstPlaybackComplete() {
		phase = 'first-answer';
	}

	function submitFirstAnswers() {
		// Check if all questions have been answered
		if (answersRoundOne.some((ans) => ans === null)) return;
		phase = 'ready-for-second';
	}

	function startSecondPhase() {
		phase = 'second-answer';
	}

	function submitSecondAnswers() {
		// Check if all questions have been answered
		if (answersRoundTwo.some((ans) => ans === null)) return;

		// Create response objects for each question
		const responses: PairQuestionResponse[] = questions.map((q, i) => ({
			question: q.question,
			audios: selectedPair,
			round1: answersRoundOne[i]!, // Non-null assertion is safe due to our check above
			round2: answersRoundTwo[i]! // Non-null assertion is safe due to our check above
		}));

		// Send responses to parent component
		onAnswer(responses);
		phase = 'complete';
	}

	// Handle selection for each round
	function handleFirstSelect(e: CustomEvent<0 | 1 | 2>, index: number) {
		answersRoundOne[index] = e.detail;
		answersRoundOne = [...answersRoundOne];
	}

	function handleSecondSelect(e: CustomEvent<0 | 1 | 2>, index: number) {
		answersRoundTwo[index] = e.detail;
		answersRoundTwo = [...answersRoundTwo];
	}
</script>

<div class="pair-question">
	{#if phase === 'initial'}
		<div class="mb-6 text-center">
			<p class="mb-4">Click to start the first listening round.</p>
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={startFirstListening}
			>
				Start First Listening
			</button>

			<!-- Preview of questions added to initial phase -->
			<div class="mt-6">
				<h3 class="mb-2 font-semibold">Questions you'll answer after listening:</h3>
				{#each questions as ques}
					<div class="mb-2 rounded bg-gray-50 p-2">
						<p>{ques.question}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else if phase === 'first-listening'}
		<AudioPlayer {audioUrls} isReplay={false} onComplete={handleFirstPlaybackComplete} />

		<!-- Preview of questions that will be asked -->
		<div class="mt-6">
			<h3 class="mb-2 font-semibold">Questions you'll answer after listening:</h3>
			{#each questions as ques}
				<div class="mb-2 rounded bg-gray-50 p-2">
					<p>{ques.question}</p>
				</div>
			{/each}
		</div>
	{:else if phase === 'first-answer'}
		<div class="mb-6">
			<h3 class="mb-4 font-semibold">Questionnaire Round 1</h3>
			{#each questions as ques, i}
				<div class="mb-4 rounded bg-gray-50 p-3">
					<SampleSelector question={ques} on:select={(e) => handleFirstSelect(e, i)} />
				</div>
			{/each}
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
				on:click={submitFirstAnswers}
				disabled={answersRoundOne.some((ans) => ans === null)}
			>
				Submit Round 1 Answers
			</button>
		</div>
	{:else if phase === 'ready-for-second'}
		<div class="mb-6 text-center">
			<p class="mb-4">
				Get ready for the second round. You'll be able to replay samples while answering.
			</p>
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={startSecondPhase}
			>
				Start Second Round
			</button>

			<!-- Show previous answers while waiting -->
			<div class="mt-6">
				{#if showPreviousAnswers}
					<h3 class="mb-2 font-semibold">Your previous answers:</h3>
					{#each questions as ques, i}
						<div class="mb-2 flex items-center justify-between rounded bg-gray-50 p-2">
							<p>{ques.question}</p>
							<div class="font-medium text-blue-600">
								{#if answersRoundOne[i] === 0}
									No Preference
								{:else if answersRoundOne[i] === 1}
									Sample A
								{:else}
									Sample B
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<h3 class="mb-2 font-semibold">Questions you'll answer again:</h3>
					{#each questions as ques}
						<div class="mb-2 rounded bg-gray-50 p-2">
							<p>{ques.question}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{:else if phase === 'second-answer'}
		<div class="mb-6">
			<h3 class="mb-4 font-semibold">Questionnaire Round 2</h3>

			<!-- Audio player available during the second round -->
			<div class="mb-4 rounded bg-gray-100 p-3">
				<div class="replay-controls">
					<AudioPlayer {audioUrls} isReplay={true} usePlayButton={true} />
				</div>
			</div>

			{#each questions as ques, i}
				<div class="mb-4 rounded bg-gray-50 p-3">
					{#if showPreviousAnswers}
						<ReplayInfo previousSelection={answersRoundOne[i]!} />
					{/if}
					<SampleSelector question={ques} on:select={(e) => handleSecondSelect(e, i)} />
				</div>
			{/each}
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
				on:click={submitSecondAnswers}
				disabled={answersRoundTwo.some((ans) => ans === null)}
			>
				Submit Round 2 Answers
			</button>
		</div>
	{:else if phase === 'complete'}
		<div class="mb-6 text-center">
			<p class="mb-4">Your responses for this audio pair have been recorded.</p>
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={onContinue}
			>
				Continue to Next Pair
			</button>
		</div>
	{/if}
</div>
