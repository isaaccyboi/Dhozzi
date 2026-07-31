# Dhozzi 2.5

A terminal coding agent that reads, searches, edits, and runs commands in a
repository, then **holds its own work to the project's tests before calling it
done**. Built on the Claude API, and designed around three things: verified
output, low cost per task, and no ability to touch anything outside the project
root.

## What this is, and what it is not

**Dhozzi 2.5 is a harness, not a model.** The harness is the agent loop, the
tools, the verifier, the context management, and the safety layer. Every request
is served by whichever Claude model `--model` names. There is no Dhozzi model,
and the version refers to this directory, not to any trained weights.

That distinction matters because harness quality and model quality are different
axes, and only one of them is buildable here. Harness quality is real and
measurable: a verified, well-cached, well-scoped agent completes more tasks
correctly, per dollar, than the same model called naively. Model quality comes
from training runs costing nine figures on tens of thousands of GPUs for months.

**It does not beat Fable 5, Mythos 5, GPT-5.6 Sol, Luna, or Terra**, and it
cannot — it *runs on* a frontier model rather than competing with one. Any
project claiming otherwise is either renaming someone else's model or lying.

**It ships with no API keys.** It reads your own credentials from the
environment. Keys are issued to an account and billed to it — they are not
something that can be handed over in a repository, and any key-shaped string
committed to git is a leaked secret rather than a feature.

## Setup

```bash
cd agent
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # from console.anthropic.com
```

An `ant auth login` profile works too — the SDK finds it automatically when no
environment variable is set.

## Usage

```bash
# one task, then exit
npm run agent -- "add a loading spinner to the chat interface"

# interactive session (keeps history, so the prompt cache keeps paying off)
npm run agent

# explore an unfamiliar repo with no ability to change it
npm run agent -- --readonly "explain how auth flows through this codebase"

# cheap model for a mechanical change
npm run agent -- --model claude-sonnet-5 "rename getUser to fetchUser everywhere"

# large refactor: more reasoning, more turns, a budget it paces against
npm run agent -- --effort xhigh --max-turns 100 --budget 400000 "migrate the Gemini service to a provider-agnostic interface"
```

Run `npm run agent -- --help` for the full flag list, and `--list-models` for
current prices.

## Verification: correct it if it's wrong, accept it if it's right

An agent grading its own work is worth very little — it reports success because
it believes it succeeded. So Dhozzi does not take its word for it. After the
agent says it is done, the project's own type checker, linter, and test suite
run as ordinary subprocesses, and a failure is sent straight back:

```
  · checks: typecheck, test, build — recording baseline
  · verifying
  · test failing — sending back for repair
  · verifying (repair 1/3)

Verified: all checks pass after 1 repair round.
```

This is reinforcement's feedback structure applied at inference time. It does
**not** update model weights — the improvement is per-task, and it comes from
refusing to accept unverified work rather than from the model getting better.
Real RLHF trains against this signal; this spends it immediately.

Three details do the actual work:

**Baseline comparison.** Checks run *before* the agent starts. A suite that was
already red is reported but never blamed on the agent — otherwise it spends its
repair budget chasing a bug it did not write.

**Frozen graders.** Check commands are detected once, before the first turn, and
the exact strings are reused. If they were re-detected afterwards, an agent that
edited `package.json` would be choosing its own grader.

**Tamper reporting.** If the agent modified a test file, `package.json`,
`tsconfig.json`, or similar while getting to green, that is called out in the
verdict. A green run means less when the grader moved.

The repair prompt also states plainly that weakening, skipping, or deleting a
check is not an acceptable fix. That is a real failure mode: "make the tests
pass" and "delete the failing test" look identical from the inside.

Verification is on by default, skipped in `--readonly` (nothing changed, so
there is nothing to grade), and controlled by `--no-verify` and
`--repair-attempts <n>`. `--check` runs the checks alone, with no model and no
cost — useful for confirming what Dhozzi will grade you against.

Projects with no detectable checks get an honest `Unverified` verdict rather
than a false green.

## Spending less

Every run ends with a line like:

```
14 turns  ·  in 412.7k (91% cached)  ·  out 18.2k  ·  $0.6841  (58% under uncached)
```

The levers, in the order they matter:

| Lever | Effect |
|---|---|
| `--model claude-sonnet-5` | ~40% of Opus pricing, close on many coding tasks |
| Prompt caching (default on) | Cache reads bill at 0.1x input; typically the single biggest saving |
| `--effort low\|medium` | Fewer reasoning and tool tokens per turn |
| Context editing (default on) | Prunes stale tool results so long runs do not grow without bound |
| `--budget N` | The model sees a countdown and paces itself instead of being cut off |

The cache hit rate in that summary is the number to watch. On a multi-turn run
it should climb past 80%. If it sits near zero, something is invalidating the
prompt prefix and you are paying full price for every token.

