<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
	<div class="mb-6 rounded-full bg-red-100 p-6">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-14 w-14 text-red-600"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			{#if $page.status === 404}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
				/>
			{:else if $page.status >= 500}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			{/if}
		</svg>
	</div>

	<h1 class="mb-2 text-4xl font-extrabold text-gray-800">
		{#if $page.status === 404}
			Page Not Found
		{:else if $page.status === 500}
			Server Error
		{:else}
			Error {$page.status}
		{/if}
	</h1>

	<p class="mb-8 max-w-md text-lg text-gray-600">
		{#if $page.status === 404}
			The page you are looking for doesn't exist or has been moved.
		{:else if $page.status === 500}
			Our server encountered an error. Please try again later.
		{:else}
			{$page.error?.message || 'Something went wrong.'}
		{/if}
	</p>

	<div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
		<a
			href="/"
			class="rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
		>
			Go to Home
		</a>

		<button
			on:click={() => history.back()}
			class="rounded-md bg-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-300"
		>
			Go Back
		</button>
	</div>
</div>
