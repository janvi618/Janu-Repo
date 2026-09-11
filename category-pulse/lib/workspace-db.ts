import { env } from 'cloudflare:workers';
export function workspaceDb(){if(!env.DB)throw new Error('Workspace storage unavailable');return env.DB;}
