import { useState, useEffect } from "react";
import {
  Cpu, Brain, Zap, Activity, Settings, CircuitBoard, Heart, Layers,
  Search, Plus, Mail, Bell, AlertTriangle, ArrowLeft, Send, Copy,
  Trash2, BookOpen, RefreshCw, Users, ChevronRight, X, CheckCircle,
  Download, Upload, Calendar, Sparkles, Clock
} from "lucide-react";

/* ─── CONSTANTS ─── */
const CATEGORIES = [
  { id:"semiconductor",       label:"Semiconductor",       icon:Cpu,        color:"#38BDF8", bg:"rgba(14,116,144,0.15)"  },
  { id:"ai_biomedical",       label:"AI in Biomedical",     icon:Heart,        color:"#4ADE80", bg:"rgba(22,163,74,0.15)"   },
  { id:"materials",           label:"Materials Processing", icon:Layers,       color:"#FB923C", bg:"rgba(194,65,12,0.15)"   },
  { id:"ml",                  label:"Machine Learning",     icon:Brain,        color:"#C084FC", bg:"rgba(126,34,206,0.15)"  },
  { id:"power_electronics",   label:"Power Electronics",    icon:Zap,          color:"#F87171", bg:"rgba(185,28,28,0.15)"   },
  { id:"power_system",        label:"Power System",         icon:Activity,     color:"#FBBF24", bg:"rgba(146,64,14,0.15)"   },
  { id:"control_system",      label:"Control System",       icon:Settings,     color:"#2DD4BF", bg:"rgba(17,94,89,0.15)"    },
  { id:"digital_electronics", label:"Digital Electronics",  icon:CircuitBoard, color:"#F472B6", bg:"rgba(157,23,77,0.15)"   },
];

const STATUS = {
  not_contacted: { label:"Not Contacted",  color:"#64748B", dot:"#475569" },
  scheduled:     { label:"Scheduled",      color:"#C084FC", dot:"#9333EA" },
  email_sent:    { label:"Email Sent",     color:"#38BDF8", dot:"#0284C7" },
  follow_up:     { label:"Follow-up Due",  color:"#FBBF24", dot:"#D97706" },
  replied:       { label:"Replied ✓",      color:"#4ADE80", dot:"#16A34A" },
  interview:     { label:"⭐ Interview",   color:"#FDE68A", dot:"#F59E0B" },
  no_response:   { label:"No Response",    color:"#F87171", dot:"#DC2626" },
};

const ME = {
  name:    "Abdullah Shadek Fahim",
  cgpa:    "3.80/4.00",
  uni:     "Jashore University of Science and Technology (JUST), Bangladesh",
  thesis:  "A Dual-Stage Hybrid Random Forest Framework for Forward and Inverse Modeling of Ion Implantation in Si, SiC, and GaAs",
  speedup: "415×",
  pubs: [
    "J1 (Under Review, Computational Materials Science, main author): Gatekeeper Constrained Dual-Stage Random Forest for Multi-Output Ion Range & Damage Prediction across Si, 4H-SiC, and GaAs",
    "J2 (Under Review, Fusion Engineering and Design, 2nd author): Hydrogen Implantation and Diffusion in BCC Tungsten — MD Study over 5–300 eV and 300–1500 K",
    "C1 (IEEE Xplore Published): CardioPredictor — Real-time Cardiovascular Disease Prediction. DOI: 10.1109/QPAIN66474.2025.11171821",
    "C2 (Accepted, IEEE ICOPS 2026, USA): ML Surrogate for Rapid Forward and Reverse Ion Implantation Modeling in GaAs",
  ],
};

const FLAGS = {
  USA:"🇺🇸", Finland:"🇫🇮", Switzerland:"🇨🇭", Germany:"🇩🇪",
  UK:"🇬🇧", Sweden:"🇸🇪", France:"🇫🇷", Luxembourg:"🇱🇺",
  Netherlands:"🇳🇱", Canada:"🇨🇦", Japan:"🇯🇵", Denmark:"🇩🇰",
  Belgium:"🇧🇪", Australia:"🇦🇺", Singapore:"🇸🇬",
};
const COUNTRIES = [...Object.keys(FLAGS), "Other"];

const COUNTRY_TZ = {
  'USA':         'America/New_York',   // default Eastern (most universities)
  'Finland':     'Europe/Helsinki',
  'Switzerland': 'Europe/Zurich',
  'UK':          'Europe/London',
  'Germany':     'Europe/Berlin',
  'Sweden':      'Europe/Stockholm',
  'France':      'Europe/Paris',
  'Luxembourg':  'Europe/Luxembourg',
  'Netherlands': 'Europe/Amsterdam',
  'Canada':      'America/Toronto',
  'Japan':       'Asia/Tokyo',
  'Denmark':     'Europe/Copenhagen',
  'Belgium':     'Europe/Brussels',
  'Australia':   'Australia/Sydney',
  'Singapore':   'Asia/Singapore',
};
const BD_TZ = 'Asia/Dhaka';

// Get UTC offset in minutes for a timezone
const getTzOffsetMin = (tz, date = new Date()) => {
  const utc  = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const local = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  return (local - utc) / 60000;
};

// Given a country and a date string (YYYY-MM-DD), return schedule info
const getScheduleInfo = (country, dateStr) => {
  const tz = COUNTRY_TZ[country] || 'America/New_York';
  const ref = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();
  const profOff = getTzOffsetMin(tz, ref);
  const bdOff   = getTzOffsetMin(BD_TZ, ref);
  const diffMin = bdOff - profOff;
  // 10:17 AM prof time → BD time
  const profMin = 10 * 60 + 17;
  const bdMin   = ((profMin + diffMin) % 1440 + 1440) % 1440;
  const bdH = String(Math.floor(bdMin / 60)).padStart(2, '0');
  const bdM = String(bdMin % 60).padStart(2, '0');
  const sign = diffMin >= 0 ? '+' : '-';
  const absDiff = Math.abs(diffMin);
  const diffH = Math.floor(absDiff / 60);
  const diffM = absDiff % 60;
  const diffStr = diffM ? `${sign}${diffH}h${diffM}m` : `${sign}${diffH}h`;
  return {
    profTime: '10:17',
    tz,
    bdTime: `${bdH}:${bdM}`,
    diffStr,
    tzLabel: tz.split('/').pop().replace('_', ' ')
  };
};

