import React,{useState} from 'react';import {Trophy,ArrowRight} from 'lucide-react';import {Card,Btn,Tag} from './ui.jsx';
const SORT={best:['Best',j=>j.score],cheap:['Cheapest',j=>j.fare],fast:['Fastest',j=>j.durationMin],early:['Earliest',j=>j.departAbs]};
const dur=m=>`${Math.floor(m/60)}h ${m%60}m`;
export default function Journeys({res,onTrack,onBook,toStation}){
 const [sort,setSort]=useState('best');const best=res.best;
 const list=[...res.journeys].sort((a,b)=>SORT[sort][1](a)-SORT[sort][1](b));
 return <div className="space-y-3">
  <div className="flex flex-wrap gap-2 items-center"><h2 className="font-semibold mr-2">{res.journeys.length} ways to reach {res.destination.name}</h2>
   {Object.entries(SORT).map(([k,[l]])=><button key={k} onClick={()=>setSort(k)} className={`px-3 py-1 rounded-full text-sm border ${sort===k?'bg-brand text-white border-brand':'bg-white'}`}>{l}</button>)}</div>
  {list.map((j,n)=>{const isBest=j===best;return <Card key={j.legs.map(l=>l.busId).join()} className={isBest?'border-2 border-brand-green bg-emerald-50/40':''}>
   <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
    {isBest&&<span className="font-bold text-brand-green flex gap-1 items-center"><Trophy size={16}/>Best bus to catch</span>}
    <span className="text-lg font-bold">{j.departure} <ArrowRight className="inline" size={14}/> {j.arrival}</span>
    <span className="text-sm text-slate-600">{dur(j.durationMin)}, {j.distanceKm} km</span>
    <span className="text-sm px-2 rounded-full bg-sky-100 text-sky-800">{j.transfers?`${j.transfers} change${j.transfers>1?'s':''}`:'Direct'}</span>
    <span className="ml-auto text-xl font-bold">₹{j.fare} <span className="text-xs font-normal text-slate-500">estimated</span></span></div>
   <p className="text-sm text-slate-600 mt-1">Board at <b>{j.boardAt.name}</b>{j.distanceToStationKm?` (${j.distanceToStationKm} km from you${isBest&&toStation?.min?`, about ${toStation.min} min by road`:''})`:''}. Leaves in {j.waitMin} min.</p>
   <ol className="mt-3 space-y-2">{j.legs.map((l,i)=><li key={i}>
    {i>0&&<p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-2 py-1 mb-2">Change at {j.changes[i-1].at}. Wait {j.changes[i-1].waitMin} min.</p>}
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"><span className="font-mono font-semibold">{l.busId}</span><span>{l.from.name} {l.departure} to {l.to.name} {l.arrival}</span>
     <span className="text-slate-500">{l.stops} stops, ₹{l.fare}</span>
     <span className="ml-auto flex gap-2"><Btn tone="green" onClick={()=>onBook(l)}>Book seats</Btn><Btn tone="gray" onClick={()=>onTrack(l.busId)}>Track</Btn></span></div></li>)}</ol>
   <p className="text-xs text-slate-500 mt-2">{j.reason} <Tag src="DEMO"/></p></Card>;})}</div>;}
