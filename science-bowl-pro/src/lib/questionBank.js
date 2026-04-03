// DOE National Science Bowl Question Bank
import { BIOLOGY_HS, BIOLOGY_MS, BIOLOGY_HS_EXT } from './questions/biology';

import { CHEMISTRY_HS, CHEMISTRY_MS } from './questions/chemistry';
import { CHEMISTRY_HS_EXT } from './questions/chemistry_ext';

import { PHYSICS_HS, PHYSICS_MS } from './questions/physics';
import { PHYSICS_HS_EXT } from './questions/physics_ext';

import { EARTH_SPACE_HS, EARTH_SPACE_MS } from './questions/earthspace';
import { EARTH_SPACE_HS_EXT } from './questions/earthspace_ext';
import { MATH_HS, MATH_MS } from './questions/math';
import { MATH_HS_EXT } from './questions/math_ext';

import { ENERGY_HS, ENERGY_MS } from './questions/energy';
import { ENERGY_HS_EXT } from './questions/energy_ext';

export const SUBJECTS = [
  { id: "Biology", icon: "🧬", hue: "chart-1" },
  { id: "Chemistry", icon: "⚗️", hue: "chart-2" },
  { id: "Physics", icon: "⚡", hue: "chart-3" },
  { id: "Earth & Space", icon: "🌌", hue: "chart-4" },
  { id: "Math", icon: "∑", hue: "chart-5" },
  { id: "Energy", icon: "⚛️", hue: "primary" },
];

const ALL_QB = [
  ...BIOLOGY_HS, ...BIOLOGY_MS, ...(BIOLOGY_HS_EXT || []),
  ...CHEMISTRY_HS, ...CHEMISTRY_MS, ...CHEMISTRY_HS_EXT,
  ...PHYSICS_HS, ...PHYSICS_MS, ...PHYSICS_HS_EXT,
  ...EARTH_SPACE_HS, ...EARTH_SPACE_MS, ...(EARTH_SPACE_HS_EXT || []),
  ...MATH_HS, ...MATH_MS, ...MATH_HS_EXT,
  ...ENERGY_HS, ...ENERGY_MS, ...(ENERGY_HS_EXT || []),
];

const SUBJECT_MAP = {
  "Biology": "Biology",
  "Chemistry": "Chemistry",
  "Physics": "Physics",
  "Earth & Space": "Earth & Space",
  "Math": "Math",
  "Mathematics": "Math",
  "Energy": "Energy",
};

// Index by subject + level
const QB_BY_SUBJ_LEVEL = {};
SUBJECTS.forEach(s => {
  QB_BY_SUBJ_LEVEL[s.id] = { HS: [], MS: [] };
});

ALL_QB.forEach(q => {
  const subj = SUBJECT_MAP[q.s] || q.s;
  const lv = q.lv || "HS";
  if (QB_BY_SUBJ_LEVEL[subj]?.[lv]) {
    QB_BY_SUBJ_LEVEL[subj][lv].push(q);
  }
});

function rawToQuestion(raw) {
  return {
    format: raw.f === "MC" ? "Multiple Choice" : "Short Answer",
    topic: raw.t,
    question: raw.q,
    options: raw.o || null,
    answer: raw.a,
    bonusQ: raw.b || null,
    bonusA: raw.ba || null,
    set: raw.set,
    round: raw.round,
    level: raw.lv || "HS",
  };
}

// Track current question index per key for cycling
const cycleIndex = {};

export function getQuestion(subject, level = "HS", filterSet = null, filterRound = null) {
  let pool = QB_BY_SUBJ_LEVEL[subject]?.[level] || [];
  if (filterSet !== null) pool = pool.filter(q => q.set === filterSet);
  if (filterRound !== null) pool = pool.filter(q => (q.round || 1) === filterRound);
  if (!pool.length) return null;

  const key = `${subject}${level}s${filterSet}r${filterRound}`;
  if (cycleIndex[key] === undefined) cycleIndex[key] = 0;
  const idx = cycleIndex[key] % pool.length;
  cycleIndex[key] = (cycleIndex[key] + 1) % pool.length;

  // Shuffle within the pool on first use
  return rawToQuestion(pool[Math.floor(Math.random() * pool.length)]);
}

export function getQuestionsBySubject(subject, count = 10) {
  const hs = QB_BY_SUBJ_LEVEL[subject]?.HS || [];
  const ms = QB_BY_SUBJ_LEVEL[subject]?.MS || [];
  const pool = [...hs, ...ms];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(rawToQuestion);
}

export function getAllQuestions(count = 10) {
  const shuffled = [...ALL_QB].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(raw => ({
    ...rawToQuestion(raw),
    subject: raw.s,
  }));
}

/** Returns sorted list of available sets for a subject+level */
export function getAvailableSets(subject, level = "HS") {
  const pool = QB_BY_SUBJ_LEVEL[subject]?.[level] || [];
  return [...new Set(pool.map(q => q.set).filter(Boolean))].sort((a, b) => a - b);
}

/** Returns sorted list of available rounds for a subject+level+set */
export function getAvailableRounds(subject, level = "HS", set = null) {
  let pool = QB_BY_SUBJ_LEVEL[subject]?.[level] || [];
  if (set !== null) pool = pool.filter(q => q.set === set);
  return [...new Set(pool.map(q => q.round || 1).filter(Boolean))].sort((a, b) => a - b);
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
}

export function checkSA(given, correct) {
  if (!given || !correct) return false;
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const g = norm(given);
  const variants = correct.split("|").map(norm);
  for (const c of variants) {
    if (g === c) return true;
    if (c.includes(g) && g.length >= 3) return true;
    const maxDist = c.length <= 5 ? 1 : 2;
    if (levenshtein(g, c) <= maxDist) return true;
    if (g.length >= 4 && c.startsWith(g)) return true;
  }
  return false;
}

export function getSubjectQuestionCount(subject) {
  const hs = QB_BY_SUBJ_LEVEL[subject]?.HS?.length || 0;
  const ms = QB_BY_SUBJ_LEVEL[subject]?.MS?.length || 0;
  return hs + ms;
}

export const TOTAL_QUESTIONS = ALL_QB.length;