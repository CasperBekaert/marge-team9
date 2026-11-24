'use client'
import { Analytics } from '@vercel/analytics/next'
export function SiteAnalytics(){return process.env.NEXT_PUBLIC_ANALYTICS==='vercel'?<Analytics beforeSend={event=>{const url=new URL(event.url);url.search='';url.hash='';return {...event,url:url.toString()}}}/>:null}
