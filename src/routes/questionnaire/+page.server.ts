import { error } from '@sveltejs/kit';
import { getQuestionnaire } from '$lib/server/storage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Questionnaire ID is required');
	}

	const questionnaire = await getQuestionnaire(id);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	return {
		questionnaire
	};
};
