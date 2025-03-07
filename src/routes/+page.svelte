<script lang="ts">
	import { goto } from '$app/navigation';

	function navigateToQuestionnaire() {
		goto('/questionnaire');
	}

	function navigateToDashboard() {
		goto('/dashboard');
	}
</script>

<div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
	<div class="mx-auto max-w-3xl">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">Audio Preference Test</h1>
			<p class="text-lg text-gray-600">A platform for evaluating music or speech preferences</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl">
				<h2 class="mb-3 text-2xl font-bold text-gray-800">Take the Test</h2>
				<p class="mb-6 text-gray-600">
					Compare different audio clips and provide your preferences.
				</p>
				<button
					on:click={navigateToQuestionnaire}
					class="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
				>
					Start Questionnaire
				</button>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl">
				<h2 class="mb-3 text-2xl font-bold text-gray-800">View Results</h2>
				<p class="mb-6 text-gray-600">
					Explore visualized data and insights from all participants' responses.
				</p>
				<button
					on:click={navigateToDashboard}
					disabled={true}
					class="w-full rounded-md bg-green-600 py-2 text-white transition hover:bg-green-700"
				>
					View Dashboard
				</button>
			</div>
		</div>

		<div class="mt-12 rounded-lg bg-blue-50 p-6 shadow-md">
			<h2 class="mb-3 text-xl font-bold text-blue-800">About This Project</h2>
			<div class="prose text-blue-900">
				<p>
					This platform allows researchers to collect data on preferences for audio clips.
					Participants can listen to different samples and indicate their preferences. The data
					collected will be used for research purposes only. Your responses will remain anonymous
					and confidential.
				</p>
			</div>
		</div>
	</div>
</div>
