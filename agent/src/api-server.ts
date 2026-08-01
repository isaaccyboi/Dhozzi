/**
 * Chai-Kan 7.74 API server for Railway deployment.
 *
 * Exposes the harness as a simple REST API:
 * POST /solve — submit a task, get results back
 */

import express, { Request, Response } from "express";
import * as path from "node:path";
import { Agent, type RunResult } from "./agent.js";
import { DEFAULT_CONFIG, isKnownModel, type AgentConfig } from "./config.js";
import { detectChecks, verify } from "./verify.js";

const app = express();
const PORT = process.env.PORT || 8080;
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();

app.use(express.json());

interface SolveRequest {
  task: string;
  model?: string;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
  projectRoot?: string;
}

interface SolveResponse {
  success: boolean;
  task: string;
  result?: {
    verdict: string;
    output: string;
    turns: number;
    cost: string;
    cacheHitRate: string;
  };
  error?: string;
}

app.post("/solve", async (req: Request, res: Response<SolveResponse>) => {
  try {
    const { task, model = DEFAULT_CONFIG.model, effort = DEFAULT_CONFIG.effort, projectRoot = PROJECT_ROOT } = req.body as SolveRequest;

    if (!task || typeof task !== "string" || !task.trim()) {
      res.status(400).json({
        success: false,
        task: "",
        error: "Missing or invalid 'task' field",
      });
      return;
    }

    if (!isKnownModel(model)) {
      res.status(400).json({
        success: false,
        task,
        error: `Unknown model: ${model}`,
      });
      return;
    }

    const config: AgentConfig = {
      ...DEFAULT_CONFIG,
      model,
      effort,
      root: path.resolve(projectRoot),
      approval: "auto",
      verify: true,
    };

    const agent = new Agent(config);
    let output = "";
    let turns = 0;
    let finalCost = "0.00";
    let cacheHitRate = "0%";

    agent.on("text", (text) => {
      output += text;
    });

    agent.on("cost", (meter) => {
      finalCost = meter.costUsd.toFixed(4);
      const inputTokens = meter.cacheReadTokens + meter.inputTokens;
      if (inputTokens > 0) {
        const cacheRatio = meter.cacheReadTokens / inputTokens;
        cacheHitRate = `${(cacheRatio * 100).toFixed(0)}%`;
      }
    });

    const result = (await agent.run(task)) as RunResult & { cost: { costUsd: number; cacheHitRate: string } };
    turns = result.turns || 0;

    res.json({
      success: true,
      task,
      result: {
        verdict: result.verdict || "completed",
        output,
        turns,
        cost: `$${finalCost}`,
        cacheHitRate,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      task: (req.body as SolveRequest).task || "",
      error: message,
    });
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", version: "7.74" });
});

app.listen(PORT, () => {
  console.log(`Chai-Kan 7.74 API server listening on port ${PORT}`);
  console.log(`POST /solve — submit a task`);
  console.log(`GET /health — health check`);
});