Two design choices exist purely to protect that number. The system prompt is a
frozen constant — nothing session-specific is interpolated into it, because the
prefix is matched byte for byte and a single changing character at the front
invalidates everything behind it. Session details go into the first user message
instead. And breakpoints are placed on the system block plus the two most recent
user turns, so coverage rolls forward as the conversation grows while staying
inside the four-breakpoint limit.

Note that context editing and caching pull against each other: pruning old tool
results rewrites the prefix and costs you cache hits from that point on. It is
on by default because running out of context is worse than a cache miss, but
`--no-context-editing` is there for short runs.

## Staying inside the project

Tool inputs are model output, and model output can be steered by anything the
model read along the way — a file, a fetched page, a CI log. So every path and
command is treated as untrusted.

- **Path confinement.** Every path is resolved through `realpath` and checked
  against the project root. `../` traversal, absolute paths, and symlinks
  pointing outside the tree are all rejected. There is a test for each.
- **Read before write.** Editing a file the agent has not read is refused, as is
  editing one whose mtime moved since it did. An agent that skims a file, works
  for six tool calls, and then writes cannot clobber what landed in between.
- **Unambiguous edits.** `old_string` must match exactly once unless
  `replace_all` is set, so an edit cannot quietly hit the wrong occurrence.
- **Approval modes.** `--readonly` permits inspection only. The default prompts
  before writes, edits, and non-trivial shell. `--yes` skips prompting — use it
  in a container, not on your laptop.
- **Command denylist.** A handful of catastrophic commands are refused in every
  mode. This is a backstop, not a boundary: a shell is far too expressive to
  filter reliably, and the real boundary is the approval prompt plus running
  somewhere disposable.

With no TTY, approval prompts deny rather than approve. An unattended run must
not be able to talk its way past a gate you asked for.

## Design notes

**Hand-written loop, not the SDK tool runner.** The harness interleaves work the
runner does not own: repositioning cache breakpoints each turn, metering spend,
gating tools, and degrading beta features. That is the documented reason to own
the loop.

**Failing tools still return a result.** Every `tool_use` gets a matching
`tool_result`, error or not — dropping one leaves an unpaired call and the next
request is rejected outright.

**Parallel calls come back together.** All results for a turn go back in a
single user message. Splitting them across messages teaches the model to stop
issuing parallel calls.

**Refusals are checked before content is read.** A refusal is a successful HTTP
200 with empty or partial content, so code that reaches straight for
`content[0]` breaks on it.

**Request shape follows the model.** Adaptive thinking and `effort` arrived with
the 4.6+ generation, so selecting Haiku 4.5 drops both rather than sending
parameters it would reject with a 400. A capability table covers the known
models; anything unknown gets the modern surface.

**Features degrade instead of failing.** If your account or model turns out not
to accept task budgets, server-side fallback, context editing, thinking, or
effort, the agent drops that one feature, says so on stderr, and continues.

## Tools

| Tool | Side effects | Notes |
|---|---|---|
| `read` | none | Numbered lines; records mtime for staleness checks |
| `glob` | none | Newest first; skips `node_modules`, `.git`, `dist`, `build` |
| `grep` | none | JS regex, confined to the project, never invokes a shell |
| `edit` | writes | Exact-match replacement with a uniqueness check |
| `write` | writes | Whole-file create or replace |
| `bash` | anything | Runs from the project root, with timeout and output caps |

`--web` adds server-side web search and fetch for looking up documentation.

## Tests

```bash
npm test        # 74 tests
npm run build   # type-check and emit to dist/
npm run agent -- --check    # run this project's checks, no model, no cost
```

Three suites. `test/tools.test.ts` covers the tool layer and the trust boundary
— path confinement including symlink escapes, staleness detection, edit
ambiguity, approval modes, command gating, timeouts, and the cost arithmetic.
`test/loop.test.ts` runs the real agent loop against a mock Messages endpoint
and asserts on request shape, SSE parsing, tool-result pairing, cache-breakpoint
placement, per-model capability gating, refusal handling, output-cap handling,
`pause_turn` resumption, the turn limit, and history across runs.
`test/verify.test.ts` covers check detection across four ecosystems and drives
the repair loop end to end with a scripted stand-in agent: a green check is
broken, detected as a regression, fed back, and repaired — plus the cases that
make the signal trustworthy (pre-existing failures excluded, grader commands
frozen against a rewritten `package.json`, edited test files reported).

**What is not covered:** no test here has called the live API. The request shape
is asserted against a mock built to the documented wire format, not against
Anthropic's servers, and the agent's actual coding ability is entirely
unmeasured — verification tells you a change did not break the suite, which is
not the same as the change being good. The first real run is the first real
test: do it on a branch, with the default approval mode, and read the diff.
