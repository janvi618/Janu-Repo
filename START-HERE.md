# Category Pulse: original source handoff

Prepared September 11, 2026 to unblock integration in the separate Codex checkout `/workspace/Janu-Repo`.

## What this package contains

- `category-pulse/`: the 115 Git-tracked files from the original React/TypeScript/vinext application, exported at commit `1e3673a34e5ee80f0f52737ecfdcf78a0441467e`.
- `always-on-insight-engine-prd.md`: the build requirements, demo examples and 20 acceptance criteria.
- `existing-research-task.json`: read-only export of the existing external ChatGPT research task, including its exact prompt and schedule.
- `SOURCE-MANIFEST.json`: project identity, source revision and checksums for every exported source file.

This is the original application's source snapshot, not the separately built four-file HTML/JavaScript demo. It includes the existing recorded research history. Git object history, dependencies, build output, local runtime state, database contents and credentials are not included.

## Continue implementation

1. Preserve the work already committed in the demo repository. Extract this package into a separate directory first. Do not overwrite its Git history or unrelated files.
2. Read the original README, package.json, vite.config.ts, the app/API routes, D1 schema/migrations, both evidence files and the PRD. Follow any applicable local instructions.
3. Use this React application as the integration base. Port the new navigation, three developed examples, evidence drawers, guided replay and competitive scenario UX from the static demo. Keep all original source IDs and history. Add the cat bundle hypothesis without replacing pantry.
4. Connect edits and queued questions to the existing authenticated workspace API. Extend typed record validation deliberately for newly added opportunity/experiment/scenario fields. Preserve user isolation and existing records.
5. Run meaningful local tests with the repository's existing portable development support. Check the actual supported local authentication and D1 setup before claiming production bindings are needed. Do not weaken production authentication to run tests.
6. Verify saved work after refresh, two distinct test identities, scenario separation, and the queued-mission contract. Local or mocked verification must be labeled accordingly; it does not establish a deployed/live integration.
7. Keep the same Site project ID. A source archive does not provide authentication to its remote repository or deployment service. Finish the integrated source and local verification even if those external connections are unavailable.

## Local development

`package.json` specifies Node >=22.13.0 and pnpm 11.19.0. Use the checked-in lockfile and existing project scripts. In an environment with dependency access, install with the matching pnpm version and run `pnpm dev`; inspect the actual output for its accessible preview URL. Run `pnpm build` for the framework build and the project's appropriate TypeScript checks.

Clean clones default to the portable execution profile. If the Sites plugin is available, follow its current environment setup instructions; do not copy the prior machine's ignored `.sites-runtime` configuration. Inspect `vite.config.ts` and `build/sites-vite-plugin.ts` for the supported local D1 and local sign-in setup. These development facilities do not carry production access.

The original app requires a React/vinext development server. Serving its source with Python's static HTTP server is not a valid integration test.

Apply the checked-in migration to local development D1 only. The portable sign-in uses one fixed synthetic identity and is restricted to localhost; it is not a public preview authentication mechanism. Verify two-user isolation with an isolated route test harness supplying two synthetic authenticated identities, or a properly authorized development environment. Do not weaken the localhost checks or trust client-supplied identity headers in public traffic.

The current workspace API uses full-record upserts without a revision precondition. Conflict detection is a requirement still to implement, not a capability supplied by this snapshot. Test it explicitly after adding version checks.

## Scheduler and research: what is inside versus outside the code

The daily research scheduler is an existing **external ChatGPT Task**, not an absent cron implementation. Its exported prompt tells the task to recover this same project, read its evidence and D1 user context, research primary sources, append mission answers and save/publish authorized updates. Do not invent a missing in-repository scheduler or create a second task.

The app's immediate-research route is `app/api/investigate/route.ts`, supported by `lib/live-research.ts`. It contains the server-side provider integration, but successful live execution was not verified in this source revision. Keep its connection state truthful. A configured name or an available route is not evidence that the model is available.

Complete UI integration, source validation and local persistence without invoking a model. Use an explicit test executor for integration checks where needed, labeled as mocked. Testing a real research run is a separate step requiring an already authorized runtime connection. Do not request or paste production secrets into chat, and do not create/change credentials as part of importing this archive.

## Records and compatibility

- `data/insights.json`: baseline, assumptions, signals and dated runs, including the September 11 pass with 11 reviewed pages and two added signals.
- `data/investigation.json`: dated source records, prior research tracks, revisions, three existing opportunity hypotheses, proposed experiments and missionResults.
- `workspace_records`: user-scoped evidence, reviews, assumptions, missions, scenarios and live-investigation records. The schema is present; runtime user data is not exported.
- Completed scheduled mission shape: `{missionId, answer, sourceIds}` in `data/investigation.json`, with every source ID resolving to a dated source record in that file.

The illustrated 60-page / 7-signal demo counter is not an actual research result. Keep it isolated from these records. Preserve existing commercial-scenario formulas; their case counts are illustrative arithmetic rather than probabilities or consumers.

## Publishing status

Existing project ID: `appgprj_6aa33db3640c8191a61aeb4ed6eab598`.

Existing URL: `https://category-pulse-pet-food.janvi618.chatgpt.site`.

The exported commit was saved as Site version 4. It was not deployed by the research pass because the last inspected access was public while that task authorized private publication only. This is historical status, not a new inspection of live access. Recheck before a separately authorized publish. Preserve the current audience; do not silently change access or create another Site.

## Required completion report

Report four states separately: demo behavior, local authenticated persistence, deployed authenticated persistence, and real research execution. Include the checks actually performed and precise remaining external dependencies. A missing production connection should not prevent completing and testing the recovered source locally.
