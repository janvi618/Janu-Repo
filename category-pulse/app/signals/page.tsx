import Pulse from '../pulse';
import baseline from '@/data/insights.json';
import { requireChatGPTUser } from '../chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Evidence(){await requireChatGPTUser('/signals');return <Pulse baseline={baseline}/>;}
