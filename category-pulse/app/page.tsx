import DecisionLab from './decision-lab';
import baseline from '@/data/insights.json';
import investigation from '@/data/investigation.json';
import { requireChatGPTUser } from './chatgpt-auth';
export const dynamic = 'force-dynamic';
export default async function Home(){ await requireChatGPTUser('/'); return <DecisionLab baseline={baseline} investigation={investigation}/>; }
