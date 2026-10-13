import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instructions per role
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  mentor: `You are an experienced, encouraging B.Tech Academic Mentor and Senior Engineering Guide. 
You specialize in helping undergraduate engineering students (Computer Science, IT, Electronics, Mechanical, Electrical, Civil) manage their coursework, plan exam revisions, understand semester backlogs/GPA strategies, and conquer campus placement preparations. Provide structured, actionable, and encouraging advice with clear bullet points.`,

  debugger: `You are a Senior Software Engineer and CS Lab Instructor. 
You specialize in Data Structures & Algorithms, C/C++, Java, Python, Web Tech, Database queries (SQL), Operating Systems, and Computer Networks. 
When explaining code or bugs:
1. Identify the exact root cause
2. Provide corrected code blocks with clear syntax
3. Explain the time and space complexity
4. Highlight common edge cases students fail in lab exams or online tests.`,

  viva: `You are a B.Tech Laboratory Examiner and Viva Voce Master.
Your goal is to prepare engineering students to excel in practical lab vivas, internal evaluations, and external project reviews.
For any experiment or topic:
1. Provide top 5-7 most frequently asked viva questions by external professors
2. Give crisp, technically accurate 1-2 sentence answers
3. Highlight tricky trap questions external examiners love to ask
4. Explain the practical real-world application of the experiment.`,

  math: `You are a Professor of Applied Engineering Mathematics and Theoretical Computer Science.
You assist with Discrete Mathematics, Engineering Calculus, Linear Algebra, Probability, Digital Logic, Signals & Systems, and Algorithm Complexity proofs.
Always provide step-by-step derivations, clearly stated formulas, and verify boundary conditions with high mathematical rigor.`
};

// Health and Config Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint (Multi-turn conversational study assistant)
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      role = 'mentor',
      modelPreference = 'gemini-3.5-flash',
      thinking = false,
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'Gemini API key is not configured in the server environment. Please configure GEMINI_API_KEY in the Secrets panel to use AI features.',
      });
      return;
    }

    // Determine model and configuration based on requirements
    // For high thinking or complex tasks, use gemini-3.1-pro-preview with ThinkingLevel.HIGH
    let targetModel = modelPreference;
    let thinkingConfig: { thinkingLevel: ThinkingLevel } | undefined = undefined;

    if (thinking || modelPreference === 'gemini-3.1-pro-preview') {
      targetModel = 'gemini-3.1-pro-preview';
      if (thinking) {
        thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }
    } else if (modelPreference === 'gemini-3.1-flash-lite') {
      targetModel = 'gemini-3.1-flash-lite';
    } else {
      // Default to gemini-3.5-flash for general tasks
      targetModel = 'gemini-3.5-flash';
    }

    const systemInstruction = SYSTEM_INSTRUCTIONS[role] || SYSTEM_INSTRUCTIONS.mentor;

    // Build contents payload preserving conversation history
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user',
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    // Append latest user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const config: any = {
      systemInstruction,
    };

    if (thinkingConfig) {
      config.thinkingConfig = thinkingConfig;
      // Do NOT set maxOutputTokens when using thinkingConfig per guidelines
    }

    let reply = '';
    let usedModel = targetModel;
    let usedThinking = !!thinkingConfig;

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config,
      });
      reply = response.text || 'I could not generate a response. Please try rephrasing your question.';
    } catch (modelError: any) {
      console.warn('Primary model failed, falling back to gemini-3.8-flash:', modelError?.message || modelError);
      try {
        const fallbackConfig: any = {
          systemInstruction,
        };
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: fallbackConfig,
        });
        reply = fallbackResponse.text || 'I could not generate a response.';
        usedModel = 'gemini-3.8-flash';
        usedThinking = false;
      } catch (fallbackErr: any) {
        throw fallbackErr;
      }
    }

    res.json({
      reply,
      modelUsed: usedModel,
      thinkingUsed: usedThinking,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini API',
    });
  }
});

// Image Analysis endpoint (Circuit diagrams, handwritten notes, code bugs, lab experiments)
// Uses gemini-3.1-pro-preview as strictly required
app.post('/api/analyze-image', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      prompt = 'Analyze this engineering diagram, problem, or code snippet in detail. Provide step-by-step breakdown and solutions.',
      thinking = false,
    } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image data (base64) is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'Gemini API key is not configured in the server environment. Please configure GEMINI_API_KEY in the Secrets panel.',
      });
      return;
    }

    // Strip prefix if user passed full data URL (e.g. data:image/png;base64,...)
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const targetModel = 'gemini-3.1-pro-preview';
    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: prompt,
    };

    const config: any = {
      systemInstruction: `You are an expert Engineering Faculty and Research Mentor. 
You inspect engineering diagrams (digital/analog circuits, flowcharts, UML diagrams, network topologies), handwritten notes and formulas, code screenshots, and lab experiment apparatus photos.
Provide high-precision, clear, student-friendly analysis with formulas and step-by-step logic.`,
    };

    if (thinking) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    let analysis = '';
    let usedModel = targetModel;

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [imagePart, textPart],
        },
        config,
      });
      analysis = response.text || 'Unable to analyze image. Please ensure the image is clear and readable.';
    } catch (modelError: any) {
      console.warn('Primary image model failed, falling back to gemini-3.8-flash for vision:', modelError?.message || modelError);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [imagePart, textPart],
          },
          config: {
            systemInstruction: config.systemInstruction,
          },
        });
        analysis = fallbackResponse.text || 'Unable to analyze image.';
        usedModel = 'gemini-3.8-flash';
      } catch (fallbackErr: any) {
        throw fallbackErr;
      }
    }

    res.json({
      analysis,
      modelUsed: usedModel,
      thinkingUsed: thinking,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-image:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze image with Gemini 3.1 Pro',
    });
  }
});

// Study Plan / Viva Generator Endpoint
app.post('/api/study-tools/viva-generator', async (req, res) => {
  try {
    const { subject, experimentTitle, experimentNumber } = req.body;

    if (!subject || !experimentTitle) {
      res.status(400).json({ error: 'Subject and experimentTitle are required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate 6 high-yield Viva Voce questions with concise model answers for B.Tech Practical Lab examination:
Subject: ${subject}
Experiment #${experimentNumber || ''}: ${experimentTitle}

Format as numbered Q&A pairs with practical tips.`,
      config: {
        systemInstruction: 'You are an experienced external lab examiner for engineering universities.',
      },
    });

    res.json({ vivaQnA: response.text });
  } catch (error: any) {
    console.error('Error in viva-generator:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate viva questions' });
  }
});

// Mount Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`B.Tech Productivity Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
