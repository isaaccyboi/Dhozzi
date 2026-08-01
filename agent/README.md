# Chai-Kan 7.74

*by Dhozzi. Short form: CK-7.74.*

A coding agent that reads, searches, edits, and runs commands in a repository,
then **holds its own work to the project's tests before calling it done**. Use
it from the terminal or from a browser. Built on the Claude API, and designed
around three things: verified output, low cost per task, and no ability to touch
anything outside the project root.

## What this is, and what it is not

**Chai-Kan 7.74 is a harness, not a model.** The harness is the agent loop, the
tools, the verifier, the context management, and the safety layer. Every request
is served by whichever Claude model `--model` names. There is no Chai-Kan model,
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

You need [Node.js](https://nodejs.org) 20 or newer. Then, from a terminal:

```bash
cd agent
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # from console.anthropic.com
```

On Windows, `set ANTHROPIC_API_KEY=sk-ant-...` in Command Prompt, or
`$env:ANTHROPIC_API_KEY="sk-ant-..."` in PowerShell.

An `ant auth login` profile works too — the SDK finds it automatically when no
environment variable is set.

## The web interface

```bash
npm run web            # then open http://localhost:4174
```

A chat page for the same agent, for when a terminal is not where you want to be.
It streams the model's text as it arrives, lists each tool call as it happens,
shows verification phases and the final verdict, and keeps a running token and
dollar count in the footer.

<!-- Screenshots live outside the repo; run `npm run web` to see it. -->

Everything is one process and one file of markup: no build step, no bundler, no
framework, and nothing loaded from a CDN. `npm run web -- --help` lists the
flags — `--port`, `--root`, `--model`, `--effort`, `--build`, `--no-verify`.

**Two modes, chosen in the header.** *Read* can inspect and explain but cannot
change anything. *Build* edits files and runs commands, and it pre-approves them
rather than prompting — the terminal's per-action approval needs a TTY to answer
it, and a browser is not one. That is the honest tradeoff, so Build asks for
confirmation once when you switch into it, and the footer says so while it is
on. Run it on a branch you can throw away.

**It binds to `127.0.0.1`, and that matters.** Anyone who can load the page can
make the agent run shell commands in your project — there is no login in front
of it. The server also rejects requests whose `Host` header is not loopback
(which is what stops a hostile site from reaching it by pointing its own DNS at
your machine) and refuses cross-origin requests outright. `--host` will bind
somewhere else and prints a warning when you do.

A session keeps one agent alive across messages, so history — and the prompt
cache — survive the whole conversation. Changing the model or the mode starts a
fresh one, and the page tells you when it did.

## Usage from the terminal

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
it believes it succeeded. So Chai-Kan does not take its word for it. After the
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
cost — useful for confirming what Chai-Kan will grade you against.

Projects with no detectable checks get an honest `Unverified` verdict rather
than a false green.

## Measuring it: the benchmark

"Is this any good?" and "did that change help?" are not answerable by opinion.
`npm run eval` runs the agent against fixture repositories with seeded bugs and
grades each result by running the fixture's own test suite:

```bash
npm run eval -- --list                          # what the tasks are
npm run eval                                    # run them all
npm run eval -- --tasks 01-off-by-one           # one task while iterating
npm run eval -- --model claude-sonnet-5         # compare models
npm run eval -- --no-verify                     # measure what verification buys
npm run eval -- --repeat 3                      # agents are stochastic
```

Six tasks, each starting red by construction: an off-by-one, a missing null
guard, a rename across three files, an implement-from-spec, a lexicographic sort
bug, and one that tests scope discipline by asking for a fix next to a function
that must be left alone.

Every task was checked in both directions before being committed — red at
baseline, and green when a correct fix is applied. A task that passes without
the agent doing anything measures nothing, and a task that cannot be solved
poisons every score computed from it.

**Tampering is not a pass.** Each task declares protected files (its tests, its
`package.json`). They are hashed before and after, and any change downgrades the
result to `TAMPER` no matter what the grader said. An agent that edits the test
to match its code produces a green suite and a worthless result, so that outcome
is named rather than counted.

Read the output in this order: pass rate first, cost per pass second. Total
spend on its own rewards a configuration that fails everything cheaply.

Each attempt is a real billed agent session. Six tasks on the default model
typically costs a few dollars; use `--tasks` or a cheaper `--model` while
iterating.

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

**Dated snapshots resolve to their family.** The API accepts both
`claude-haiku-4-5` and `claude-haiku-4-5-20251001`, and the dated form is the one
the docs publish and the one people paste. Every table here is keyed by family
and resolved through a trailing-date strip, because exact-string keying failed
three ways at once and all of them were quiet: the model went unpriced (cost and
cost-per-pass read `—`), it missed the capability table and so was handed the
modern surface it 400s on, and `--model` validation rejected it — which in the
web layer meant silently falling back to the default and billing Opus rates for
a run asked to be Haiku.

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
npm test        # 138 tests
npm run build   # type-check and emit to dist/
npm run agent -- --check    # run this project's checks, no model, no cost
npm run eval                # benchmark the agent (costs money, needs a key)
```

Four suites. `test/tools.test.ts` covers the tool layer and the trust boundary
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

`test/eval.test.ts` covers the benchmark itself with scripted stand-in agents:
a real fix scores a pass, no work scores a failure, a plausible-but-wrong fix
scores a failure, and three separate cheats — rewriting the test, neutering the
grade command, deleting the test file — all score `TAMPER` rather than passing.
It also pins that fixtures are never mutated and each attempt gets a fresh
workspace.

`test/web.test.ts` drives the web server over real HTTP with an injected agent.
It pins the things that would be expensive to discover in production: a request
with a rebound `Host` header and a cross-origin request are both refused while
the honest equivalents are served; read mode really does hand the agent a
`readonly` config with nothing to verify; build mode pre-approves rather than
falling back to a prompt no browser can answer; a failing check reaches the page
as a repair round and then a verdict, and an unrepaired one is reported as
`regressed` rather than as success. It also pins that a session reuses one agent
across messages — a second agent would re-send the whole history uncached — and
that changing the model or mode starts a fresh conversation and says so.

One bug worth naming, because it is the kind that makes a benchmark lie: Node
exports `NODE_TEST_CONTEXT` under `node --test`, and a graded child process that
inherits it **exits 0 even when its tests fail**. Every task scored as a pass
until it was found. Graded subprocesses now run with that variable and other
loader/instrumentation state stripped (`src/subprocess.ts`), and there is a
regression test that runs a genuinely failing suite from inside a test process.

**What is not covered:** no test here has called the live API. The request shape
is asserted against a mock built to the documented wire format, not against
Anthropic's servers, and no benchmark number has been produced yet — running the
suite needs a key and costs money, so the pass rate is currently unknown rather
than good. Verification tells you a change did not break the suite, which is not
the same as the change being good. The web tests drive the server but not the
browser: the page's own JavaScript — the markdown renderer, the streaming
reader, the mode toggle — has been exercised by hand and by screenshot, not by
an automated test. The first real run is the first real test: do it on a branch,
in Read mode first, and read the diff before you keep anything.
