import { z } from 'zod';
const text=z.string().trim().min(1).max(4000);
const experimentData=z.object({opportunityId:z.string().min(1).max(160),status:z.literal('proposed'),title:text,design:text,measure:text,stop:text,advance:text,threshold:z.literal('Set before launch'),owner:z.string().max(160)});
const competitiveData=z.object({opportunityId:z.string().min(1).max(160),move:text,assumptions:z.array(text).min(1).max(10),response:z.string().max(4000),evidenceVersion:z.string().max(80)});
export const workspaceRecordSchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('mission'),id:z.string().uuid(),data:z.object({question:z.string().trim().min(15).max(2000),context:z.string().max(4000),status:z.literal('queued')})}),
 z.object({kind:z.literal('scenario'),id:z.literal('leadership'),data:z.object({maxDaily:z.number().min(.3).max(3),minMargin:z.number().min(20).max(60),ingredientShock:z.number().min(0).max(60),ambientOnly:z.boolean(),launchWeeks:z.number().min(8).max(60)})}),
 z.object({kind:z.literal('review'),id:z.string().min(1).max(160),data:z.object({status:z.enum(['unreviewed','investigate','watch','dismissed']),note:z.string().max(4000)})}),
 z.object({kind:z.literal('assumption'),id:z.string().min(1).max(160),data:z.object({title:text,question:text,status:z.enum(['Open','Supported','Challenged','Mixed'])})}),
 z.object({kind:z.literal('evidence'),id:z.string().uuid(),data:z.object({title:text,url:z.string().url().max(2000).refine(v=>/^https?:\/\//.test(v)),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),source:text,fact:text,implication:text,question:text,dimension:z.enum(['Consumer','Competitor','Retailer','Technology','Economics']),assumptionId:z.string().max(160),relationship:z.enum(['Supports','Challenges','Context']),confidence:z.literal('User supplied'),origin:z.literal('User supplied'),priority:z.literal('Review')})}),
 z.object({kind:z.literal('experiment'),id:z.string().min(1).max(160),data:experimentData}),
 z.object({kind:z.literal('competitive_scenario'),id:z.string().min(1).max(160),data:competitiveData})
]);
export const workspaceWriteSchema=z.intersection(workspaceRecordSchema,z.object({expectedUpdatedAt:z.string().datetime().nullable()}));

