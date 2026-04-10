import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize clients conditionally
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

export type AIProvider = 'openai' | 'anthropic';
export type AIMode = 'chat' | 'socratic' | 'quiz' | 'case_study' | 'exam_prep';

// System prompts for different modes
const SYSTEM_PROMPTS: Record<AIMode, string> = {
  chat: `You are Dr. Nexus, an advanced AI medical tutor specializing in cardiology and interventional procedures. You are:
- Highly knowledgeable in all aspects of cardiology, including interventional cardiology, structural heart disease, electrophysiology, and cardiac imaging
- Supportive and encouraging, adapting your teaching style to each learner
- Able to explain complex concepts using analogies and visual descriptions
- Focused on evidence-based medicine and current guidelines
- Aware of the latest research and clinical trials

When responding:
- Use clear, concise medical language appropriate for the learner's level
- Provide clinical pearls and practical tips when relevant
- Reference key studies or guidelines when appropriate
- Ask clarifying questions if needed
- Encourage critical thinking

Remember to be conversational but professional, and always prioritize patient safety in your guidance.`,

  socratic: `You are Dr. Nexus in Socratic teaching mode. Instead of giving direct answers, guide the learner to discover the answers through thoughtful questions.

Your approach:
- Ask probing questions that lead to deeper understanding
- Challenge assumptions gently
- Build on partial correct answers
- Use clinical scenarios to test reasoning
- Celebrate correct insights while redirecting misconceptions

Never give away the answer directly. Your goal is to help the learner develop clinical reasoning skills.`,

  quiz: `You are Dr. Nexus in Quiz mode. Generate challenging but fair medical questions.

For each question:
- Create board-style questions with clinical vignettes when appropriate
- Include 4-5 answer options for multiple choice
- Provide detailed explanations after the answer is given
- Reference relevant guidelines or studies
- Vary difficulty based on the topic and learner level

Format your responses clearly with the question, options, and (after answer) explanation.`,

  case_study: `You are Dr. Nexus presenting a clinical case study. Create realistic patient scenarios.

Include:
- Patient demographics and chief complaint
- Relevant history (HPI, PMH, medications, social history)
- Physical exam findings
- Initial diagnostic workup results
- ECG/imaging findings when relevant

Guide the learner through the case with questions about:
- Differential diagnosis
- Additional workup needed
- Management decisions
- Potential complications

Make cases educational but realistic, based on common clinical scenarios.`,

  exam_prep: `You are Dr. Nexus helping prepare for board exams. Focus on high-yield content.

Your approach:
- Identify key topics and common exam themes
- Provide mnemonics and memory aids
- Create practice questions similar to board format
- Highlight frequently tested concepts
- Review both basic science and clinical applications
- Point out common "trap" answers and how to avoid them

Be efficient and focused on exam-relevant material.`,
};

// Medical knowledge context
const MEDICAL_CONTEXT = `
Current guidelines and key facts for cardiology (2024):
- ACC/AHA Guidelines for Chronic Coronary Disease (2023)
- ESC Guidelines for Acute Coronary Syndromes (2023)
- ACC/AHA Guidelines for Heart Failure (2022)
- HRS Guidelines for Cardiac Implantable Electronic Devices

Key clinical trials to reference:
- ISCHEMIA trial: Invasive vs conservative strategy in stable CAD
- FAME series: FFR-guided PCI
- PARTNER/SAPIEN trials: TAVR outcomes
- CASTLE-AF: Catheter ablation for AF in HF

Common medications:
- Antiplatelet: Aspirin, P2Y12 inhibitors (clopidogrel, ticagrelor, prasugrel)
- Anticoagulants: Warfarin, DOACs (apixaban, rivaroxaban, dabigatran)
- Anti-ischemic: Beta-blockers, nitrates, calcium channel blockers
- Heart failure: ACE-I/ARB/ARNI, beta-blockers, MRAs, SGLT2i

Always consider patient-specific factors and contraindications.
`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

