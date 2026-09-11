import { workspaceRecordSchema } from './workspace-schema';
export const supportedResearchKinds = ['mission','scenario','competitive_scenario','experiment','review','assumption','evidence'] as const;
type Row = {kind:string;id:string;data:unknown;updated_at?:string};
export function readResearchContext(rows:Row[]) {
  const supported = new Set<string>(supportedResearchKinds);
  const records:unknown[] = [];
  const ignored:string[] = [];
  for (const row of rows) {
    if (!supported.has(row.kind)) { ignored.push(`${row.kind}:${row.id} (unsupported kind)`); continue; }
    let data:unknown;
    try { data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data; }
    catch { ignored.push(`${row.kind}:${row.id} (invalid JSON)`); continue; }
    const parsed = workspaceRecordSchema.safeParse({kind:row.kind,id:row.id,data});
    if (!parsed.success) { ignored.push(`${row.kind}:${row.id} (invalid record shape)`); continue; }
    records.push({...parsed.data,updatedAt:row.updated_at});
  }
  return {records,ignored};
}
