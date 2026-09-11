// Execute the real route handlers against an isolated local D1 database.
// Authentication identities are test doubles; production auth and providers are never called.
import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { createRequire } from 'node:module';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))('miniflare');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const temp = mkdtempSync(path.join(tmpdir(), 'category-pulse-d1-test-'));
const identities = new AsyncLocalStorage();
const cache = new Map();
let db, mf;
function load(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename);
  const module = { exports: {} };
  cache.set(filename, module.exports);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const scopedRequire = name => {
    if (name === '@/app/chatgpt-auth') return { getChatGPTUser: async () => identities.getStore() || null };
    if (name === '@/lib/workspace-db') return { workspaceDb: () => db };
    if (name.startsWith('@/')) return load(name.slice(2) + '.ts');
    if (name.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(filename), name + '.ts')));
    return require(name);
  };
  new Function('require', 'module', 'exports', code)(scopedRequire, module, module.exports);
  cache.set(filename, module.exports);
  return module.exports;
}
async function start() {
  mf = new Miniflare({ modules: true, script: 'export default {fetch(){return new Response("test")}}',
    d1Databases: { DB: 'category-pulse-isolated-test' }, d1Persist: temp });
  db = await mf.getD1Database('DB');
}
const userA = { userId: 'test-a', email: 'a@example.invalid' };
const userB = { userId: 'test-b', email: 'b@example.invalid' };
const route = load('app/api/workspace/route.ts');
const review = note => ({ status: 'watch', note });
async function post(user, data, origin = 'https://test.invalid') {
  return identities.run(user, () => route.POST(new Request('https://test.invalid/api/workspace', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(data),
  })));
}
const read = user => identities.run(user, () => route.GET());
let checks = 0;
async function check(label, fn) { await fn(); checks++; console.log('PASS ' + label); }
try {
  await start();
  await db.prepare(readFileSync(path.join(root, 'drizzle/0000_reflective_rhino.sql'), 'utf8')).run();
  await check('anonymous requests cannot read or write', async () => {
    assert.equal((await read(null)).status, 401);
    assert.equal((await post(null, {})).status, 401);
  });
  await check('cross-origin writes are rejected', async () => assert.equal((await post(userA, {}, 'https://other.invalid')).status, 403));
  const base = { kind: 'review', id: 'same-record', data: review('original'), expectedUpdatedAt: null };
  let first;
  await check('create and reload a saved review', async () => {
    const response = await post(userA, base); assert.equal(response.status, 200);
    first = (await response.json()).record;
    const records = (await (await read(userA)).json()).records;
    assert.equal(records[0].data.note, 'original');
  });
  await check('two authenticated test users remain isolated', async () => {
    assert.deepEqual((await (await read(userB)).json()).records, []);
    assert.equal((await post(userB, { ...base, data: review('user B') })).status, 200);
    assert.equal((await (await read(userA)).json()).records[0].data.note, 'original');
  });
  await check('duplicate creates return a reviewable conflict', async () => {
    const response = await post(userA, base); assert.equal(response.status, 409);
    assert.equal((await response.json()).current.data.note, 'original');
  });
  await check('concurrent edits cannot silently overwrite each other', async () => {
    const results = await Promise.all(['writer 1', 'writer 2'].map(note => post(userA, { ...base, data: review(note), expectedUpdatedAt: first.updated_at })));
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    const winner = await results.find(r => r.status === 200).json();
    const loser = await results.find(r => r.status === 409).json();
    assert.equal(loser.current.data.note, winner.record.data.note);
    assert.ok(winner.record.updated_at > first.updated_at);
  });
  await check('missing revision and unsupported experiment states are rejected', async () => {
    const { expectedUpdatedAt, ...missing } = base;
    assert.equal((await post(userA, missing)).status, 400);
    assert.equal((await post(userA, {kind:'experiment',id:'bundle',data:{status:'completed'},expectedUpdatedAt:null})).status, 400);
  });
  await check('revision for a missing record returns conflict, not an insert', async () => assert.equal((await post(userA, { ...base, id:'missing', expectedUpdatedAt:first.updated_at })).status, 409));
  const { competitorScenarios, competitorScenario } = load('lib/competitive-scenarios.ts');
  const branch = competitorScenario('bundle', 'No response');
  const savedScenario = {kind:'competitive_scenario',id:'bundle',expectedUpdatedAt:null,data:{opportunityId:'bundle',move:branch.move,assumptions:[branch.assumption],response:branch.response,evidenceVersion:'2026-09-11'}};
  await check('scenario and proposed experiment round-trip through D1', async () => {
    assert.equal((await post(userA, savedScenario)).status, 200);
    assert.equal((await post(userA,{kind:'experiment',id:'bundle',expectedUpdatedAt:null,data:{opportunityId:'bundle',status:'proposed',title:'Repeat purchase',design:'Matched comparison with incumbent',measure:'Paid repeat',stop:'No incremental contribution',advance:'Agreed threshold met',threshold:'Set before launch',owner:'Unassigned'}})).status,200);
    const rows=(await (await read(userA)).json()).records;
    assert.equal(rows.find(r=>r.kind==='competitive_scenario').data.move,'No response');
    assert.equal(rows.find(r=>r.kind==='experiment').data.status,'proposed');
  });
  await check('saved records survive a local D1 runtime restart', async () => {
    await mf.dispose(); await start();
    const rows=(await (await read(userA)).json()).records;
    assert.equal(rows.find(r=>r.kind==='competitive_scenario').data.move,'No response');
    assert.equal((await (await read(userB)).json()).records[0].data.note,'user B');
  });
  await check('research context rejects malformed and unsupported records', async () => {
    const { readResearchContext }=load('lib/research-context.ts');
    const saved=(await (await read(userA)).json()).records;
    const result=readResearchContext([...saved,{kind:'mission',id:crypto.randomUUID(),data:null},{kind:'experiment',id:'bad',data:{status:'completed'}},{kind:'competitive_scenario',id:'bad',data:[]},{kind:'review',id:'bad',data:'{'},{kind:'unknown',id:'bad',data:{}}]);
    assert.equal(result.records.length,saved.length);assert.equal(result.ignored.length,5);
  });
  await check('every competitor selection changes the conditional analysis', async () => {
    for(const [id,choices] of Object.entries(competitorScenarios)) {
      assert.equal(new Set(choices.map(c=>competitorScenario(id,c.move).effect)).size,choices.length);
    }
    const { defaults, screen, CASES_PER_OPTION }=load('lib/scenario.ts');
    assert.equal(CASES_PER_OPTION,625);const before=JSON.stringify(defaults);
    screen({...defaults,ingredientShock:40});assert.equal(JSON.stringify(defaults),before);
  });
  console.log(`${checks} integration checks passed. Local D1; synthetic auth; no provider calls.`);
} finally {
  if(mf) await mf.dispose();
  rmSync(temp,{recursive:true,force:true});
}
