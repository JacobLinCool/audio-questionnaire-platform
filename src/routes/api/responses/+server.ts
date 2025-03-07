import type { RequestHandler } from '@sveltejs/kit';
import type { QuestionnaireResponse } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';
import { saveResponse } from '$lib/server/storage';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = (await request.json()) as QuestionnaireResponse;

		if (!data.qid) {
			return new Response(JSON.stringify({ error: 'Missing questionnaire ID' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		data.tid = uuidv4();

		await saveResponse(data);

		return new Response(JSON.stringify({ success: true, message: 'Response saved successfully' }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error processing questionnaire response:', error);

		return new Response(JSON.stringify({ error: 'Failed to process response' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
