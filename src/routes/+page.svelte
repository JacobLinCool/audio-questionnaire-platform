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
			<h1 class="mb-4 text-4xl font-bold text-gray-900">Music Rhythm Preference Test</h1>
			<p class="text-lg text-gray-600">
				A platform for evaluating melody and rhythm alignment preferences
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl">
				<h2 class="mb-3 text-2xl font-bold text-gray-800">Take the Test</h2>
				<p class="mb-6 text-gray-600">
					Compare different audio clips and provide your preferences on melody and rhythm alignment
					techniques.
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
					This platform allows researchers to collect data on preferences for melody and rhythm
					segment alignment techniques. Participants listen to pairs of audio clips and rate them
					based on alignment quality, rhythm flow, and overall listening experience.
				</p>
				<p>
					The study specifically explores how different rhythm (drum) settings affect the listening
					experience. Data is securely stored and can be visualized in real-time through the
					dashboard, providing immediate insights into preference patterns and response
					distributions.
				</p>
			</div>
		</div>
	</div>
</div>
