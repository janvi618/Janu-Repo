export const supportedResearchKinds=['mission','scenario','competitive_scenario','experiment','review','assumption','evidence'] as const;
type Row={kind:string;id:string;data:string|unknown;updated_at?:string};
export function readResearchContext(rows:Row[]){
 const supported=new Set<string>(supportedResearchKinds);const records:unknown[]=[];const ignored:string[]=[];
 for(const row of rows){if(!supported.has(row.kind)){ignored.push(`${row.kind}:${row.id}`);continue}try{records.push({kind:row.kind,id:row.id,data:typeof row.data==='string'?JSON.parse(row.data):row.data,updatedAt:row.updated_at})}catch{ignored.push(`${row.kind}:${row.id} (invalid JSON)`)}}
 return {records,ignored};
}
