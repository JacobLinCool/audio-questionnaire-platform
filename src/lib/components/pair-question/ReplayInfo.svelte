<script lang="ts">
	export let previousSelection: 0 | 1 | 2;

	function getSelectionText(selection: 0 | 1 | 2): string {
		switch (selection) {
			case 0:
				return 'No Preference';
			case 1:
				return 'Sample A';
			case 2:
				return 'Sample B';
			default:
				return 'Unknown';
		}
	}
</script>

<div class="replay-info mb-4 rounded bg-blue-50 p-3">
	<p class="font-medium">Your previous response: {getSelectionText(previousSelection)}</p>
	<p class="mt-1 text-sm text-gray-600">
		Please listen to the samples again and confirm or change your selection.
	</p>
</div>
