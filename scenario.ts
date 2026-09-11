export type Gates={maxDaily:number;minMargin:number;ingredientShock:number;ambientOnly:boolean;launchWeeks:number};
export type Option={id:string;name:string;shortName:string;format:string;servings:number;price:number;ingredientCost:number;otherCost:number;weeks:number;refrigerated:boolean;color:string};
export const defaults:Gates={maxDaily:1.8,minMargin:40,ingredientShock:0,ambientOnly:false,launchWeeks:52};
export const options:Option[]=[
 {id:'pantry',name:'Pantry meal add-on',shortName:'Pantry add-on',format:'14 small servings · shelf stable',servings:14,price:8.99,ingredientCost:1.05,otherCost:1.85,weeks:16,refrigerated:false,color:'#48c6b8'},
 {id:'fresh',name:'Fresh meal add-on',shortName:'Fresh add-on',format:'7 servings · refrigerated',servings:7,price:10.99,ingredientCost:1.45,otherCost:1.70,weeks:30,refrigerated:true,color:'#909aff'},
 {id:'dental',name:'Daily dental care',shortName:'Dental care',format:'14 daily treats · benefit validation',servings:14,price:9.99,ingredientCost:1.15,otherCost:2.05,weeks:40,refrigerated:false,color:'#e5b870'}
];
export const COST_FACTORS=[.9,.95,1,1.05,1.1],TRADE_OFFSETS=[-.04,-.02,0,.02,.04],PROMOTIONS=[0,.05,.1,.15,.2],DELAYS=[0,2,4,6,8];
export const CASES_PER_OPTION=COST_FACTORS.length*TRADE_OFFSETS.length*PROMOTIONS.length*DELAYS.length;
export function screen(gates:Gates,choices:Option[]=options){return choices.map(o=>{let passed=0;const failed={cost:0,price:0,timing:0,channel:0};const margins:number[]=[];
 for(const residual of COST_FACTORS)for(const tradeDelta of TRADE_OFFSETS)for(const promo of PROMOTIONS)for(const delay of DELAYS){const retail=o.price*(1-promo);const revenue=retail*.65*(1-(.10+tradeDelta));const cost=(o.ingredientCost*(1+gates.ingredientShock/100)+o.otherCost)*residual;const margin=100*(revenue-cost)/revenue;const checks={cost:margin>=gates.minMargin,price:retail/o.servings<=gates.maxDaily+1e-9,timing:o.weeks+delay<=gates.launchWeeks,channel:!gates.ambientOnly||!o.refrigerated};margins.push(margin);if(Object.values(checks).every(Boolean))passed++;else for(const k of Object.keys(checks) as (keyof typeof checks)[])if(!checks[k])failed[k]++;}
 const revenue=o.price*.65*.9,cost=o.ingredientCost*(1+gates.ingredientShock/100)+o.otherCost;
 return {...o,passed,total:CASES_PER_OPTION,share:passed/CASES_PER_OPTION*100,failed,baseMargin:100*(revenue-cost)/revenue,dailyPrice:o.price/o.servings,cost,netRevenue:revenue,minMargin:Math.min(...margins),maxMargin:Math.max(...margins)};
 }).sort((a,b)=>b.passed-a.passed||b.baseMargin-a.baseMargin);}
export function primaryFailure(o:ReturnType<typeof screen>[number]){const names={cost:'Gross margin',price:'Daily price',timing:'Launch timing',channel:'Refrigeration'};const key=(Object.keys(o.failed) as (keyof typeof o.failed)[]).sort((a,b)=>o.failed[b]-o.failed[a])[0];return o.failed[key]?names[key]:'None';}
