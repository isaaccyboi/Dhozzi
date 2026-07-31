/**
 * Model catalogue, pricing, and runtime defaults.
 *
 * Prices are US dollars per million tokens, first-party Claude API rates.
 * Cache writes bill at 1.25x the input rate (5-minute TTL); cache reads at 0.1x.
 */

export interface ModelPricing {
  /** USD per million input tokens. */
  input: number;
  /** USD per million output tokens. */
  output: number;
  /** Human-readable note shown in `--list-models`. */
  note: string;
}

export const CACHE_WRITE_MULTIPLIER = 1.25;
export const CACHE_READ_MULTIPLIER = 0.1;

export const PRICING: Record<string, ModelPricing> = {
  "claude-opus-5": {
    input: 5,
    output: 25,
    note: "Default. Strongest at agentic coding; best quality-per-dollar for hard work.",
  },
  "claude-fable-5": {
    input: 10,
    output: 50,
    note: "Highest capability, highest price. Thinking is always on.",
  },
  "claude-sonnet-5": {
    input: 2,
    output: 10,
    note: "Near-Opus coding quality at ~40% of the cost. Intro pricing through 2026-08-31.",
  },
  "claude-haiku-4-5": {
    input: 1,
    output: 5,
    note: "Cheapest. Mechanical edits only; no thinking or effort support.",
  },
};

export const DEFAULT_MODEL = "claude-opus-5";

export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export const EFFORTS: readonly Effort[] = ["low", "medium", "high", "xhigh", "max"];

/**
 * `high` is the default rather than `xhigh` because it is the better
 * cost/quality balance for most tasks. Raise to `xhigh` for large refactors.
 */
export const DEFAULT_EFFORT: Effort = "high";

/**
 * Per-model request-surface support.
 *
 * These are not preferences — sending an unsupported parameter is a 400. Adaptive
 * thinking and `effort` arrived with the 4.6+ generation, so Haiku 4.5 accepts
 * neither; server-side refusal fallback is only wired up for the two models whose
 * safety classifiers can decline a request.
 */
export interface ModelCapabilities {
  adaptiveThinking: boolean;
  effort: boolean;
  taskBudget: boolean;
  serverFallback: boolean;
}

const MODERN: ModelCapabilities = {
  adaptiveThinking: true,
  effort: true,
  taskBudget: true,
  serverFallback: false,
};

export const MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  "claude-opus-5": { ...MODERN, serverFallback: true },
  "claude-fable-5": { ...MODERN, serverFallback: true },
  "claude-sonnet-5": { ...MODERN },
  "claude-haiku-4-5": {
    adaptiveThinking: false,
    effort: false,
    taskBudget: false,
    serverFallback: false,
  },
};

/**
 * Unknown model ids get the modern surface, because every current model except
 * Haiku 4.5 supports it. Anything that still 400s is caught by the runtime
 * degradation path in the agent loop.
 */
export function capabilitiesFor(model: string): ModelCapabilities {
  return MODEL_CAPABILITIES[model] ?? MODERN;
}

/** Beta features this agent can use. Each is independently degradable. */
export const BETAS = {
  contextManagement: "context-management-2025-06-27",
  taskBudgets: "task-budgets-2026-03-13",
  serverSideFallback: "server-side-fallback-2026-07-01",
} as const;

export interface AgentConfig {
  model: string;
  effort: Effort;
  /** Absolute path. All file and shell operations are confined to this tree. */
  root: string;
  maxTurns: number;
  /** Per-response output cap. Streaming is always used, so this can be large. */
  maxTokens: number;
  /**
   * Token ceiling the model is made aware of so it paces itself across the
   * whole run. Minimum accepted by the API is 20000. `null` disables it.
   */
  taskBudget: number | null;
  promptCaching: boolean;
  contextEditing: boolean;
  refusalFallback: boolean;
  webTools: boolean;
  /** How to handle tools that mutate state. */
  approval: ApprovalMode;
  /** Emit machine-readable JSON events instead of prose. */
  json: boolean;
}

export type ApprovalMode = "ask" | "auto" | "readonly";

export const DEFAULT_CONFIG: Omit<AgentConfig, "root"> = {
  model: DEFAULT_MODEL,
  effort: DEFAULT_EFFORT,
  maxTurns: 60,
  maxTokens: 64000,
  taskBudget: null,
  promptCaching: true,
  contextEditing: true,
  refusalFallback: true,
  webTools: false,
  approval: "ask",
  json: false,
};

/** Hard caps that keep a single tool result from blowing up the context window. */
export const LIMITS = {
  /** Max characters returned by a single `read` call. */
  readChars: 120_000,
  /** Max characters of combined stdout+stderr returned by `bash`. */
  bashChars: 30_000,
  /** Max wall-clock milliseconds for a single `bash` call. */
  bashTimeoutMs: 120_000,
  /** Max matches returned by `grep`. */
  grepMatches: 200,
  /** Max paths returned by `glob`. */
  globPaths: 500,
  /** Files larger than this are refused by `read` (bytes). */
  maxFileBytes: 5_000_000,
} as const;
