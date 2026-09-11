import fs from 'node:fs';
const insights=JSON.parse(fs.readFileSync(new URL('../data/insights.json',import.meta.url)));
const investigation=JSON.parse(fs.readFileSync(new URL('../data/investigation.json',import.meta.url)));
const sourceIds=new Set(investigation.sources.map(x=>x.id));
const opportunityIds=investigation.opportunities.map(x=>x.id);
const failures=[];
for(const o of investigation.opportunities) for(const id of o.sourceIds) if(!sourceIds.has(id)) failures.push(`opportunity ${o.id}: missing ${id}`);
for(const r of investigation.revisions) for(const id of r.sourceIds) if(!sourceIds.has(id)) failures.push(`revision: missing ${id}`);
for(const r of investigation.missionResults) for(const id of r.sourceIds) if(!sourceIds.has(id)) failures.push(`mission ${r.missionId}: missing ${id}`);
for(const s of insights.signals) if(!s.id||!s.url||!s.fact||!s.limitation) failures.push(`invalid signal ${s.id||'unknown'}`);
for(const id of ['pantry','fresh','dental','bundle']) if(!opportunityIds.includes(id)) failures.push(`missing opportunity ${id}`);
const urls=new Map(); for(const s of insights.signals){const normalized=new URL(s.url);normalized.hash='';normalized.hostname=normalized.hostname.toLowerCase();const key=normalized.toString();if(urls.has(key)&&urls.get(key)!==s.id) failures.push(`duplicate baseline URL ${s.id}`);urls.set(key,s.id)}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Validated ${insights.signals.length} signals, ${investigation.sources.length} sources, ${investigation.opportunities.length} opportunities and ${investigation.missionResults.length} mission results.`);
