import { getChatGPTUser } from '@/app/chatgpt-auth';
import { workspaceDb } from '@/lib/workspace-db';
import { workspaceWriteSchema as schema } from '@/lib/workspace-schema';
export const dynamic='force-dynamic';
export async function GET(){const user=await getChatGPTUser();if(!user)return Response.json({error:'Please sign in to load your workspace.'},{status:401});try{const r=await workspaceDb().prepare('SELECT kind,id,data,updated_at FROM workspace_records WHERE user_id = ? ORDER BY updated_at DESC').bind(user.userId).all();return Response.json({records:r.results.map((x:any)=>({...x,data:JSON.parse(x.data)}))},{headers:{'Cache-Control':'no-store'}});}catch(e){console.error('Workspace read failed',e);return Response.json({error:'Saved reviews are temporarily unavailable. Please try again.'},{status:503});}}
export async function POST(req:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Please sign in to save changes.'},{status:401});const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'This request is not allowed.'},{status:403});if(Number(req.headers.get('content-length')||0)>30000)return Response.json({error:'This entry is too long.'},{status:413});let raw;try{const body=await req.text();if(body.length>30000)return Response.json({error:'This entry is too long.'},{status:413});raw=JSON.parse(body);}catch{return Response.json({error:'Please check this entry.'},{status:400});}const parsed=schema.safeParse(raw);if(!parsed.success)return Response.json({error:'Please complete every required field.'},{status:400});try {
  const p = parsed.data;
  const db = workspaceDb();
  const previous = p.expectedUpdatedAt;
  // A revision always advances, including two saves within one millisecond.
  const updated = new Date(Math.max(Date.now(), previous ? Date.parse(previous) + 1 : 0)).toISOString();
  const payload = JSON.stringify(p.data);
  const result = previous === null
    ? await db.prepare('INSERT INTO workspace_records (user_id,kind,id,data,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id,kind,id) DO NOTHING').bind(user.userId,p.kind,p.id,payload,updated).run()
    : await db.prepare('UPDATE workspace_records SET data=?,updated_at=? WHERE user_id=? AND kind=? AND id=? AND updated_at=?').bind(payload,updated,user.userId,p.kind,p.id,previous).run();
  if (!result.meta.changes) {
    const current = await db.prepare('SELECT kind,id,data,updated_at FROM workspace_records WHERE user_id=? AND kind=? AND id=?').bind(user.userId,p.kind,p.id).first<{kind:string;id:string;data:string;updated_at:string}>();
    return Response.json({error:'This record changed in another session. Compare the saved version with your draft before saving again.',conflict:true,current:current ? {...current,data:JSON.parse(current.data)} : null},{status:409});
  }
  return Response.json({record:{kind:p.kind,id:p.id,data:p.data,updated_at:updated}});
}catch(e){console.error('Workspace write failed',e);return Response.json({error:'Your change could not be saved. Your text is still here; please try again.'},{status:503});}}