const INIT_PROFS = [
  { id:"1",  name:"Prof. Yanwen Zhang",        university:"UTK + ORNL",               country:"USA",        email:"", profileUrl:"", categories:["semiconductor","materials"], tier:1, researchFocus:"Ion beam modification, radiation effects in semiconductors and ceramics", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"2",  name:"Prof. Kai Nordlund",        university:"University of Helsinki",   country:"Finland",    email:"", profileUrl:"", categories:["semiconductor","materials"], tier:1, researchFocus:"SRIM, MD simulation, radiation damage — directly relevant to thesis", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"3",  name:"Prof. Dane Morgan",         university:"UW-Madison",               country:"USA",        email:"", profileUrl:"", categories:["ml","materials"],            tier:1, researchFocus:"ML for materials science, well-funded active lab", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"4",  name:"Prof. Izabela Szlufarska", university:"UW-Madison",               country:"USA",        email:"", profileUrl:"", categories:["semiconductor","materials"], tier:1, researchFocus:"MD simulation, radiation damage in SiC, defect physics", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"5",  name:"Prof. Flyura Djurabekova", university:"University of Helsinki",   country:"Finland",    email:"", profileUrl:"", categories:["semiconductor","materials"], tier:1, researchFocus:"Ion-solid interactions, MD simulation, surface effects", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"6",  name:"Prof. Michele Ceriotti",   university:"EPFL",                     country:"Switzerland",email:"", profileUrl:"", categories:["ml","materials"],            tier:2, researchFocus:"ML for atomistic simulation, SOAP descriptors", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"7",  name:"Prof. William Weber",      university:"University of Tennessee",  country:"USA",        email:"", profileUrl:"", categories:["semiconductor","materials"], tier:2, researchFocus:"Radiation effects in semiconductors and ceramics", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"8",  name:"Prof. Rampi Ramprasad",    university:"Georgia Tech",             country:"USA",        email:"", profileUrl:"", categories:["ml","materials"],            tier:2, researchFocus:"ML for materials, polymer informatics, prominent lab", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"9",  name:"Prof. Mark J. Kushner",    university:"University of Michigan",   country:"USA",        email:"", profileUrl:"", categories:["semiconductor"],             tier:2, researchFocus:"Plasma simulation — directly relevant to ICOPS work", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"10", name:"Prof. Gábor Csányi",       university:"University of Cambridge",  country:"UK",         email:"", profileUrl:"", categories:["ml","materials"],            tier:2, researchFocus:"ML interatomic potentials, Gaussian approximation", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"11", name:"Prof. Ju Li",              university:"MIT",                      country:"USA",        email:"", profileUrl:"", categories:["semiconductor","materials"], tier:2, researchFocus:"Radiation damage, mechanical properties, computational materials", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"12", name:"Prof. Elif Ertekin",       university:"UIUC",                     country:"USA",        email:"", profileUrl:"", categories:["ml","materials"],            tier:2, researchFocus:"ML + defects in semiconductors, DFT", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"13", name:"Prof. Pär Olsson",         university:"KTH",                      country:"Sweden",     email:"", profileUrl:"", categories:["semiconductor","materials"], tier:2, researchFocus:"Radiation damage simulation in metals and semiconductors", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"14", name:"Prof. Liang Qi",           university:"University of Michigan",   country:"USA",        email:"", profileUrl:"", categories:["ml","materials"],            tier:2, researchFocus:"ML + computational materials, defect thermodynamics", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"15", name:"Prof. Nasr Ghoniem",       university:"UCLA",                     country:"USA",        email:"", profileUrl:"", categories:["semiconductor","materials"], tier:3, researchFocus:"Radiation effects in materials, multiscale modeling", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"16", name:"Prof. Sokrates Pantelides",university:"Vanderbilt",               country:"USA",        email:"", profileUrl:"", categories:["semiconductor"],             tier:2, researchFocus:"Defects in semiconductors, ab initio methods", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"17", name:"Prof. Marat Khafizov",     university:"Ohio State University",    country:"USA",        email:"", profileUrl:"", categories:["semiconductor","materials"], tier:3, researchFocus:"Radiation effects measurement and simulation", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"18", name:"Prof. Wenhao Sun",         university:"University of Michigan",   country:"USA",        email:"", profileUrl:"", categories:["ml","materials"],            tier:3, researchFocus:"Computational materials thermodynamics, synthesis planning", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"19", name:"Prof. Charlotte Becquart", university:"University of Lille",      country:"France",     email:"", profileUrl:"", categories:["semiconductor","materials"], tier:3, researchFocus:"MD simulation, radiation damage in tungsten and steels", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
  { id:"20", name:"Prof. Alexandre Tkatchenko",university:"University of Luxembourg",country:"Luxembourg", email:"", profileUrl:"", categories:["ml","materials"],            tier:3, researchFocus:"ML for quantum chemistry and materials", status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", notes:"", papers:[] },
];

/* ─── UTILS ─── */
const daysSince = d => d ? Math.floor((Date.now()-new Date(d))/86400000) : null;
const isDark    = p => p.status==="email_sent" && p.emailSentDate && daysSince(p.emailSentDate)>=14;
const uid       = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const today     = () => new Date().toISOString().split("T")[0];
const fuDate    = days => new Date(Date.now()+days*86400000).toISOString().split("T")[0];

const logActivity = (profName, action, detail="") => {
  try {
    const log = JSON.parse(localStorage.getItem("pt_log")||"[]");
    log.unshift({id:uid(), profName, action, detail, time:new Date().toISOString()});
    localStorage.setItem("pt_log", JSON.stringify(log.slice(0,30)));
  } catch {}
};
const getActivityLog = () => { try { return JSON.parse(localStorage.getItem("pt_log")||"[]"); } catch { return []; } };

const timeAgo = t => {
  const m = Math.floor((Date.now()-new Date(t))/60000);
  if(m<1) return "just now";
  if(m<60) return m+"m ago";
  const h=Math.floor(m/60); if(h<24) return h+"h ago";
  const d=Math.floor(h/24); return d+"d ago";
};

/* ─── API ─── */

// Get Gemini API key from localStorage
const getKey = () => localStorage.getItem("pt_gemini_key") || "";

async function fetchPaper(doi) {
  try {
    const r = await fetch(`https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=title,abstract,year,authors,tldr`);
    if(r.ok){ const d=await r.json(); if(d.title) return {title:d.title,abstract:d.abstract||"",year:d.year,authors:d.authors?.map(a=>a.name).join(", ")||"",tldr:d.tldr?.text||"",source:"Semantic Scholar"}; }
  } catch {}
  try {
    const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if(r.ok){ const {message:m}=await r.json(); return {title:m.title?.[0]||"Unknown",abstract:(m.abstract||"").replace(/<[^>]+>/g,""),year:m.published?.["date-parts"]?.[0]?.[0]||"",authors:m.author?.map(a=>`${a.given||""} ${a.family||""}`.trim()).join(", ")||"",tldr:"",source:"CrossRef"}; }
  } catch {}
  return null;
}

async function callGemini(prompt) {
  const key = getKey();
  if(!key) throw new Error("NO_KEY");
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] }) }
  );
  const d = await r.json();
  if(d.error) throw new Error(d.error.message);
  return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function suggestPaper(prof) {
  // Search Semantic Scholar for papers by this professor
  const lastName = prof.name.split(" ").pop();
  let papers = [];
  try {
    const r = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(prof.name+" "+lastName)}&fields=title,abstract,year,authors,externalIds&limit=10`);
    const d = await r.json();
    papers = (d.data||[]).filter(p =>
      p.authors?.some(a => a.name.toLowerCase().includes(lastName.toLowerCase()))
    ).slice(0,7);
  } catch {}
  if(!papers.length) return null;

  const list = papers.map((p,i)=>`${i+1}. "${p.title}" (${p.year||"?"})`).join("\n");
  const resp = await callGemini(`I am a PhD applicant. My thesis: "${ME.thesis}" — 415× speedup over SRIM/Monte Carlo.
Professor: ${prof.name}, research: ${prof.researchFocus}
Their recent papers:
${list}
Pick ONE paper (by number) most relevant for cold-emailing — should connect to ML surrogates, ion implantation, radiation effects, or computational materials.
Reply ONLY with raw JSON: {"index":1,"reason":"one sentence why"}`);
  const pick = JSON.parse(resp.replace(/\`\`\`json|\`\`\`/g,"").trim());
  const chosen = papers[(pick.index||1)-1];
  if(!chosen) return papers[0] ? {...papers[0], doi:papers[0].externalIds?.DOI||null, reason:"Most recent relevant paper"} : null;
  return {...chosen, doi:chosen.externalIds?.DOI||null, reason:pick.reason};
}

async function fetchProfFromURL(input) {
  const isURL = input.startsWith("http");
  let pageText = "";
  if(isURL) {
    try {
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(input)}`;
      const r = await fetch(proxy);
      const d = await r.json();
      pageText = (d.contents||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,6000);
    } catch {}
  }
  const prompt = isURL && pageText
    ? `Extract professor info from this webpage text:\n${pageText}\n\nReturn ONLY raw JSON (no markdown, no backticks):\n{"name":"Prof. Full Name","university":"Full University Name","country":"Country","email":"email or empty","researchFocus":"2-3 sentence summary","profileUrl":"${input}"}`
    : `Search your knowledge for this professor: "${input}"\n\nReturn ONLY raw JSON (no markdown, no backticks):\n{"name":"Prof. Full Name","university":"Full University Name","country":"Country","email":"email or empty","researchFocus":"2-3 sentence summary of their research","profileUrl":"their faculty page URL if known"}`;
  const text = await callGemini(prompt);
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

