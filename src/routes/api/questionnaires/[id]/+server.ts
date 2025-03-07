import type { RequestHandler } from '@sveltejs/kit';
import { getQuestionnaire } from '$lib/server/storage';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (!id) {
		return new Response(JSON.stringify({ error: 'Questionnaire ID is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	const questionnaire = await getQuestionnaire(id);

	if (!questionnaire) {
		return new Response(JSON.stringify({ error: 'Questionnaire not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(JSON.stringify(questionnaire), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
