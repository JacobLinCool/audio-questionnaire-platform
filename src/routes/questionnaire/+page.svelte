<script lang="ts">
	import { onMount } from 'svelte';
	import type { Questionaire, QuestionnaireResponse, PairQuestionResponse } from '$lib/types';
	import PreQuestionComponent from '$lib/components/PreQuestionComponent.svelte';
	import PairQuestionComponent from '$lib/components/PairQuestionComponent.svelte';

	export let data;

	let questionaire: Questionaire = data.questionnaire;
	let error: string | null = null;

	// Track current section and question
	let section: 'pre' | 'pair' | 'post' | 'complete' = 'pre';
	let currentQuestion = 0;
	let currentPair = 0;

	// Store user responses
	let responses: QuestionnaireResponse = {
		qid: questionaire.id,
		tid: '',
		pre: [],
		pair: [],
		post: []
	};

	// Track all audio pairs for testing
	let audioPairs: [string, string][] = [];
	let sampledPairs: [string, string][] = [];

	function shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	onMount(() => {
		try {
			// Generate all possible pairs from audio files
			const audioKeys = Object.keys(questionaire.audios);
			for (let i = 0; i < audioKeys.length; i++) {
				for (let j = i + 1; j < audioKeys.length; j++) {
					audioPairs.push([audioKeys[i], audioKeys[j]]);
				}
			}

			// Sample pairs based on sampleRate
			sampledPairs = audioPairs.filter(
				() => Math.random() <= questionaire.strategy.pair.sampleRate
			);

			// Ensure at least one pair is included
			if (sampledPairs.length === 0 && audioPairs.length > 0) {
				sampledPairs.push(audioPairs[Math.floor(Math.random() * audioPairs.length)]);
			}

			// Now shuffle them in advance
			shuffle(sampledPairs);
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		}
	});

	// Handle answer submission for pre/post questions
	function handlePrePostAnswer(answer: any) {
		if (section === 'pre') {
			responses.pre[currentQuestion] = answer;
		} else if (section === 'post') {
			responses.post[currentQuestion] = answer;
		}

		// Move to next question or section
		navigateNext();
	}

	// Handle pair comparison answers
	function handlePairAnswer(answers: PairQuestionResponse[]) {
		responses.pair.push(...answers);
		// Answers are stored but navigation happens on 'continue' event
	}

	// Navigate to next question or section
	function navigateNext() {
		if (section === 'pre') {
			if (currentQuestion < questionaire.strategy.pre.questions.length - 1) {
				currentQuestion++;
			} else {
				section = 'pair';
				currentQuestion = 0;
				currentPair = 0;
			}
		} else if (section === 'post') {
			if (currentQuestion < questionaire.strategy.post.questions.length - 1) {
				currentQuestion++;
			} else {
				section = 'complete';
				submitResponses();
			}
		}
	}

	// Navigate to the next pair question or move on in the questionnaire
	function navigateNextPair() {
		if (currentPair < sampledPairs.length - 1) {
			currentPair++;
		} else {
			section = 'post';
			currentQuestion = 0;
		}
	}

	// Submit all responses
	async function submitResponses() {
		try {
			const response = await fetch('/api/responses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(responses)
			});

			if (!response.ok) {
				throw new Error('Failed to submit responses');
			}

			// Response successfully submitted
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'Failed to submit responses';
		}
	}

	// Get current progress for pair questions
	function getPairProgress(): number {
		if (!questionaire || !sampledPairs.length) return 0;
		const totalQuestions = questionaire.strategy.pair.questions.length * sampledPairs.length;
		const completedQuestions =
			currentPair * questionaire.strategy.pair.questions.length + currentQuestion;
		return (completedQuestions / totalQuestions) * 100;
	}

	// Get current pair progress description
	function getPairProgressText(): string {
		if (!questionaire || !sampledPairs.length) return '';
		return `Pair ${currentPair + 1}/${sampledPairs.length}`;
	}
</script>

<svelte:head>
	<title>{questionaire.title}</title>
	<meta name="description" content={questionaire.description} />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
	{#if error}
		<div class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<p>{error}</p>
		</div>
	{:else if section === 'complete'}
		<div class="text-center">
			<h2 class="mb-4 text-2xl font-bold">Thank You!</h2>
			<p>Your responses have been submitted successfully.</p>
		</div>
	{:else}
		<header class="mb-8">
			<h1 class="text-3xl font-bold">{questionaire.title}</h1>
			<p class="mt-2 text-gray-600">{questionaire.description}</p>

			<!-- Progress indicator -->
			<div class="mt-6">
				<div class="mb-1 flex justify-between text-sm">
					<span>{section.toUpperCase()}</span>
					{#if section === 'pre'}
						<span>{currentQuestion + 1} / {questionaire.strategy.pre.questions.length}</span>
					{:else if section === 'pair'}
						<span>{getPairProgressText()}</span>
					{:else if section === 'post'}
						<span>{currentQuestion + 1} / {questionaire.strategy.post.questions.length}</span>
					{/if}
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					{#if section === 'pre'}
						<div
							class="h-2 rounded-full bg-blue-600"
							style="width: {((currentQuestion + 1) / questionaire.strategy.pre.questions.length) *
								100}%"
						></div>
					{:else if section === 'pair'}
						<div class="h-2 rounded-full bg-blue-600" style="width: {getPairProgress()}%"></div>
					{:else if section === 'post'}
						<div
							class="h-2 rounded-full bg-blue-600"
							style="width: {((currentQuestion + 1) / questionaire.strategy.post.questions.length) *
								100}%"
						></div>
					{/if}
				</div>
			</div>
		</header>

		<main>
			{#if section === 'pre' && questionaire.strategy.pre.questions.length > 0}
				<PreQuestionComponent
					question={questionaire.strategy.pre.questions[currentQuestion]}
					onAnswer={handlePrePostAnswer}
				/>
			{:else if section === 'pair' && sampledPairs.length > 0 && currentPair < sampledPairs.length}
				<div class="mb-3 text-center text-sm">
					<span class="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800">
						Pair {currentPair + 1} of {sampledPairs.length}
					</span>
				</div>
				{#key currentPair}
					<PairQuestionComponent
						questions={questionaire.strategy.pair.questions}
						selectedPair={sampledPairs[currentPair]}
						audioFiles={questionaire.audios}
						showPreviousAnswers={questionaire.strategy.pair.showPreviousAnswers}
						onAnswer={handlePairAnswer}
						onContinue={navigateNextPair}
					/>
				{/key}
			{:else if section === 'post' && questionaire.strategy.post.questions.length > 0}
				<PreQuestionComponent
					question={questionaire.strategy.post.questions[currentQuestion]}
					onAnswer={handlePrePostAnswer}
				/>
			{/if}
		</main>
	{/if}
</div>

<style>
	.loader {
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 2s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