async function summarizePaper(paper) {
  return callGemini(`Summarize this academic paper for a PhD applicant cold-emailing the professor.

Title: ${paper.title}
Authors: ${paper.authors} (${paper.year})
Abstract: ${paper.abstract}
${paper.tldr?`TL;DR: ${paper.tldr}`:""}

Respond with exactly 4 short labeled sections:

CORE CONTRIBUTION: (1 sentence — what this paper does)
KEY FINDING: (1 sentence — most interesting result)
RELEVANCE TO ML+ION IMPLANTATION: (1-2 sentences connecting to surrogate ML models for ion implantation prediction)
EMAIL HOOK: (1 natural, specific sentence to open a cold email — must reference something concrete from this paper, NOT generic)

Total: ~5-6 sentences. Be specific, not generic.`);
}

async function generateEmail(prof, paper) {
  return callGemini(`You are helping a PhD applicant write a cold email to a professor. Write it naturally, like a real non-native English speaker (slightly formal, genuine, NOT AI-sounding).

APPLICANT:
- Name: ${ME.name}
- CGPA: ${ME.cgpa} from ${ME.uni}
- Thesis: ${ME.thesis}
- Key achievement: ${ME.speedup} speedup over SRIM/Monte Carlo simulation
- Publications:
${ME.pubs.map(p=>`  • ${p}`).join("\n")}

TARGET PROFESSOR:
- Name: ${prof.name}
- University: ${prof.university} (${prof.country})
- Research: ${prof.researchFocus}

PAPER THE APPLICANT READ:
- Title: ${paper.title} (${paper.year})
- Abstract: ${paper.abstract}
${paper.tldr?`- TL;DR: ${paper.tldr}`:""}

STRICT INSTRUCTIONS:
1. 200-250 words MAX
2. Start: "Dear Prof. [lastname],"
3. Para 1: One specific technical observation from the paper that connects to the applicant work (NOT generic praise)
4. Para 2: Who I am — CGPA, thesis, the ${ME.speedup} speedup result (2-3 sentences)
5. Para 3: Publications — J1 under review, ICOPS accepted (2-3 lines)
6. Para 4: Why this specific lab/professor (1-2 sentences, be specific)
7. Para 5: PhD Fall 2027, request brief conversation or info on openings (2 sentences)
8. Sign off: "Best regards,\n${ME.name}"
9. Do NOT say "I am writing to express my interest"
10. Do NOT include subject line
11. Occasional minor grammar imperfection is OK — feels human`);
}

