export interface Questionaire {
	/** Unique identifier for the questionnaire */
	id: string;
	/** Title of the questionnaire */
	title: string;
	/** Description of the questionnaire */
	description: string;

	/** List of audio file URLs associated with the questionnaire */
	audios: Record<string, string>;

	strategy: {
		pre: {
			/** List of pre-questions */
			questions: PreQuestion[];
		};
		/** List of pre-questions for the pair comparison */
		pair: {
			/** List of pair questions */
			questions: PairQuestion[];
			/** Sample rate for the audio files, 0 to 1. */
			sampleRate: number;
			/** Allows re-playing the audio after the first ask */
			allowReplay: boolean;
			/** Show previous answers when re-playing */
			showPreviousAnswers: boolean;
			/** Additional questions to ask in re-playing phase */
			additionalQuestions: Question[];
		};
		post: {
			/** List of post-questions */
			questions: PreQuestion[];
		};
	};
}

export type Question = PreQuestion | PairQuestion;

export type PreQuestion =
	| ShortAnswerQuestion
	| LongAnswerQuestion
	| MultipleChoiceQuestion
	| ScaleQuestion;

export interface ShortAnswerQuestion {
	/** Type of the question */
	type: 'short-answer';
	/** The question text */
	question: string;
}

export interface LongAnswerQuestion {
	/** Type of the question */
	type: 'long-answer';
	/** The question text */
	question: string;
}

export interface MultipleChoiceQuestion {
	/** Type of the question */
	type: 'multiple-choice';
	/** The question text */
	question: string;
	/** List of options for the multiple-choice question */
	options: string[];
}

export interface ScaleQuestion {
	/** Type of the question */
	type: 'scale';
	/** The question text */
	question: string;
	/** Minimum value for the scale */
	min: number;
	/** Maximum value for the scale */
	max: number;
	/** Step value for the scale */
	step: number;
}

export interface PairQuestion {
	/** Type of the question */
	type: 'pair';
	/** The question text */
	question: string;
	/** Whether neutral responses are allowed */
	allowNeutral: boolean;
}

export interface QuestionnaireResponse {
	/** Unique identifier for the questionnaire */
	qid: string;
	/** Unique identifier for the tester */
	tid: string;
	/** List of pre-question responses */
	pre: QuestionResponse[];
	/** List of pair question responses */
	pair: PairQuestionResponse[];
	/** List of post-question responses */
	post: QuestionResponse[];
}

export type QuestionResponse =
	| TextQuestionResponse
	| ScaleQuestionResponse
	| MultipleChoiceQuestionResponse;

export interface TextQuestionResponse {
	/** The question text */
	question: string;
	/** The response text */
	response: string;
}

export interface ScaleQuestionResponse {
	/** The question text */
	question: string;
	/** The response value */
	response: number;
}

export interface MultipleChoiceQuestionResponse {
	/** The question text */
	question: string;
	/** The selected option */
	response: string;
}

export interface PairQuestionResponse {
	/** The question text */
	question: string;
	/** The audio file IDs for the pair being compared */
	audios: [string, string];
	/**
	 * First round response
	 * 0 = neutral/no preference
	 * 1 = prefers first sample (A)
	 * 2 = prefers second sample (B)
	 */
	round1: 0 | 1 | 2;
	/**
	 * Second round response
	 * 0 = neutral/no preference
	 * 1 = prefers first sample (A)
	 * 2 = prefers second sample (B)
	 */
	round2: 0 | 1 | 2;
}