// Main chat function with streaming support
export async function* streamChat(
  messages: ChatMessage[],
  mode: AIMode = 'chat',
  provider: AIProvider = 'openai'
): AsyncGenerator<string> {
  const systemPrompt = SYSTEM_PROMPTS[mode] + '\n\n' + MEDICAL_CONTEXT;
  
  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ];

  if (provider === 'openai') {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: fullMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } else {
    // Anthropic Claude
    if (!anthropic) {
      throw new Error('Anthropic API key not configured');
    }
    const stream = await anthropic.messages.stream({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: fullMessages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      system: systemPrompt,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
}

// Non-streaming chat function
export async function chat(
  messages: ChatMessage[],
  mode: AIMode = 'chat',
  provider: AIProvider = 'openai'
): Promise<AIResponse> {
  const systemPrompt = SYSTEM_PROMPTS[mode] + '\n\n' + MEDICAL_CONTEXT;
  
  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ];

  if (provider === 'openai') {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
      model: response.model,
    };
  } else {
    if (!anthropic) {
      throw new Error('Anthropic API key not configured');
    }
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: fullMessages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      system: systemPrompt,
    });

    const textContent = response.content.find(c => c.type === 'text');
    return {
      content: textContent?.type === 'text' ? textContent.text : '',
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      model: response.model,
    };
  }
}

// Generate quiz questions
export async function generateQuizQuestion(
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): Promise<{
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}> {
  const response = await chat([
    {
      role: 'user',
      content: `Generate a ${difficulty}-level multiple choice question about "${topic}" in cardiology. 
      
Return the response in this exact JSON format:
{
  "question": "The full question text with clinical vignette if appropriate",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Detailed explanation of the correct answer and why other options are incorrect"
}`,
    },
  ], 'quiz');

  try {
    // Extract JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error parsing quiz question:', error);
  }

  // Fallback
  return {
    question: 'Error generating question',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    explanation: 'Please try again',
  };
}

// Generate case study
export async function generateCaseStudy(
  topic: string,
  complexity: 'simple' | 'moderate' | 'complex'
): Promise<{
  presentation: string;
  questions: string[];
  keyPoints: string[];
}> {
  const response = await chat([
    {
      role: 'user',
      content: `Generate a ${complexity} clinical case study about "${topic}".

Return the response in this exact JSON format:
{
  "presentation": "Full case presentation including demographics, history, physical exam, and initial workup",
  "questions": ["Question 1 about the case", "Question 2", "Question 3"],
  "keyPoints": ["Key learning point 1", "Key learning point 2", "Key learning point 3"]
}`,
    },
  ], 'case_study');

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error parsing case study:', error);
  }

  return {
    presentation: 'Error generating case',
    questions: [],
    keyPoints: [],
  };
}

// Analyze medical image (placeholder - would need vision API)
export async function analyzeImage(
  imageUrl: string,
  context?: string
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: context || 'Please analyze this medical image and provide relevant clinical insights.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || 'Unable to analyze image';
}

// Get AI feedback on VR surgery performance
export async function getVRSurgeryFeedback(
  scenario: string,
  metrics: {
    duration: number;
    errors: string[];
    techniques: string[];
    scores: Record<string, number>;
  }
): Promise<string> {
  const response = await chat([
    {
      role: 'user',
      content: `As a surgical mentor, provide feedback on a VR surgery simulation performance:

Scenario: ${scenario}
Duration: ${metrics.duration} seconds
Errors: ${metrics.errors.join(', ') || 'None'}
Techniques used: ${metrics.techniques.join(', ')}
Scores: ${JSON.stringify(metrics.scores)}

Provide:
1. Overall assessment
2. Specific areas for improvement
3. Techniques to practice
4. Recommended next scenarios`,
    },
  ], 'chat');

  return response.content;
}