/* ─── PROF CARD ─── */
function ProfCard({ prof, onClick }) {
  const dark = isDark(prof);
  const st   = STATUS[prof.status]||STATUS.not_contacted;
  const ds   = daysSince(prof.emailSentDate);
  return (
    <div onClick={onClick} style={{background:dark?"#0D0505":"#0F1C2E",border:`1px solid ${dark?"#5C1A1A":"#1E3A5F"}`,borderRadius:14,padding:16,cursor:"pointer",opacity:dark?0.85:1,position:"relative",transition:"transform 0.15s",userSelect:"none"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{position:"absolute",top:12,right:12,fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:5,background:prof.tier===1?"rgba(239,68,68,0.15)":prof.tier===2?"rgba(251,191,36,0.12)":"rgba(74,222,128,0.1)",color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80",border:`1px solid ${prof.tier===1?"#F8717144":prof.tier===2?"#FBBF2444":"#4ADE8044"}`}}>T{prof.tier}</div>
      <div style={{paddingRight:36}}>
        <div style={{fontSize:10,color:"#475569",marginBottom:3,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country}</div>
        <div style={{fontSize:14,fontWeight:700,lineHeight:1.3,marginBottom:2,color:"#E2E8F0"}}>{prof.name}</div>
        <div style={{fontSize:11,color:"#64748B",marginBottom:10}}>{prof.university}</div>
      </div>
      <div style={{fontSize:11,color:"#475569",marginBottom:10,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{prof.researchFocus}</div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        {prof.categories?.slice(0,2).map(cId=>{const c=CATEGORIES.find(x=>x.id===cId);return c?<span key={cId} style={{fontSize:9,background:c.bg,color:c.color,padding:"2px 7px",borderRadius:5,border:`1px solid ${c.color}33`,fontWeight:600,letterSpacing:"0.3px"}}>{c.label}</span>:null;})}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:st.dot,flexShrink:0}}/>
          <span style={{fontSize:11,color:st.color,fontWeight:600}}>{st.label}</span>
        </div>
        {ds!==null&&<span style={{fontSize:10,color:dark?"#F87171":"#475569",fontFamily:"'SF Mono',monospace"}}>{dark?`⚠ ${ds}d no reply`:`${ds}d ago`}</span>}
      </div>
    </div>
  );
}

/* ─── SETTINGS MODAL ─── */
function SettingsModal({ onClose }) {
  const [key, setKey] = useState(localStorage.getItem("pt_gemini_key") || "");
  const [saved, setSaved] = useState(false);
  const save = () => {
    localStorage.setItem("pt_gemini_key", key.trim());
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#0A1628",borderRadius:16,padding:24,width:"100%",maxWidth:400,border:"1px solid #1E3A5F"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:16,fontWeight:800,color:"#E2E8F0"}}>⚙️ Settings</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer"}}><X size={18}/></button>
        </div>
        <div style={{background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"#93C5FD",lineHeight:1.7}}>
          <strong style={{color:"#38BDF8"}}>Gemini API Key লাগবে — সম্পূর্ণ বিনামূল্যে:</strong><br/>
          1. <a href="https://aistudio.google.com" target="_blank" style={{color:"#38BDF8"}}>aistudio.google.com</a> এ যাও<br/>
          2. Google account দিয়ে login করো<br/>
          3. "Get API Key" → "Create API Key"<br/>
          4. Copy করে নিচে paste করো
        </div>
        <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Gemini API Key</label>
        <input
          type="password" value={key} onChange={e=>setKey(e.target.value)}
          placeholder="AIzaSy..."
          style={{width:"100%",background:"#060D1A",border:"1px solid #1E3A5F",borderRadius:8,padding:"10px 12px",color:"#E2E8F0",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12}}
        />
        <button onClick={save} style={{width:"100%",background:saved?"rgba(74,222,128,0.2)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:saved?"1px solid #4ADE80":"none",borderRadius:10,padding:12,color:saved?"#4ADE80":"white",fontSize:14,fontWeight:800,cursor:"pointer"}}>
          {saved ? "✓ Saved!" : "Save Key"}
        </button>
        <div style={{fontSize:11,color:"#475569",marginTop:10,textAlign:"center"}}>Key শুধু তোমার browser এ save থাকে। কোথাও যায় না।</div>
      </div>
    </div>
  );
}

/* ─── ADD MODAL ─── */
function AddModal({ onAdd, onClose, defaultCat }) {
  const [mode, setMode]         = useState("auto");
  const [urlInput, setUrlInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [fetched,  setFetched]  = useState(false);
  const [f, setF] = useState({ name:"", university:"", country:"USA", email:"", profileUrl:"", categories: defaultCat ? [defaultCat] : [], tier:1, researchFocus:"", notes:"" });

  const set       = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleCat = id => setF(p => ({ ...p, categories: p.categories.includes(id) ? p.categories.filter(c => c !== id) : [...p.categories, id] }));
  const inp = { background:"#060D1A", border:"1px solid #1E3A5F", borderRadius:8, padding:"10px 12px", color:"#E2E8F0", fontSize:13, outline:"none", boxSizing:"border-box", width:"100%" };

  const doFetch = async () => {
    if (!urlInput.trim()) return;
    setFetching(true); setFetchErr(""); setFetched(false);
    try {
      const result = await fetchProfFromURL(urlInput.trim());
      if (result && result.name) {
        setF(prev => ({ ...prev, name: result.name||prev.name, university: result.university||prev.university, country: result.country||prev.country, email: result.email||prev.email, profileUrl: result.profileUrl||urlInput.trim(), researchFocus: result.researchFocus||prev.researchFocus }));
        setFetched(true);
      } else { setFetchErr("Could not extract info. Try a direct faculty page URL."); }
    } catch(e) { setFetchErr("Fetch failed. Check the URL and try again."); }
    setFetching(false);
  };

  const handleAdd = () => {
    if (!f.name.trim() || !f.university.trim()) return;
    onAdd({ ...f, id:uid(), papers:[], status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", lastActivity:null });
  };

  const showForm = mode === "manual" || fetched;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#0A1628",width:"100%",borderRadius:"20px 20px 0 0",padding:"24px 20px",maxHeight:"92vh",overflowY:"auto",boxSizing:"border-box",border:"1px solid #1E3A5F",borderBottom:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:17,fontWeight:800,color:"#E2E8F0",letterSpacing:"-0.3px"}}>Add Professor</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid #1E3A5F",borderRadius:8,padding:6,cursor:"pointer",display:"flex"}}><X size={16} color="#64748B"/></button>
        </div>

        {/* Mode toggle */}
        <div style={{display:"flex",gap:8,marginBottom:20,background:"#060D1A",borderRadius:10,padding:4,border:"1px solid #1E3A5F"}}>
          {[["auto","🔗 Auto (URL/Name)"],["manual","✏️ Manual"]].map(([m,lbl])=>(
            <button key={m} onClick={()=>{setMode(m);setFetched(false);setFetchErr("");}} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:mode===m?"linear-gradient(135deg,#0369A1,#7C3AED)":"transparent",color:mode===m?"white":"#475569",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.2s"}}>{lbl}</button>
          ))}
        </div>

        {/* Auto fetch input */}
        {mode==="auto" && <>
          <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Professor URL or Name</label>
          <div style={{display:"flex",gap:8,marginBottom:6}}>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="https://faculty.uni.edu/... or 'Prof. Yanwen Zhang UTK'" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
            <button onClick={doFetch} disabled={fetching} style={{background:fetching?"rgba(124,58,237,0.3)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:8,padding:"10px 16px",color:"white",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
              {fetching?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:<Search size={14}/>}
              {fetching?"Fetching...":"Fetch"}
            </button>
          </div>
          <div style={{fontSize:11,color:"#475569",marginBottom:12}}>Paste Google Scholar, faculty, or lab page URL. Or type name + university.</div>
          {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginBottom:10,background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 10px",border:"1px solid rgba(239,68,68,0.2)"}}>⚠ {fetchErr}</div>}
          {fetched&&<div style={{fontSize:12,color:"#4ADE80",marginBottom:16,background:"rgba(74,222,128,0.08)",borderRadius:7,padding:"8px 10px",border:"1px solid rgba(74,222,128,0.2)"}}>✓ Info fetched! Review below, set tier + categories, then save.</div>}
          {!fetched&&!fetchErr&&<div style={{textAlign:"center",color:"#475569",padding:"16px 0",fontSize:13}}>Fetch করলে form auto-fill হয়ে যাবে</div>}
        </>}

        {/* Form */}
        {showForm && <>
          {[[" Name *","name","text","Prof. Firstname Lastname"],["University *","university","text","e.g. MIT, EPFL"],["Email","email","email","prof@uni.edu"],["Profile URL","profileUrl","url","Faculty / Scholar page"],["Research Focus","researchFocus","text","Brief description"]].map(([lbl,k,t,ph])=>(
            <div key={k} style={{marginBottom:12}}>
              <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</label>
              <input type={t} placeholder={ph} value={f[k]} onChange={e=>set(k,e.target.value)} style={inp}/>
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Country</label>
            <select value={f.country} onChange={e=>set("country",e.target.value)} style={{...inp}}>
              {COUNTRIES.map(c=><option key={c} value={c}>{(FLAGS[c]||"🌍")+" "+c}</option>)}
            </select>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Tier</label>
            <div style={{display:"flex",gap:8}}>
              {[[1,"High","#F87171","rgba(239,68,68,0.1)"],[2,"Medium","#FBBF24","rgba(251,191,36,0.1)"],[3,"Explore","#4ADE80","rgba(74,222,128,0.1)"]].map(([t,desc,col,bg])=>(
                <button key={t} onClick={()=>set("tier",t)} style={{flex:1,padding:"10px 4px",borderRadius:9,border:`1px solid ${f.tier===t?col:"#1E3A5F"}`,background:f.tier===t?bg:"transparent",color:f.tier===t?col:"#475569",cursor:"pointer",fontWeight:700,fontSize:13}}>
                  T{t}<div style={{fontSize:9,fontWeight:400,marginTop:2}}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Categories</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>toggleCat(c.id)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${f.categories.includes(c.id)?c.color:"#1E3A5F"}`,background:f.categories.includes(c.id)?c.bg:"transparent",color:f.categories.includes(c.id)?c.color:"#475569",cursor:"pointer",fontSize:11,fontWeight:600}}>{c.label}</button>
              ))}
            </div>
          </div>
          <button onClick={handleAdd} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:12,padding:14,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",letterSpacing:"-0.3px"}}>Add Professor</button>
        </>}
      </div>
    </div>
  );
}

/* ─── DETAIL VIEW ─── */
function DetailView({ prof, onBack, onUpdate, onDelete }) {
  const [tab,setTab]           = useState("overview");
  const [doi,setDoi]           = useState("");
  const [fetching,setFetching] = useState(false);
  const [fetchErr,setFetchErr] = useState("");
  const [selPaper,setSelPaper] = useState(prof.papers?.[0]||null);
  const [summary,setSummary]   = useState(prof.papers?.[0]?.summary||"");
  const [summing,setSumming]   = useState(false);
  const [suggesting,setSuggesting] = useState(false);
  const [suggested,setSuggested]   = useState(null);
  const [email,setEmail]       = useState("");
  const [genning,setGenning]   = useState(false);
  const [copied,setCopied]     = useState(false);
  const [notes,setNotes]       = useState(prof.notes||"");
  const [schedDate,setSchedDate]=useState(prof.scheduledDate||"");
  const [schedTime,setSchedTime]=useState(prof.scheduledTime||"10:09");
  const [fuDays,setFuDays]     = useState(14);

  const dark = isDark(prof);
  const ds   = daysSince(prof.emailSentDate);
  const inp  = {background:"#060D1A",border:"1px solid #1E3A5F",borderRadius:8,padding:"10px 12px",color:"#E2E8F0",fontSize:13,outline:"none",boxSizing:"border-box"};

  const doFetch = async () => {
    if(!doi.trim()) return;
    setFetching(true); setFetchErr("");
    const p = await fetchPaper(doi.trim());
    if(p) {
      const np = {...p,id:uid(),doi:doi.trim(),summary:""};
      onUpdate({papers:[...(prof.papers||[]),np]});
      setSelPaper(np); setDoi("");
    } else { setFetchErr("Could not fetch paper. Check the DOI and try again."); }
    setFetching(false);
  };

  const doSuggest = async () => {
    if(!getKey()){ alert("Gemini API key নেই! Settings থেকে set করো।"); return; }
    setSuggesting(true); setSuggested(null);
    try { const s = await suggestPaper(prof); setSuggested(s); }
    catch(e){ alert("Could not suggest paper: "+e.message); }
    setSuggesting(false);
  };

  const doSummarize = async (paper) => {
    if(!getKey()) { alert("Gemini API key নেই! Homepage এ Settings (⚙) থেকে set করো।"); return; }
    setSumming(true); setSelPaper(paper);
    try {
      const s = await summarizePaper(paper);
      setSummary(s);
      onUpdate({papers:prof.papers.map(p=>p.id===paper.id?{...p,summary:s}:p)});
      setTab("email");
    } catch(e) { alert("Error: " + e.message); }
    setSumming(false);
  };

  const doGenEmail = async () => {
    const paper = selPaper || prof.papers?.[0];
    if(!paper) { alert("Please add and select a paper first."); return; }
    if(!getKey()) { alert("Gemini API key নেই! Homepage এ Settings (⚙) থেকে set করো।"); return; }
    setGenning(true);
    try { const e = await generateEmail(prof, paper); setEmail(e); }
    catch(e) { alert("Error: " + e.message); }
    setGenning(false);
  };

  const markSent = () => {
    logActivity(prof.name, "Email Sent", prof.university);
    onUpdate({status:"email_sent",emailSentDate:today(),followUpDate:fuDate(fuDays),lastActivity:new Date().toISOString()});
  };
  const markScheduled = () => {
    if(!schedDate) return;
    logActivity(prof.name, "Scheduled", schedDate+" at "+schedTime);
    onUpdate({status:"scheduled",scheduledDate:schedDate,scheduledTime:schedTime,lastActivity:new Date().toISOString()});
  };

  return (
    <div style={{background:"#060D1A",minHeight:"100vh",color:"#E2E8F0",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* Header */}
      <div style={{background:dark?"#1A0505":"#0A1628",padding:"16px 20px",borderBottom:`1px solid ${dark?"#5C1A1A":"#1E3A5F"}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:14,fontSize:13,fontWeight:600}}>
          <ArrowLeft size={15}/> Back
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#475569",marginBottom:3,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country} · <span style={{color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80"}}>Tier {prof.tier}</span></div>
            <div style={{fontSize:19,fontWeight:800,margin:"4px 0",letterSpacing:"-0.5px"}}>{prof.name}</div>
            <div style={{fontSize:13,color:"#64748B"}}>{prof.university}</div>
          </div>
          <button onClick={()=>{if(window.confirm(`Remove ${prof.name}?`)){onDelete();}}} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:"7px 11px",cursor:"pointer",display:"flex"}}>
            <Trash2 size={14} color="#F87171"/>
          </button>
        </div>
        {/* Status pills */}
        <div style={{marginTop:14,display:"flex",gap:5,flexWrap:"wrap"}}>
          {Object.entries(STATUS).map(([k,v])=>(
            <button key={k} onClick={()=>{ logActivity(prof.name, v.label); onUpdate({status:k,lastActivity:new Date().toISOString()}); }}
              style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${prof.status===k?v.dot+"99":"#1E3A5F"}`,background:prof.status===k?v.dot+"22":"transparent",color:prof.status===k?v.color:"#475569",cursor:"pointer",fontSize:10,fontWeight:prof.status===k?700:500,transition:"all 0.15s",letterSpacing:"0.2px"}}>
              {v.label}
            </button>
          ))}
        </div>
        {dark&&<div style={{marginTop:12,background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:9,padding:"9px 13px",fontSize:12,color:"#FCA5A5",lineHeight:1.5}}>
          ⚠ {ds} days since email with no reply. Consider sending a follow-up or updating status.
        </div>}
        {prof.status==="scheduled"&&prof.scheduledDate&&(()=>{
          const info = getScheduleInfo(prof.country, prof.scheduledDate);
          const [h,m]=(prof.scheduledTime||'10:17').split(':').map(Number);
          const ref=new Date(prof.scheduledDate+'T12:00:00');
          const profOff=getTzOffsetMin(COUNTRY_TZ[prof.country]||'America/New_York',ref);
          const bdOff=getTzOffsetMin(BD_TZ,ref);
          const diff=bdOff-profOff;
          const bdMin=((h*60+m+diff)%1440+1440)%1440;
          const bdTime=String(Math.floor(bdMin/60)).padStart(2,'0')+':'+String(bdMin%60).padStart(2,'0');
          return (
            <div style={{marginTop:10,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:9,padding:"9px 13px",fontSize:12,color:"#C084FC"}}>
              📅 {prof.scheduledDate} · <strong>{prof.scheduledTime}</strong> {info.tzLabel} time = <strong style={{color:"#E2E8F0"}}>{bdTime}</strong> Bangladesh time
            </div>
          );
        })()}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #0F1C2E",background:"#060D1A",position:"sticky",top:0,zIndex:10}}>
        {[["overview","Overview"],["papers","Papers 📄"],["email","Email Gen 🤖"]].map(([t,lbl])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:13,border:"none",background:"none",color:tab===t?"#38BDF8":"#475569",fontWeight:tab===t?700:500,fontSize:13,cursor:"pointer",borderBottom:tab===t?"2px solid #38BDF8":"2px solid transparent",transition:"all 0.2s",letterSpacing:"-0.2px"}}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{padding:20}}>
        {/* OVERVIEW */}
        {tab==="overview"&&<>
          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#475569",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>Research Focus</div>
            <div style={{fontSize:14,lineHeight:1.7,color:"#CBD5E1"}}>{prof.researchFocus||"—"}</div>
          </div>

          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#475569",marginBottom:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>📅 Schedule Email</div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)} style={{...inp,flex:1}}/>
              <input type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)} style={{...inp,width:86}}/>
            </div>
            {schedDate && (()=>{
              const info = getScheduleInfo(prof.country, schedDate);
              return (
                <div style={{background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.15)",borderRadius:8,padding:"9px 12px",marginBottom:10}}>
                  <div style={{fontSize:12,color:"#38BDF8",fontWeight:700,marginBottom:2}}>
                    {schedTime} {info.tzLabel} time
                  </div>
                  <div style={{fontSize:11,color:"#64748B"}}>
                    = <span style={{color:"#CBD5E1",fontWeight:600}}>{(()=>{
                      const [h,m]=schedTime.split(':').map(Number);
                      const ref = new Date(schedDate+'T12:00:00');
                      const profOff = getTzOffsetMin(COUNTRY_TZ[prof.country]||'America/New_York', ref);
                      const bdOff   = getTzOffsetMin(BD_TZ, ref);
                      const diff    = bdOff - profOff;
                      const bdMin   = ((h*60+m+diff)%1440+1440)%1440;
                      return String(Math.floor(bdMin/60)).padStart(2,'0')+':'+String(bdMin%60).padStart(2,'0');
                    })()}</span> Bangladesh time &nbsp;·&nbsp; ({COUNTRY_TZ[prof.country]||'America/New_York'})
                  </div>
                </div>
              );
            })()}
            {!schedDate && (
              <div style={{fontSize:11,color:"#475569",marginBottom:10}}>
                ⏰ Pick a date — app will auto-calculate 10:17 AM in {prof.country} timezone
              </div>
            )}
            <button
              onClick={()=>{ if(schedDate){ const info=getScheduleInfo(prof.country,schedDate); setSchedTime(info.profTime); } }}
              style={{width:"100%",background:"rgba(56,189,248,0.05)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,padding:8,color:"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:8}}
            >
              ⚡ Set to 10:17 AM {prof.country} time {schedDate?(()=>{const i=getScheduleInfo(prof.country,schedDate);return `(= ${i.bdTime} BD)`;})():''}
            </button>
            <button onClick={markScheduled} style={{width:"100%",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.4)",borderRadius:9,padding:11,color:"#C084FC",cursor:"pointer",fontSize:13,fontWeight:700}}>
              <Calendar size={13} style={{marginRight:6,verticalAlign:"middle"}}/>Mark as Scheduled
            </button>
          </div>

          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#475569",marginBottom:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>✉️ Mark Email Sent</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:12,color:"#64748B"}}>Auto follow-up after</span>
              <select value={fuDays} onChange={e=>setFuDays(+e.target.value)} style={{...inp,padding:"5px 9px",flex:"none"}}>
                {[7,14,21].map(d=><option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:9,padding:11,color:"#38BDF8",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Send size={13}/>Mark Email Sent Today
            </button>
          </div>

          {prof.emailSentDate&&<div style={{background:"#0A1628",borderRadius:12,padding:14,marginBottom:14,border:"1px solid #1E3A5F",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Email Sent",prof.emailSentDate],["Follow-up",prof.followUpDate||"Not set"]].map(([k,v])=>(
              <div key={k} style={{background:"#060D1A",borderRadius:8,padding:10}}>
                <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>{k}</div>
                <div style={{fontSize:13,color:"#CBD5E1",fontFamily:"'SF Mono',monospace"}}>{v}</div>
              </div>
            ))}
          </div>}

          <div style={{background:"#0A1628",borderRadius:12,padding:16,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#475569",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>📝 Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} onBlur={()=>onUpdate({notes})}
              placeholder="Notes about this professor, lab, funding situation..."
              style={{...inp,width:"100%",minHeight:80,resize:"vertical",lineHeight:1.6,fontFamily:"inherit"}}/>
          </div>
        </>}

        {/* PAPERS */}
        {tab==="papers"&&<>
          {/* Suggest Paper */}
          <div style={{background:"rgba(192,132,252,0.08)",border:"1px solid rgba(192,132,252,0.25)",borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:"#C084FC",fontWeight:800,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>✨ AI Paper Suggestion</div>
            <div style={{fontSize:12,color:"#94A3B8",marginBottom:10,lineHeight:1.5}}>Gemini searches this professor's publications and picks the most relevant paper for your cold email.</div>
            {suggested&&<div style={{background:"rgba(14,116,144,0.1)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:9,padding:12,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:"#E2E8F0",marginBottom:4}}>{suggested.title} ({suggested.year})</div>
              <div style={{fontSize:11,color:"#64748B",marginBottom:6}}>by {suggested.authors?.map?.(a=>a.name).join(", ")||"Unknown"}</div>
              <div style={{fontSize:12,color:"#93C5FD",marginBottom:10,lineHeight:1.5}}>💡 {suggested.reason}</div>
              <div style={{display:"flex",gap:8}}>
                {suggested.doi&&<button onClick={()=>{setDoi(suggested.doi);setSuggested(null);}} style={{flex:1,background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.35)",borderRadius:8,padding:8,color:"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:700}}>Add by DOI →</button>}
                <button onClick={()=>{
                  const p={...suggested,id:uid(),doi:suggested.doi||"",summary:""};
                  onUpdate({papers:[...(prof.papers||[]),p]});
                  setSuggested(null);
                }} style={{flex:1,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.35)",borderRadius:8,padding:8,color:"#4ADE80",cursor:"pointer",fontSize:12,fontWeight:700}}>Add Paper ✓</button>
              </div>
            </div>}
            <button onClick={doSuggest} disabled={suggesting} style={{width:"100%",background:suggesting?"rgba(124,58,237,0.3)":"rgba(124,58,237,0.15)",border:"1px solid rgba(192,132,252,0.4)",borderRadius:9,padding:10,color:"#C084FC",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {suggesting?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:<Sparkles size={14}/>}
              {suggesting?"Searching publications...":"Suggest Best Paper to Read"}
            </button>
          </div>

          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:16,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#475569",marginBottom:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>Add Paper by DOI</div>
            <div style={{display:"flex",gap:8}}>
              <input value={doi} onChange={e=>setDoi(e.target.value)} placeholder="10.1038/s41524-..." style={{...inp,flex:1}}
                onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
              <button onClick={doFetch} disabled={fetching} style={{background:"rgba(2,132,199,0.15)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:8,padding:"10px 14px",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600}}>
                {fetching?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:<BookOpen size={14}/>}
                {fetching?"...":"Fetch"}
              </button>
            </div>
            {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginTop:6}}>{fetchErr}</div>}
            <div style={{fontSize:11,color:"#475569",marginTop:7}}>Fetches title, abstract, authors from Semantic Scholar → CrossRef</div>
          </div>

          {(!prof.papers||prof.papers.length===0)&&<div style={{textAlign:"center",color:"#475569",padding:"50px 20px"}}>
            <BookOpen size={36} style={{opacity:0.3,marginBottom:12,display:"block",margin:"0 auto 12px"}}/>
            <div style={{fontSize:14}}>No papers added yet.</div>
            <div style={{fontSize:12,marginTop:4}}>Paste a DOI above and click Fetch.</div>
          </div>}

          {prof.papers?.map(paper=>(
            <div key={paper.id} style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${selPaper?.id===paper.id?"#38BDF866":"#1E3A5F"}`}}>
              <div style={{fontSize:14,fontWeight:700,lineHeight:1.4,marginBottom:6,color:"#E2E8F0"}}>{paper.title}</div>
              <div style={{fontSize:11,color:"#475569",marginBottom:10,fontFamily:"'SF Mono',monospace"}}>{paper.authors} · {paper.year} · {paper.source}</div>
              {paper.abstract&&<div style={{fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{paper.abstract}</div>}
              {paper.summary&&<div style={{background:"rgba(14,116,144,0.1)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:9,padding:12,marginBottom:10}}>
                <div style={{fontSize:10,color:"#38BDF8",fontWeight:800,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px"}}>🤖 AI Summary</div>
                <div style={{fontSize:12,lineHeight:1.7,color:"#93C5FD",whiteSpace:"pre-line"}}>{paper.summary}</div>
              </div>}
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>doSummarize(paper)} disabled={summing}
                  style={{flex:1,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(192,132,252,0.35)",borderRadius:8,padding:"8px 6px",color:"#C084FC",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                  {summing&&selPaper?.id===paper.id?<RefreshCw size={12} style={{animation:"spin 1s linear infinite"}}/>:<Brain size={12}/>}
                  {paper.summary?"Re-summarize":"Summarize → Email"}
                </button>
                <button onClick={()=>{setSelPaper(paper);setSummary(paper.summary||"");setTab("email");}}
                  style={{background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.35)",borderRadius:8,padding:"8px 12px",color:"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:600}}>
                  Use for Email
                </button>
                <button onClick={()=>{onUpdate({papers:prof.papers.filter(p=>p.id!==paper.id)});if(selPaper?.id===paper.id)setSelPaper(null);}}
                  style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:8,cursor:"pointer",display:"flex"}}>
                  <Trash2 size={12} color="#F87171"/>
                </button>
              </div>
            </div>
          ))}
        </>}

        {/* EMAIL GEN */}
        {tab==="email"&&<>
          {selPaper?(
            <div style={{background:"rgba(14,116,144,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:10,padding:13,marginBottom:14}}>
              <div style={{fontSize:10,color:"#38BDF8",fontWeight:800,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>📄 Selected Paper</div>
              <div style={{fontSize:13,fontWeight:700,color:"#E2E8F0",marginBottom:4}}>{selPaper.title}</div>
              {summary&&<div style={{fontSize:12,color:"#93C5FD",lineHeight:1.7,marginTop:8,whiteSpace:"pre-line",borderTop:"1px solid rgba(56,189,248,0.15)",paddingTop:8}}>{summary}</div>}
            </div>
          ):prof.papers?.length>0?(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"#64748B",marginBottom:8,fontWeight:600}}>Select paper for email:</div>
              {prof.papers.map(p=>(
                <button key={p.id} onClick={()=>{setSelPaper(p);setSummary(p.summary||"");}}
                  style={{display:"block",width:"100%",textAlign:"left",background:selPaper?.id===p.id?"rgba(14,116,144,0.1)":"#0A1628",border:`1px solid ${selPaper?.id===p.id?"#38BDF866":"#1E3A5F"}`,borderRadius:9,padding:11,color:"#E2E8F0",cursor:"pointer",marginBottom:6,fontSize:13}}>
                  {p.title}
                </button>
              ))}
            </div>
          ):(
            <div style={{background:"rgba(146,64,14,0.15)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:10,padding:13,marginBottom:14,fontSize:13,color:"#FCD34D"}}>
              ⚠ Add a paper first (Papers tab) for a specific, strong email. You can still generate without one.
            </div>
          )}

          <button onClick={doGenEmail} disabled={genning} style={{width:"100%",background:genning?"rgba(124,58,237,0.4)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:12,padding:15,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:9,letterSpacing:"-0.3px",opacity:genning?0.8:1}}>
            {genning?<RefreshCw size={18} style={{animation:"spin 1s linear infinite"}}/>:<Brain size={18}/>}
            {genning?"Generating your email...":email?"Regenerate Email":"Generate Email with Gemini"}
          </button>

          {email&&<>
            <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #1E3A5F"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#CBD5E1",textTransform:"uppercase",letterSpacing:"0.5px"}}>Draft Email</div>
                <button onClick={()=>{navigator.clipboard.writeText(email);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
                  style={{background:copied?"rgba(22,163,74,0.15)":"rgba(2,132,199,0.1)",border:`1px solid ${copied?"rgba(74,222,128,0.4)":"rgba(56,189,248,0.35)"}`,borderRadius:8,padding:"6px 12px",color:copied?"#4ADE80":"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"all 0.2s"}}>
                  <Copy size={12}/>{copied?"Copied!":"Copy All"}
                </button>
              </div>
              <textarea value={email} onChange={e=>setEmail(e.target.value)}
                style={{...inp,width:"100%",minHeight:340,resize:"vertical",lineHeight:1.8,fontFamily:"Georgia,serif",fontSize:13}}/>
            </div>
            <div style={{fontSize:12,color:"#475569",marginBottom:14,lineHeight:1.6,background:"rgba(255,255,255,0.02)",borderRadius:8,padding:"10px 12px",border:"1px solid #0F1C2E"}}>
              ✏️ Edit freely. Add 1-2 small grammar tweaks to sound more natural and human.
            </div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(22,163,74,0.1)",border:"1px solid rgba(74,222,128,0.35)",borderRadius:12,padding:14,color:"#4ADE80",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"-0.3px"}}>
              <CheckCircle size={18}/>Mark as Sent
            </button>
          </>}
        </>}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function ProfTracker() {
  const [profs, setProfs] = useState(()=>{
    try { const s=localStorage.getItem("pt_v2"); return s?JSON.parse(s):INIT_PROFS; }
    catch { return INIT_PROFS; }
  });
  const [view,setView]       = useState("home");
  const [catId,setCatId]     = useState(null);
  const [profId,setProfId]   = useState(null);
  const [addModal,setAddModal]= useState(false);
  const [showSettings,setShowSettings] = useState(false);
  const [activityLog, setActivityLog] = useState(getActivityLog);
  const [search,setSearch]   = useState("");
  const [cFilter,setCFilter] = useState("All");
  const [tFilter,setTFilter] = useState("All");
  const [sFilter,setSFilter] = useState("All");

  useEffect(()=>{ try{localStorage.setItem("pt_v2",JSON.stringify(profs));}catch{} },[profs]);

  // On load: request notification permission + fire due follow-up notifications
  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default") Notification.requestPermission();
    const due = profs.filter(p=>p.followUpDate && daysSince(p.followUpDate)>=0 && p.status==="email_sent");
    if(due.length>0 && "Notification" in window && Notification.permission==="granted"){
      due.slice(0,3).forEach(p=>{
        new Notification("📧 Follow-up Due — ProfTracker",{body:`Time to follow up with ${p.name} (${p.university})`});
      });
    }
  },[]);

  const update = (id,upd) => {
    setProfs(p=>p.map(x=>x.id===id?{...x,...upd}:x));
    setActivityLog(getActivityLog());
  };
  const del    = id        => setProfs(p=>p.filter(x=>x.id!==id));
  const add    = prof      => {
    logActivity(prof.name, "Professor Added", prof.university);
    setProfs(p=>[...p,prof]);
    setActivityLog(getActivityLog());
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(profs,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="proftracker_backup.json"; a.click();
  };
  const importData = () => {
    const input=document.createElement("input"); input.type="file"; input.accept=".json";
    input.onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{setProfs(JSON.parse(ev.target.result));}catch{alert("Invalid file");}};r.readAsText(file);};
    input.click();
  };

  const followUps = profs.filter(p=>p.followUpDate&&daysSince(p.followUpDate)>=0&&p.status==="email_sent");
  const darkCards = profs.filter(isDark);
  const stats = {
    total:   profs.length,
    sent:    profs.filter(p=>["email_sent","replied","interview"].includes(p.status)).length,
    replied: profs.filter(p=>["replied","interview"].includes(p.status)).length,
    fu:      followUps.length,
  };
  const getCatProfs = id => profs.filter(p=>p.categories?.includes(id));

  /* Detail view */
  if(view==="detail"&&profId){
    const prof=profs.find(p=>p.id===profId);
    if(!prof){setView("home");return null;}
    return <DetailView prof={prof} onBack={()=>setView(catId?"category":"home")} onUpdate={upd=>update(profId,upd)} onDelete={()=>{del(profId);setView("home");}}/>;
  }

  /* Category view */
  if(view==="category"&&catId){
    const cat=CATEGORIES.find(c=>c.id===catId);
    let list=getCatProfs(catId);
    if(cFilter!=="All") list=list.filter(p=>p.country===cFilter);
    if(tFilter!=="All") list=list.filter(p=>p.tier===+tFilter);
    if(sFilter!=="All") list=list.filter(p=>p.status===sFilter);
    if(search) list=list.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.university.toLowerCase().includes(search.toLowerCase()));
    const countries=["All",...new Set(getCatProfs(catId).map(p=>p.country))];
    const Icon=cat?.icon||Cpu;

    return (
      <div style={{background:"#060D1A",minHeight:"100vh",color:"#E2E8F0",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
        <div style={{background:"#0A1628",padding:"14px 20px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #1E3A5F",position:"sticky",top:0,zIndex:10}}>
          <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontWeight:600}}><ArrowLeft size={15}/> Back</button>
          <div style={{width:1,height:18,background:"#1E3A5F"}}/>
          <Icon size={16} color={cat?.color}/>
          <span style={{fontSize:16,fontWeight:800,letterSpacing:"-0.3px"}}>{cat?.label}</span>
          <span style={{marginLeft:"auto",background:cat?.bg,color:cat?.color,padding:"3px 10px",borderRadius:12,fontSize:12,fontWeight:700,border:`1px solid ${cat?.color}33`}}>{list.length} of {getCatProfs(catId).length}</span>
        </div>

        <div style={{padding:"12px 20px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:"1px solid #0F1C2E"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#0A1628",border:"1px solid #1E3A5F",borderRadius:8,padding:"8px 12px",flex:1,minWidth:150}}>
            <Search size={13} color="#475569"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name / university..."
              style={{background:"none",border:"none",color:"#E2E8F0",outline:"none",fontSize:13,width:"100%"}}/>
          </div>
          {[[countries,cFilter,setCFilter,"Country"],
            [["All","1","2","3"],tFilter,setTFilter,"Tier"],
            [["All",...Object.keys(STATUS)],sFilter,setSFilter,"Status"]
          ].map(([opts,val,fn,ph],i)=>(
            <select key={i} value={val} onChange={e=>fn(e.target.value)}
              style={{background:"#0A1628",border:"1px solid #1E3A5F",color:val==="All"?"#475569":"#E2E8F0",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none"}}>
              {opts.map(o=><option key={o} value={o}>{o==="All"?ph:(i===1?`Tier ${o}`:(STATUS[o]?.label||o))}</option>)}
            </select>
          ))}
        </div>

        <div style={{padding:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:12}}>
          {list.map(p=><ProfCard key={p.id} prof={p} onClick={()=>{setProfId(p.id);setView("detail");}}/>)}
          {list.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"#475569",padding:60,fontSize:14}}>No professors match. Try adjusting filters.</div>}
        </div>

        <button onClick={()=>setAddModal(true)} style={{position:"fixed",bottom:24,right:24,background:`linear-gradient(135deg,${cat?.color||"#38BDF8"},${cat?.color||"#38BDF8"}88)`,border:"none",borderRadius:"50%",width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${cat?.color||"#38BDF8"}44`}}>
          <Plus color="white" size={22}/>
        </button>
        {addModal&&<AddModal defaultCat={catId} onAdd={p=>{add(p);setAddModal(false);}} onClose={()=>setAddModal(false)}/>}
      </div>
    );
  }

  /* Home view */
  const nav = id => {setCatId(id);setCFilter("All");setTFilter("All");setSFilter("All");setSearch("");setView("category");};

  return (
    <div style={{background:"#060D1A",minHeight:"100vh",color:"#E2E8F0",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Top bar */}
      <div style={{background:"#0A1628",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1E3A5F",position:"sticky",top:0,zIndex:10}}>
        <div>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:"-0.8px",background:"linear-gradient(135deg,#38BDF8,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🎓 ProfTracker</div>
          <div style={{fontSize:10,color:"#475569",fontFamily:"'SF Mono',monospace",marginTop:1}}>PhD Outreach — Fall 2027</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={exportData} title="Export backup" style={{background:"rgba(255,255,255,0.04)",border:"1px solid #1E3A5F",borderRadius:8,padding:7,cursor:"pointer",display:"flex"}}><Download size={14} color="#64748B"/></button>
          <button onClick={importData} title="Import backup" style={{background:"rgba(255,255,255,0.04)",border:"1px solid #1E3A5F",borderRadius:8,padding:7,cursor:"pointer",display:"flex"}}><Upload size={14} color="#64748B"/></button>
          <button onClick={()=>setShowSettings(true)} title="Settings / API Key" style={{background:!getKey()?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${!getKey()?"#FBBF24":"#1E3A5F"}`,borderRadius:8,padding:7,cursor:"pointer",display:"flex"}}><Settings size={14} color={!getKey()?"#FBBF24":"#64748B"}/></button>
          <div style={{position:"relative",cursor:"pointer"}}>
            <Bell size={20} color="#64748B"/>
            {followUps.length>0&&<div style={{position:"absolute",top:-7,right:-7,background:"#DC2626",color:"white",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{followUps.length}</div>}
          </div>
        </div>
      </div>

      {/* Follow-up banner */}
      {followUps.length>0&&(
        <div style={{background:"rgba(185,28,28,0.2)",borderBottom:"1px solid rgba(239,68,68,0.25)",padding:"10px 20px",display:"flex",gap:8,alignItems:"center"}}>
          <AlertTriangle size={13} color="#FCA5A5"/>
          <span style={{fontSize:13,color:"#FCA5A5",fontWeight:600}}>Follow-up due: {followUps[0].name}{followUps.length>1?` (+${followUps.length-1} more)`:""}</span>
          <button onClick={()=>{setProfId(followUps[0].id);setView("detail");}} style={{marginLeft:"auto",background:"none",border:"1px solid #FCA5A580",borderRadius:7,padding:"3px 10px",color:"#FCA5A5",cursor:"pointer",fontSize:12,fontWeight:600}}>View →</button>
        </div>
      )}

      {/* Stats */}
      <div style={{padding:20,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,animation:"fadeIn 0.4s ease"}}>
        {[{lbl:"Professors",val:stats.total,icon:Users,c:"#38BDF8"},{lbl:"Emailed",val:stats.sent,icon:Mail,c:"#C084FC"},{lbl:"Replied",val:stats.replied,icon:CheckCircle,c:"#4ADE80"},{lbl:"Follow-ups",val:stats.fu,icon:Bell,c:"#FBBF24"}].map(({lbl,val,icon:Icon,c})=>(
          <div key={lbl} style={{background:"#0A1628",borderRadius:12,padding:"14px 12px",border:"1px solid #1E3A5F"}}>
            <Icon size={15} color={c}/>
            <div style={{fontSize:24,fontWeight:900,marginTop:8,color:c,letterSpacing:"-1px",fontVariantNumeric:"tabular-nums"}}>{val}</div>
            <div style={{fontSize:10,color:"#475569",marginTop:2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{padding:"0 20px 20px"}}>
        <div style={{fontSize:10,color:"#475569",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Research Categories</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {CATEGORIES.map((cat,i)=>{
            const cp=getCatProfs(cat.id);
            const sent=cp.filter(p=>["email_sent","replied","interview"].includes(p.status)).length;
            const Icon=cat.icon;
            return (
              <button key={cat.id} onClick={()=>nav(cat.id)} style={{background:cat.bg,border:`1px solid ${cat.color}33`,borderRadius:15,padding:16,textAlign:"left",cursor:"pointer",transition:"transform 0.15s, border-color 0.15s",animation:`fadeIn 0.4s ease ${i*0.04}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=cat.color+"66";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=cat.color+"33";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <Icon size={20} color={cat.color}/>
                  <ChevronRight size={13} color={cat.color+"88"}/>
                </div>
                <div style={{fontSize:13,fontWeight:800,color:"#E2E8F0",marginBottom:3,letterSpacing:"-0.3px"}}>{cat.label}</div>
                <div style={{fontSize:11,color:"#64748B"}}>{cp.length} profs · {sent} contacted</div>
                <div style={{marginTop:10,background:"rgba(0,0,0,0.3)",borderRadius:4,height:3,overflow:"hidden"}}>
                  <div style={{width:cp.length?`${(sent/cp.length)*100}%`:"0%",background:`linear-gradient(90deg,${cat.color}99,${cat.color})`,height:"100%",borderRadius:4,transition:"width 0.6s ease"}}/>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* No response section */}
      {darkCards.length>0&&(
        <div style={{padding:"0 20px 24px"}}>
          <div style={{fontSize:10,color:"#F87171",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>⚠ No Response (14+ Days)</div>
          {darkCards.map(p=>(
            <div key={p.id} style={{background:"#1A0505",border:"1px solid #5C1A1A",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:11,color:"#64748B",marginTop:2,fontFamily:"'SF Mono',monospace"}}>{daysSince(p.emailSentDate)}d · {p.university}</div>
              </div>
              <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#F87171",borderRadius:7,padding:"5px 11px",fontSize:12,fontWeight:600,cursor:"pointer"}}>View</button>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled emails today */}
      {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).length>0&&(
        <div style={{padding:"0 20px 24px"}}>
          <div style={{fontSize:10,color:"#C084FC",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>📅 Scheduled for Today</div>
          {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).map(p=>(
            <div key={p.id} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(192,132,252,0.25)",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:11,color:"#64748B",marginTop:2}}>{p.scheduledTime} local time · {p.university}</div>
              </div>
              <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(192,132,252,0.12)",border:"1px solid rgba(192,132,252,0.35)",color:"#C084FC",borderRadius:7,padding:"5px 11px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Open</button>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {activityLog.length>0&&(
        <div style={{padding:"0 20px 88px"}}>
          <div style={{fontSize:10,color:"#475569",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>🕐 Recent Activity</div>
          {activityLog.slice(0,6).map(a=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #0F1C2E"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:
                a.action.includes("Sent")?"rgba(2,132,199,0.15)":
                a.action.includes("Replied")||a.action.includes("Interview")?"rgba(22,163,74,0.15)":
                a.action.includes("Added")?"rgba(124,58,237,0.15)":
                a.action.includes("Scheduled")?"rgba(124,58,237,0.15)":
                "rgba(71,85,105,0.15)",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {a.action.includes("Sent")?<Mail size={13} color="#38BDF8"/>:
                 a.action.includes("Replied")||a.action.includes("Interview")?<CheckCircle size={13} color="#4ADE80"/>:
                 a.action.includes("Added")?<Plus size={13} color="#C084FC"/>:
                 a.action.includes("Scheduled")?<Calendar size={13} color="#C084FC"/>:
                 <Clock size={13} color="#64748B"/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:"#E2E8F0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.profName}</div>
                <div style={{fontSize:11,color:"#64748B"}}>{a.action}{a.detail?" · "+a.detail:""}</div>
              </div>
              <div style={{fontSize:10,color:"#334155",fontFamily:"'SF Mono',monospace",flexShrink:0}}>{timeAgo(a.time)}</div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button onClick={()=>setAddModal(true)} style={{position:"fixed",bottom:24,right:24,background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:"50%",width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 24px rgba(124,58,237,0.4)"}}>
        <Plus color="white" size={22}/>
      </button>
      {addModal&&<AddModal onAdd={p=>{add(p);setAddModal(false);}} onClose={()=>setAddModal(false)}/>}
      {showSettings&&<SettingsModal onClose={()=>setShowSettings(false)}/>}

      {/* No API key warning */}
      {!getKey()&&(
        <div onClick={()=>setShowSettings(true)} style={{position:"fixed",bottom:90,right:20,background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.4)",borderRadius:12,padding:"10px 14px",cursor:"pointer",maxWidth:240,zIndex:50}}>
          <div style={{fontSize:12,fontWeight:700,color:"#FBBF24",marginBottom:2}}>⚠ API Key নেই</div>
          <div style={{fontSize:11,color:"#92400E"}}>AI features কাজ করবে না। এখানে click করে Gemini key set করো — সম্পূর্ণ free।</div>
        </div>
      )}
    </div>
  );
}
