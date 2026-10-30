import { GoogleGenAI } from '@google/genai';
import { getActiveApiKey, isGeminiConfigured, config } from '../config/index.js';
import { AiEvaluationResult, BankQuestion, Difficulty, InteractionType } from '../types/index.js';

export function getGenAIClient(customKey?: string): GoogleGenAI | null {
  const key = customKey || getActiveApiKey();
  if (!key || key.length < 10) return null;
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

/**
 * Helper to ensure Gemini network calls never hang indefinitely.
 */
function withTimeout<T>(promise: Promise<T>, ms: number = 3500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    )
  ]);
}

/**
 * Safely extract JSON from an LLM response string, stripping optional markdown blocks.
 */
export function extractJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }
  return JSON.parse(cleaned);
}

/**
 * Executes a Gemini request using the official Google Gemini Interactions API
 * (Interactions.create) with automatic fallback to client.models.generateContent
 * targeting the gemini-3.8-flash model.
 *
 * Employs a strict 3.5s fail-fast timeout so the candidate never experiences a hanging UI.
 */
export async function executeGeminiPrompt(params: {
  prompt: string;
  isJson?: boolean;
  systemInstruction?: string;
  previousInteractionId?: string;
  client?: GoogleGenAI;
  timeoutMs?: number;
}): Promise<{ text: string; interactionId?: string } | null> {
  const client = params.client || getGenAIClient();
  if (!client) return null;
  const timeout = params.timeoutMs || 3500;

  // 1. Primary: Use official Gemini Interactions API (as recommended by Google)
  try {
    const interactionParams: any = {
      model: config.geminiModel,
      input: params.prompt,
    };
    if (params.previousInteractionId) {
      interactionParams.previous_interaction_id = params.previousInteractionId;
    }
    if (params.systemInstruction) {
      interactionParams.system_instruction = params.systemInstruction;
    }

    const interaction = await withTimeout(client.interactions.create(interactionParams), timeout);
    const text = (interaction as any)?.text || (interaction as any)?.output;
    const interactionId = (interaction as any)?.id;
    if (text) {
      return { 
        text: typeof text === 'string' ? text : JSON.stringify(text), 
        interactionId 
      };
    }
  } catch (err: any) {
    console.warn(`[Gemini Interactions API] Note: ${err?.message || err}. Engaging models.generateContent fallback.`);
  }

  // 2. Secondary: Robust models.generateContent with gemini-3.8-flash
  try {
    const response = await withTimeout(
      client.models.generateContent({
        model: config.geminiModel,
        contents: params.prompt,
        config: {
          ...(params.isJson ? { responseMimeType: 'application/json' } : {}),
          ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
        }
      }),
      timeout
    );

    const text = response.text;
    if (text) {
      return { text };
    }
  } catch (fallbackErr: any) {
    console.warn(`[Gemini generateContent] Notice: ${fallbackErr?.message || fallbackErr}. Seamlessly engaging local technical engine.`);
    return null;
  }

  return null;
}

export interface GeminiValidationResult {
  valid: boolean;
  status: 'connected' | 'network_error' | 'invalid_key';
  message: string;
}

/**
 * Validate an API key by making a test request to Gemini 3.8 Flash with a strict timeout.
 * Intelligently distinguishes invalid key errors from network timeouts and model errors.
 */
export async function validateGeminiApiKey(apiKey: string): Promise<GeminiValidationResult> {
  const trimmed = apiKey.trim();
  if (!trimmed || trimmed.length < 15) {
    return {
      valid: false,
      status: 'invalid_key',
      message: 'API key is too short or invalid format.'
    };
  }
  
  try {
    const client = new GoogleGenAI({ apiKey: trimmed });
    const result = await executeGeminiPrompt({
      prompt: 'Reply with the word "NEXORA_OK" only.',
      client,
      timeoutMs: 4000
    });

    if (result && result.text) {
      return {
        valid: true,
        status: 'connected',
        message: 'Successfully connected to Google Gemini API.'
      };
    }

    return {
      valid: false,
      status: 'network_error',
      message: 'Gemini service returned an empty response. Please check network connectivity.'
    };
  } catch (err: any) {
    const errMsg = (err?.message || String(err)).toLowerCase();
    const errStatus = err?.status || err?.statusCode || (err as any)?.response?.status;

    // Check for explicit invalid key rejection from Google
    const isExplicitInvalidKey =
      errMsg.includes('api_key_invalid') ||
      errMsg.includes('api key not valid') ||
      errMsg.includes('invalid api key') ||
      errMsg.includes('api_key_service_blocked') ||
      errMsg.includes('key is invalid') ||
      (errStatus === 400 && errMsg.includes('key')) ||
      (errStatus === 403 && (errMsg.includes('key') || errMsg.includes('permission')));

    if (isExplicitInvalidKey) {
      return {
        valid: false,
        status: 'invalid_key',
        message: 'The Gemini API key is invalid or revoked by Google.'
      };
    }

    // Rate limits, quota, or model not found: key was successfully authenticated by Google
    if (errStatus === 429 || errMsg.includes('resource_exhausted') || errMsg.includes('quota')) {
      return {
        valid: true,
        status: 'connected',
        message: 'Gemini API key is authenticated (quota rate-limit active).'
      };
    }

    if (errStatus === 404 || errMsg.includes('not found')) {
      return {
        valid: true,
        status: 'connected',
        message: 'Gemini API key is authenticated.'
      };
    }

    // Network timeout or socket error
    const isNetwork =
      errMsg.includes('timeout') ||
      errMsg.includes('fetch failed') ||
      errMsg.includes('enotfound') ||
      errMsg.includes('econnrefused') ||
      errMsg.includes('network') ||
      errMsg.includes('econnreset');

    if (isNetwork) {
      return {
        valid: false,
        status: 'network_error',
        message: 'Network connection to Google Gemini API timed out. Saved key has been preserved.'
      };
    }

    return {
      valid: false,
      status: 'network_error',
      message: err?.message || 'Connection test failed.'
    };
  }
}


