import { env } from '$env/dynamic/private';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { QuestionnaireResponse, Questionaire } from '$lib/types';
import { getAccessToken } from 'web-auth-library/google';

const SPREADSHEET_ID = env.GOOGLE_SPREADSHEET_ID;
const GOOGLE_CLIENT_EMAIL = env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

class JWT {
	constructor(private options: { email: string; key: string; scopes: string[] }) {}
	async getRequestHeaders() {
		const token = await getAccessToken({
			credentials: {
				type: 'service_account',
				project_id: '',
				private_key_id: '',
				client_id: '',
				client_email: this.options.email,
				private_key: this.options.key,
				auth_uri: 'https://accounts.google.com/o/oauth2/auth',
				token_uri: 'https://oauth2.googleapis.com/token',
				auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
				client_x509_cert_url: ''
			},
			scope: this.options.scopes
		});
		return {
			Authorization: `Bearer ${token}`
		};
	}
}

async function getSpreadsheet() {
	if (!SPREADSHEET_ID) {
		throw new Error('GOOGLE_SPREADSHEET_ID environment variable is not set');
	}

	if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
		throw new Error('Google credentials are not set');
	}

	const jwt = new JWT({
		email: GOOGLE_CLIENT_EMAIL,
		key: GOOGLE_PRIVATE_KEY,
		scopes: [
			'https://www.googleapis.com/auth/spreadsheets',
			'https://www.googleapis.com/auth/drive.file'
		]
	});

	const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwt);
	await doc.loadInfo();
	return doc;
}

async function getOrCreateWorksheet(qid: string) {
	const doc = await getSpreadsheet();

	let sheet = Object.values(doc.sheetsByTitle).find((s) => s.title === qid);

	if (!sheet) {
		sheet = await doc.addSheet({ title: qid, headerValues: ['timestamp', 'qid', 'tid', 'data'] });
	}

	return sheet;
}

export async function saveResponse(response: QuestionnaireResponse): Promise<void> {
	const sheet = await getOrCreateWorksheet(response.qid);

	await sheet.addRow({
		timestamp: new Date().toISOString(),
		qid: response.qid,
		tid: response.tid,
		data: JSON.stringify(response)
	});
}

export async function getQuestionnaire(id: string): Promise<Questionaire | null> {
	try {
		const doc = await getSpreadsheet();

		// Get the questionnaires worksheet
		const sheet = doc.sheetsByTitle['questionnaires'];
		if (!sheet) {
			console.error('Questionnaires worksheet not found');
			return null;
		}

		// Load the rows
		await sheet.loadCells();
		const rows = await sheet.getRows();

		// Find the questionnaire with the matching ID
		const row = rows.find((row) => row.get('id') === id);
		if (!row) {
			return null;
		}

		// Parse the JSON data
		const data = row.get('data');
		if (!data) {
			return null;
		}

		return JSON.parse(data) as Questionaire;
	} catch (error) {
		console.error('Error fetching questionnaire:', error);
		return null;
	}
}

export async function getAllQuestionnaireIds(): Promise<string[]> {
	try {
		const doc = await getSpreadsheet();

		// Get the questionnaires worksheet
		const sheet = doc.sheetsByTitle['questionnaires'];
		if (!sheet) {
			console.error('Questionnaires worksheet not found');
			return [];
		}

		// Load the rows
		const rows = await sheet.getRows();

		// Extract all IDs
		return rows.map((row) => row.get('id')).filter(Boolean) as string[];
	} catch (error) {
		console.error('Error fetching questionnaire IDs:', error);
		return [];
	}
}
