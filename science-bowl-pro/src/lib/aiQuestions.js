/**
 * AI Question Generation Service
 * Generates unlimited Science Bowl questions using LLM in background batches.
 */
import { base44 } from "@/api/base44Client";

const queues = {}; // subject+level -> array of questions
const generating = {}; // subject+level -> boolean

const BATCH_SIZE = 8;
const REFILL_THRESHOLD = 3;

function key(subject, level) {
  return `${subject}_${level}`;
}

export function getQueueLength(subject, level) {
  return queues[key(subject, level)]?.length || 0;
}

async function generateBatch(subject, level) {
  const k = key(subject, level);
  if (generating[k]) return;
  generating[k] = true;

  const levelDesc = level === "MS" ? "Middle School (grades 6-8)" : "High School (grades 9-12)";
  const topicMap = {
    Biology: "cell biology, genetics, ecology, evolution, anatomy, physiology, botany, microbiology",
    Chemistry: "atomic structure, periodic table, chemical bonding, reactions, stoichiometry, thermochemistry, acids/bases, electrochemistry",
    Physics: "mechanics, kinematics, forces, energy, waves, sound, optics, electricity, magnetism, modern physics",
    "Earth & Space": "geology, plate tectonics, weather, atmosphere, oceanography, astronomy, solar system, cosmology",
    Math: "algebra, geometry, trigonometry, calculus, statistics, number theory, combinatorics, probability",
    Energy: "thermodynamics, renewable energy, nuclear energy, electricity generation, energy conservation, fossil fuels",
  };

  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert Science Bowl question writer for ${levelDesc} competitions. Generate ${BATCH_SIZE} high-quality Science Bowl questions for the subject: ${subject}.

Topics to draw from: ${topicMap[subject] || subject}

Rules:
- Mix Multiple Choice (MC) and Short Answer (SA) questions roughly 60/40
- MC questions MUST have exactly 4 options labeled W, X, Y, Z (Science Bowl format) — ALWAYS populate the options object for MC questions
- For MC questions, the "answer" field MUST be exactly one letter: W, X, Y, or Z — NOT the answer text
- SA answers should be concise (1-3 words or a number)
- Questions should be challenging and educational
- Vary difficulty (some easy, some hard)
- Never repeat obvious or trivial questions
- Use precise scientific terminology
- For MC, always include a brief bonus question and answer
- CRITICAL: For format="Multiple Choice", options MUST be a JSON object with keys W, X, Y, Z — never omit or leave empty
- CRITICAL: For format="Multiple Choice", answer MUST be a single letter: W, X, Y, or Z only

Return valid JSON only.`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                format: { type: "string", enum: ["Multiple Choice", "Short Answer"] },
                topic: { type: "string" },
                question: { type: "string" },
                options: {
                  type: "object",
                  properties: {
                    W: { type: "string" },
                    X: { type: "string" },
                    Y: { type: "string" },
                    Z: { type: "string" },
                  },
                },
                answer: { type: "string", description: "For MC: must be W, X, Y, or Z only. For SA: the correct answer text." },
                bonusQ: { type: "string" },
                bonusA: { type: "string" },
              },
              required: ["format", "topic", "question", "answer"],
            },
          },
        },
        required: ["questions"],
      },
    });

    const questions = result?.questions || [];
    if (!queues[k]) queues[k] = [];

    // Post-process and validate questions
    const VALID_LETTERS = ["W","X","Y","Z"];
    const processed = questions.map(q => {
      if (q.format !== "Multiple Choice") return q;
      // Normalize options keys to uppercase
      if (q.options) {
        const norm = {};
        for (const [k, v] of Object.entries(q.options)) norm[k.toUpperCase()] = v;
        q.options = norm;
      }
      // Try to extract letter from answer if it's not already a letter
      let ans = String(q.answer || "").trim();
      if (!VALID_LETTERS.includes(ans)) {
        // Try first character uppercase
        const firstChar = ans.charAt(0).toUpperCase();
        if (VALID_LETTERS.includes(firstChar)) {
          q.answer = firstChar;
        } else {
          // Try to match answer text against options
          const ansLower = ans.toLowerCase();
          for (const letter of VALID_LETTERS) {
            if (q.options?.[letter]?.toLowerCase().includes(ansLower) || ansLower.includes(q.options?.[letter]?.toLowerCase() || "!!!")) {
              q.answer = letter;
              break;
            }
          }
        }
      } else {
        q.answer = ans;
      }
      return q;
    });

    const valid = processed.filter(q => {
      if (q.format === "Multiple Choice") {
        const hasOptions = q.options && q.options.W && q.options.X && q.options.Y && q.options.Z;
        const hasValidAnswer = VALID_LETTERS.includes(q.answer);
        return hasOptions && hasValidAnswer;
      }
      return !!q.answer;
    });
    // Tag each question with level info
    const tagged = valid.map(q => ({ ...q, level, subject, aiGenerated: true }));
    queues[k].push(...tagged);
  } catch (e) {
    console.error("AI question generation failed:", e);
  } finally {
    generating[k] = false;
  }
}

export async function getAIQuestion(subject, level = "HS") {
  const k = key(subject, level);
  if (!queues[k]) queues[k] = [];

  // If empty, wait for a batch to finish (either start one or wait for existing)
  if (queues[k].length === 0) {
    if (!generating[k]) {
      await generateBatch(subject, level);
    } else {
      // Wait for the ongoing batch to finish
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (!generating[k]) {
            clearInterval(check);
            resolve();
          }
        }, 200);
      });
    }
  }

  // Refill in background if running low
  if (queues[k].length <= REFILL_THRESHOLD && !generating[k]) {
    generateBatch(subject, level); // fire and forget
  }

  return queues[k].shift() || null;
}

export async function getHint(question, subject) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Science Bowl coach. Give ONE concise hint for this question WITHOUT revealing the answer. Keep it under 20 words.

Subject: ${subject}
Question: ${question.question}
${question.format === "Multiple Choice" ? `Options: W) ${question.options?.W}  X) ${question.options?.X}  Y) ${question.options?.Y}  Z) ${question.options?.Z}` : ""}

Hint (do not say the answer):`,
  });
  return result;
}

export async function getSmartExplanation(question, userAnswer, correct, subject) {
  const correctAnswer = question.format === "Multiple Choice"
    ? `${question.answer}) ${question.options?.[question.answer] || ""}`
    : question.answer;

  const wrongPart = !correct && userAnswer && userAnswer !== "TIMEOUT" && userAnswer !== "skipped"
    ? `The student answered: "${question.format === "Multiple Choice" ? `${userAnswer}) ${question.options?.[userAnswer] || userAnswer}` : userAnswer}". Briefly explain why that's wrong.`
    : "";

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are an expert Science Bowl tutor. Explain this answer clearly in 3-4 sentences.

Subject: ${subject}
Question: ${question.question}
Correct Answer: ${correctAnswer}
${wrongPart}

Give a clear, educational explanation that helps the student understand the underlying concept. Be specific and use proper scientific terms.`,
  });
  return result;
}