/**
 * Robust regex-based and heuristic detector to classify if user input is
 * a meta-command / clarification rather than a technical answer.
 */
export function detectMetaIntent(input: string): InteractionType | null {
  const text = input.trim().toLowerCase();

  // End interview requests
  if (
    /^(end\s*(my\s*)?interview|stop\s*(the\s*)?interview|quit(\s*interview)?|finish\s*(the\s*)?interview|exit(\s*interview)?)/i.test(text) ||
    text === 'end' || text === 'quit' || text === 'exit'
  ) {
    return 'end_request';
  }

  // Skip question
  if (
    /^(skip(\s*this\s*question)?|pass(\s*this\s*question)?|next\s*question|i\s*want\s*to\s*skip)/i.test(text) ||
    text === 'skip' || text === 'pass'
  ) {
    return 'skip_request';
  }

  // Request for hint
  if (
    /\b(give\s*me\s*a\s*hint|need\s*a\s*hint|can\s*i\s*get\s*a\s*hint|provide\s*a\s*hint|hint\s*please|any\s*hint)\b/i.test(text) ||
    text === 'hint'
  ) {
    return 'hint_request';
  }

  // Request for explanation of question / don't understand
  if (
    /\b(explain\s*(the\s*)?question|what\s*does\s*(this|the\s*question)\s*mean|clarify\s*(the\s*)?question|i\s*don'?t\s*understand\s*(the\s*)?question|confused\s*by\s*the\s*question)\b/i.test(text)
  ) {
    return 'explanation_request';
  }

  // Request to repeat question
  if (
    /\b(repeat\s*(the\s*)?question|say\s*(it\s*)?again|what\s*was\s*the\s*question)\b/i.test(text)
  ) {
    return 'repeat_request';
  }

  // Request for an example
  if (
    /\b(give\s*(me\s*)?an\s*example|can\s*you\s*provide\s*an\s*example|show\s*(me\s*)?an\s*example|example\s*please)\b/i.test(text)
  ) {
    return 'example_request';
  }

  return null;
}

/**
 * Call Gemini 3.8 Flash to evaluate a student's answer using official APIs.
 */
export async function evaluateAnswerWithGemini(params: {
  questionText: string;
  topic: string;
  difficulty: string;
  expectedAnswer: string;
  keyPoints: string[];
  maxMarks: number;
  studentAnswer: string;
}): Promise<AiEvaluationResult | null> {
  if (!isGeminiConfigured()) return null;

  const prompt = `You are NEXORA, an expert AI C++ Technical Interviewer.
Evaluate the following student's response in an ongoing technical mock interview.

INTERVIEW CONTEXT:
Topic: ${params.topic}
Difficulty: ${params.difficulty}
Question: "${params.questionText}"
Reference Ideal Points:
${params.keyPoints.map(p => `- ${p}`).join('\n')}
Max Marks: ${params.maxMarks}

STUDENT'S ANSWER:
"${params.studentAnswer}"

INSTRUCTIONS FOR EVALUATION:
1. Understand the student's answer even if written in simple, conversational English, with minor typos, or informal wording.
2. Check technical correctness:
   - If they captured the essential core concept accurately, label "correct".
   - If they captured parts of the concept or missed critical distinctions, label "partially_correct".
   - If fundamentally incorrect, irrelevant, or if they explicitly wrote "I don't know" / "no idea", label "incorrect".
3. Assign marks fairly out of ${params.maxMarks} (e.g. 10/10 for fully correct, 4-7/10 for partially correct, 0-2/10 for incorrect).
4. Provide constructive, friendly, encouraging, and technically precise feedback.
5. Formulate a relevant technical follow-up question related to this concept.
6. Return your evaluation strictly in the following JSON structure:

{
  "isClarificationOrMeta": false,
  "evaluation_status": "correct" | "partially_correct" | "incorrect",
  "marks_awarded": number,
  "maximum_marks": ${params.maxMarks},
  "correct_points": ["string", ...],
  "missing_points": ["string", ...],
  "incorrect_points": ["string", ...],
  "feedback": "string",
  "expected_answer": "string",
  "follow_up_question": "string",
  "next_action": "next_question"
}
`;

  try {
    const res = await executeGeminiPrompt({
      prompt,
      isJson: true,
      systemInstruction: 'You are NEXORA, an intelligent C++ technical mock interview evaluation engine. Always return valid JSON only.'
    });

    if (!res || !res.text) return null;

    const parsed = extractJsonFromText(res.text);
    return {
      isClarificationOrMeta: false,
      evaluation_status: parsed.evaluation_status || 'partially_correct',
      marks_awarded: Math.min(params.maxMarks, Math.max(0, Number(parsed.marks_awarded) || 0)),
      maximum_marks: params.maxMarks,
      correct_points: Array.isArray(parsed.correct_points) ? parsed.correct_points : [],
      missing_points: Array.isArray(parsed.missing_points) ? parsed.missing_points : [],
      incorrect_points: Array.isArray(parsed.incorrect_points) ? parsed.incorrect_points : [],
      feedback: parsed.feedback || 'Good effort. Keep exploring modern C++ patterns.',
      expected_answer: parsed.expected_answer || params.expectedAnswer,
      follow_up_question: parsed.follow_up_question || 'How would you apply this in a high-performance C++ program?',
      next_action: 'next_question',
    };
  } catch (err) {
    console.warn('Gemini answer evaluation failed, engaging local evaluator:', err);
    return null;
  }
}

/**
 * Call Gemini 3.8 Flash to generate a brand new technical C++ question beyond the predefined bank.
 */
export async function generateQuestionWithGemini(params: {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  previousQuestions: string[];
}): Promise<Partial<BankQuestion> | null> {
  if (!isGeminiConfigured()) return null;

  const prompt = `You are NEXORA, an AI C++ Interviewer.
Generate a high quality, fresh technical interview question for:
Topic: ${params.topic}
Difficulty: ${params.difficulty}

Do NOT repeat or closely resemble any of these previously asked questions:
${params.previousQuestions.map(q => `- ${q}`).join('\n')}

Format your response strictly as JSON:
{
  "question": "string",
  "codeSnippet": "optional short C++ code snippet or empty string",
  "expectedAnswer": "concise comprehensive model answer",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "hint": "helpful non-spoiler hint",
  "explanation": "educational concept explanation",
  "maxMarks": 10,
  "followUpPrompt": "potential follow up question"
}`;

  try {
    const res = await executeGeminiPrompt({
      prompt,
      isJson: true,
      systemInstruction: 'You are NEXORA, generating diverse, non-repeating C++ interview questions. Always return valid JSON only.'
    });

    if (!res || !res.text) return null;

    const parsed = extractJsonFromText(res.text);
    if (!parsed.question) return null;

    return {
      question: parsed.question,
      codeSnippet: parsed.codeSnippet || undefined,
      expectedAnswer: parsed.expectedAnswer || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ['Technical understanding of concept'],
      hint: parsed.hint || 'Think about how C++ handles this at compile-time vs run-time.',
      explanation: parsed.explanation || '',
      maxMarks: 10,
      followUpPrompt: parsed.followUpPrompt || undefined,
    };
  } catch (err) {
    console.warn('Gemini question generation failed, using curated bank:', err);
    return null;
  }
}

/**
 * Handle student clarification/hint requests via Gemini 3.8 Flash
 */
export async function generateClarificationWithGemini(params: {
  intent: InteractionType;
  questionText: string;
  topic: string;
  hint?: string;
  userInput: string;
}): Promise<string | null> {
  if (!isGeminiConfigured()) return null;

  let task = 'Provide a subtle, guiding hint without giving away the direct full answer.';
  if (params.intent === 'explanation_request') {
    task = 'Rephrase and explain the interview question in simpler terms with a brief analogy, without answering it.';
  } else if (params.intent === 'example_request') {
    task = 'Provide a small practical scenario or analogy illustrating what the question is asking about, without solving it.';
  }

  const prompt = `You are NEXORA, a friendly, encouraging AI C++ Technical Interviewer.
The student said: "${params.userInput}"
For the question: "${params.questionText}"
Topic: ${params.topic}

Your task: ${task}
Keep your response supportive, brief (2-3 sentences), professional, and invite the student to give their best shot.`;

  try {
    const res = await executeGeminiPrompt({
      prompt,
      isJson: false,
    });
    return res?.text || null;
  } catch (err) {
    console.warn('Gemini clarification generation failed:', err);
    return null;
  }
}
