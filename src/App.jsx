import { useState, useEffect, useRef } from "react";
import {
  Cpu, Brain, Zap, Activity, Settings, CircuitBoard, Heart, Layers,
  Search, Plus, Mail, Bell, AlertTriangle, ArrowLeft, Send, Copy,
  Trash2, BookOpen, RefreshCw, Users, ChevronRight, X, CheckCircle,
  Download, Upload, Calendar, Sparkles, Clock, Link as LinkIcon, FileText
} from "lucide-react";

/* ─── CONSTANTS ─── */
const CATEGORIES = [
  { id:"semiconductor",       label:"Semiconductor",        icon:Cpu,          color:"#38BDF8", bg:"rgba(14,116,144,0.15)"  },
  { id:"ai_biomedical",       label:"AI in Biomedical",     icon:Heart,        color:"#4ADE80", bg:"rgba(22,163,74,0.15)"   },
  { id:"materials",           label:"Materials Processing", icon:Layers,       color:"#FB923C", bg:"rgba(194,65,12,0.15)"   },
  { id:"ml",                  label:"Machine Learning",     icon:Brain,        color:"#C084FC", bg:"rgba(126,34,206,0.15)"  },
  { id:"power_electronics",   label:"Power Electronics",    icon:Zap,          color:"#F87171", bg:"rgba(185,28,28,0.15)"   },
  { id:"power_system",        label:"Power System",         icon:Activity,     color:"#FBBF24", bg:"rgba(146,64,14,0.15)"   },
  { id:"control_system",      label:"Control System",       icon:Settings,     color:"#2DD4BF", bg:"rgba(17,94,89,0.15)"    },
  { id:"digital_electronics", label:"Digital Electronics",  icon:CircuitBoard, color:"#F472B6", bg:"rgba(157,23,77,0.15)"   },
];

const STATUS = {
  not_contacted: { label:"Not Contacted",  color:"#94A3B8", dot:"#475569" },
  scheduled:     { label:"Scheduled",      color:"#C084FC", dot:"#9333EA" },
  email_sent:    { label:"Email Sent",     color:"#38BDF8", dot:"#0284C7" },
  follow_up:     { label:"Follow-up Due",  color:"#FBBF24", dot:"#D97706" },
  replied:       { label:"Replied ✓",      color:"#4ADE80", dot:"#16A34A" },
  interview:     { label:"⭐ Interview",   color:"#FDE68A", dot:"#F59E0B" },
  no_response:   { label:"No Response",    color:"#F87171", dot:"#DC2626" },
  bounced:       { label:"⚠ Email Bounced", color:"#FB923C", dot:"#EA580C" },
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
  USA:"🇺🇸", UK:"🇬🇧", Canada:"🇨🇦", Australia:"🇦🇺",
  Germany:"🇩🇪", France:"🇫🇷", Switzerland:"🇨🇭", Netherlands:"🇳🇱",
  Sweden:"🇸🇪", Finland:"🇫🇮", Denmark:"🇩🇰", Norway:"🇳🇴",
  Belgium:"🇧🇪", Austria:"🇦🇹", Italy:"🇮🇹", Spain:"🇪🇸",
  Luxembourg:"🇱🇺", Portugal:"🇵🇹", Poland:"🇵🇱", Czechia:"🇨🇿",
  Japan:"🇯🇵", Singapore:"🇸🇬", "South Korea":"🇰🇷", China:"🇨🇳",
  India:"🇮🇳", "New Zealand":"🇳🇿", Ireland:"🇮🇪", Israel:"🇮🇱",
};
const COUNTRIES = [...Object.keys(FLAGS), "Other"];

const COUNTRY_TZ = {
  'USA':         'America/New_York',   
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

const INIT_PROFS = [];

/* ─── UTILS ─── */
const daysSince = d => d ? Math.floor((Date.now()-new Date(d))/86400000) : null;
const isDark    = p => p.status==="email_sent" && p.emailSentDate && daysSince(p.emailSentDate)>=14;
const uid       = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const today     = () => new Date().toISOString().split("T")[0];
const fuDate    = days => new Date(Date.now()+days*86400000).toISOString().split("T")[0];

const logActivity = (profId, profName, action, detail="") => {
  try {
    const log = JSON.parse(localStorage.getItem("pt_log")||"[]");
    log.unshift({id:uid(), profId, profName, action, detail, time:new Date().toISOString()});
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

/* ─── API (Gemini Only) ─── */
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
  const lastName = prof.name.split(" ").pop();
  let papers = [];
  try {
    const r = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(prof.name+" "+lastName)}&fields=title,abstract,year,authors,externalIds&limit=10`);
    const d = await r.json();
    papers = (d.data||[]).filter(p => p.authors?.some(a => a.name.toLowerCase().includes(lastName.toLowerCase()))).slice(0,7);
  } catch {}
  if(!papers.length) return null;

  const list = papers.map((p,i)=>`${i+1}. "${p.title}" (${p.year||"?"})`).join("\n");
  const resp = await callGemini(`I am a PhD applicant. My thesis: "${ME.thesis}"
Professor: ${prof.name}, research: ${prof.researchFocus}
Their recent papers:
${list}
Pick ONE paper (by number) most relevant for cold-emailing.
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
    ? `Extract professor info from this webpage text:\n${pageText}\n\nReturn ONLY raw JSON (no markdown):\n{"name":"Prof. Full Name","university":"Full University Name","country":"Country","email":"email or empty","researchFocus":"2-3 sentence summary","profileUrl":"${input}"}`
    : `Search your knowledge for this professor: "${input}"\n\nReturn ONLY raw JSON (no markdown):\n{"name":"Prof. Full Name","university":"Full University Name","country":"Country","email":"email or empty","researchFocus":"2-3 sentence summary of their research","profileUrl":"their faculty page URL if known"}`;
  const text = await callGemini(prompt);
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

// Generate email prompt (Used via Gemini directly now, not Claude)
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
- Title: ${paper?.title||"General Research"} (${paper?.year||""})
- Abstract: ${paper?.abstract||"Based on their general research area"}

STRICT INSTRUCTIONS:
1. 200-250 words MAX
2. Start: "Dear Prof. [lastname],"
3. Para 1: One specific technical observation from the paper that connects to the applicant work (NOT generic praise)
4. Para 2: Who I am — CGPA, thesis, the ${ME.speedup} speedup result
5. Para 3: Publications (mention J1 under review, ICOPS accepted)
6. Para 4: Why this specific lab/professor (be specific)
7. Para 5: Request PhD Fall 2027
8. Sign off: "Best regards,\n${ME.name}"
9. Do NOT say "I am writing to express my interest"
10. Occasional minor grammar imperfection is OK — feels human`);
}

/* ─── AUTH GATE ─── */
const SITE_PASSWORD = "fahim@phd2027";

function AuthGate({ onAuth }) {
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState(false);
  const check = () => {
    if(pass === SITE_PASSWORD) { sessionStorage.setItem("pt_auth","1"); onAuth(); }
    else { setErr(true); setTimeout(()=>setErr(false),2000); }
  };
  return (
    <div style={{background:"#060D1A",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#0A1628",borderRadius:16,padding:36,width:320,boxShadow:"0 10px 30px rgba(0,0,0,0.5)",border:"1px solid #1E3A5F",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>🎓</div>
        <div style={{fontSize:20,fontWeight:800,color:"#E2E8F0",marginBottom:4,letterSpacing:"-0.5px"}}>ProfTracker</div>
        <div style={{fontSize:13,color:"#64748B",marginBottom:24}}>PhD Outreach Dashboard</div>
        <input
          type="password" value={pass} onChange={e=>setPass(e.target.value)}
          placeholder="Enter password"
          onKeyDown={e=>e.key==="Enter"&&check()}
          style={{width:"100%",background:"#060D1A",border:`1px solid ${err?"#EF4444":"#1E3A5F"}`,borderRadius:10,padding:"12px 14px",fontSize:14,outline:"none",boxSizing:"border-box",color:"#E2E8F0",marginBottom:10,textAlign:"center",letterSpacing:"2px"}}
          autoFocus
        />
        {err&&<div style={{fontSize:12,color:"#EF4444",marginBottom:8}}>Incorrect password</div>}
        <button onClick={check} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:10,padding:12,color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Enter
        </button>
      </div>
    </div>
  );
}

/* ─── EMAIL TEMPLATES (Category-wise) ─── */
const EMAIL_TEMPLATES = {
  semiconductor: {
    label:"Semiconductor / Ion Implantation",
    body:`Dear Prof. [Lastname],\n\n[PAPER-SPECIFIC OBSERVATION — 1-2 sentences referencing a specific finding from their paper]\n\nI am a final-year B.Sc. graduate in Electrical and Electronic Engineering from Jashore University of Science and Technology (JUST), Bangladesh, with a CGPA of 3.80/4.00. My thesis developed a Dual-Stage Hybrid Random Forest framework for forward and inverse modeling of ion implantation in Si, 4H-SiC, and GaAs substrates, achieving a 415× speedup over SRIM/Monte Carlo simulation while maintaining high accuracy.\n\nMy recent publications include a journal paper under review at Computational Materials Science (first author) on ML-based multi-output ion range and damage prediction, a second journal under review at Fusion Engineering and Design on MD simulation of hydrogen implantation in tungsten, and an accepted paper at IEEE ICOPS 2026.\n\nYour group's expertise in [SPECIFIC RESEARCH AREA] aligns closely with my background in physics-informed machine learning for ion-solid interactions. I believe I could contribute meaningfully to ongoing work in [SPECIFIC PROJECT/DIRECTION].\n\nI am writing to inquire about PhD openings for Fall 2027. Would you be open to a brief email exchange or conversation about potential opportunities?\n\nBest regards,\nAbdullah Shadek Fahim\nasfahimbd@gmail.com`
  },
  ml: {
    label:"Machine Learning for Materials",
    body:`Dear Prof. [Lastname],\n\n[PAPER-SPECIFIC OBSERVATION — reference a specific technique or result from their paper]\n\nI am a B.Sc. graduate in Electrical and Electronic Engineering from JUST, Bangladesh (CGPA 3.80/4.00). My thesis designed a Dual-Stage Hybrid Random Forest surrogate model for ion implantation prediction in Si, SiC, and GaAs — achieving 415× speedup over physics-based Monte Carlo simulation while preserving physical accuracy through a Gatekeeper constraint mechanism.\n\nI have a journal paper under review at Computational Materials Science (first author), a second under review at Fusion Engineering and Design (2nd author), and an accepted paper at IEEE ICOPS 2026.\n\nYour research on [SPECIFIC ML METHOD/APPLICATION] directly intersects with my interest in physics-informed machine learning and fast surrogate modeling for materials simulation. I am particularly interested in [SPECIFIC ASPECT of their work].\n\nI am exploring PhD opportunities for Fall 2027. I would be grateful to know if you anticipate any openings and whether my background might be a good fit.\n\nBest regards,\nAbdullah Shadek Fahim\nasfahimbd@gmail.com`
  },
  materials: {
    label:"Materials Processing / Radiation",
    body:`Dear Prof. [Lastname],\n\n[PAPER-SPECIFIC OBSERVATION — cite a specific result about defect formation, damage cascades, or processing outcomes]\n\nI am a recent B.Sc. graduate in EEE from JUST, Bangladesh (CGPA 3.80/4.00). My thesis work focused on building ML surrogate models to replace computationally expensive SRIM/Monte Carlo ion implantation simulations — achieving 415× speedup for predicting ion ranges and damage profiles in Si, SiC, and GaAs.\n\nPublications: journal under review at Computational Materials Science (first author), journal under review at Fusion Engineering and Design (2nd author, MD simulation of H in tungsten), and an accepted conference paper at IEEE ICOPS 2026.\n\nYour work on [SPECIFIC TOPIC — radiation damage, defect engineering, processing simulation] resonates strongly with my research direction. I am eager to extend my surrogate modeling approach to [SPECIFIC APPLICATION in their lab].\n\nI am seeking PhD positions for Fall 2027 and would greatly appreciate any information about openings in your group.\n\nBest regards,\nAbdullah Shadek Fahim\nasfahimbd@gmail.com`
  }
};

/* ─── PROF CARD ─── */
function ProfCard({ prof, onClick }) {
  const dark = isDark(prof);
  const st   = STATUS[prof.status]||STATUS.not_contacted;
  const ds   = daysSince(prof.emailSentDate);
  return (
    <div onClick={onClick} style={{background:dark?"#150A0A":"#0A1628",border:`1px solid ${dark?"#5C1A1A":"#1E3A5F"}`,borderRadius:14,padding:16,cursor:"pointer",opacity:dark?0.85:1,position:"relative",transition:"transform 0.15s",userSelect:"none",boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{position:"absolute",top:12,right:12,fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:5,background:prof.tier===1?"rgba(239,68,68,0.15)":prof.tier===2?"rgba(251,191,36,0.12)":"rgba(74,222,128,0.1)",color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80",border:`1px solid ${prof.tier===1?"#F8717144":prof.tier===2?"#FBBF2444":"#4ADE8044"}`}}>T{prof.tier}</div>
      <div style={{paddingRight:36}}>
        <div style={{fontSize:10,color:"#64748B",marginBottom:3,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country}</div>
        <div style={{fontSize:14,fontWeight:700,lineHeight:1.3,marginBottom:2,color:"#E2E8F0"}}>{prof.name}</div>
        <div style={{fontSize:11,color:"#94A3B8",marginBottom:10}}>{prof.university}</div>
      </div>
      <div style={{fontSize:11,color:"#64748B",marginBottom:10,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{prof.researchFocus}</div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        {prof.categories?.slice(0,2).map(cId=>{const c=CATEGORIES.find(x=>x.id===cId);return c?<span key={cId} style={{fontSize:9,background:c.bg,color:c.color,padding:"2px 7px",borderRadius:5,border:`1px solid ${c.color}33`,fontWeight:600,letterSpacing:"0.3px"}}>{c.label}</span>:null;})}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:st.dot,flexShrink:0}}/>
          <span style={{fontSize:11,color:st.color,fontWeight:600}}>{st.label}</span>
        </div>
        {ds!==null&&<span style={{fontSize:10,color:dark?"#F87171":"#64748B",fontFamily:"'SF Mono',monospace"}}>{dark?`⚠ ${ds}d no reply`:`${ds}d ago`}</span>}
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
      } else { setFetchErr("Could not extract info. Try manual entry."); }
    } catch(e) { setFetchErr("Fetch failed. Try manual entry."); }
    setFetching(false);
  };

  const handleAdd = () => {
    if (!f.name.trim() || !f.university.trim()) return;
    onAdd({ ...f, id:uid(), papers:[], status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", lastActivity:null });
  };

  const showForm = mode === "manual" || fetched;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#0A1628",width:"100%",maxWidth:500,borderRadius:20,padding:"24px 20px",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",border:"1px solid #1E3A5F",boxShadow:"0 20px 40px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:17,fontWeight:800,color:"#E2E8F0",letterSpacing:"-0.3px"}}>Add Professor</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid #1E3A5F",borderRadius:8,padding:6,cursor:"pointer",display:"flex"}}><X size={16} color="#64748B"/></button>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:20,background:"#060D1A",borderRadius:10,padding:4,border:"1px solid #1E3A5F"}}>
          {[["auto","🔗 Auto (URL/Name)"],["manual","✏️ Manual"]].map(([m,lbl])=>(
            <button key={m} onClick={()=>{setMode(m);setFetched(false);setFetchErr("");}} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:mode===m?"linear-gradient(135deg,#0369A1,#7C3AED)":"transparent",color:mode===m?"white":"#475569",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.2s"}}>{lbl}</button>
          ))}
        </div>

        {mode==="auto" && <>
          <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Professor URL or Name</label>
          <div style={{display:"flex",gap:8,marginBottom:6}}>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="URL or Name..." style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
            <button onClick={doFetch} disabled={fetching} style={{background:fetching?"rgba(124,58,237,0.3)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:8,padding:"10px 16px",color:"white",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
              {fetching?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:<Search size={14}/>}
              {fetching?"Fetching...":"Fetch"}
            </button>
          </div>
          {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginBottom:10,background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 10px",border:"1px solid rgba(239,68,68,0.2)"}}>⚠ {fetchErr}</div>}
          {fetched&&<div style={{fontSize:12,color:"#4ADE80",marginBottom:16,background:"rgba(74,222,128,0.08)",borderRadius:7,padding:"8px 10px",border:"1px solid rgba(74,222,128,0.2)"}}>✓ Info fetched! Review below, then save.</div>}
        </>}

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
                <button key={t} onClick={()=>set("tier",t)} style={{flex:1,padding:"10px 4px",borderRadius:9,border:`1px solid ${f.tier===t?col:"#1E3A5F"}`,background:f.tier===t?bg:"transparent",color:f.tier===t?col:"#64748B",cursor:"pointer",fontWeight:700,fontSize:13}}>
                  T{t}<div style={{fontSize:9,fontWeight:400,marginTop:2}}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Categories</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>toggleCat(c.id)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${f.categories.includes(c.id)?c.color:"#1E3A5F"}`,background:f.categories.includes(c.id)?c.bg:"transparent",color:f.categories.includes(c.id)?c.color:"#64748B",cursor:"pointer",fontSize:11,fontWeight:600}}>{c.label}</button>
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
  
  // Paper Upload states
  const fileInputRef = useRef(null);
  const [paperLink, setPaperLink] = useState("");

  const [email,setEmail]       = useState(()=>localStorage.getItem("pt_email_draft_"+prof.id)||"");
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
    } else { setFetchErr("Could not fetch paper."); }
    setFetching(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    // Check file size (Warn if > 2MB because of localStorage limit)
    if(file.size > 2 * 1024 * 1024) {
      alert("⚠️ File is too large! LocalStorage limit is 5MB. Please use the 'Link to Paper / Drive' option instead to prevent app crash.");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const np = { id:uid(), title: file.name, authors: "Uploaded PDF", year: new Date().getFullYear(), source: "Local File", pdfBase64: ev.target.result };
        onUpdate({papers:[...(prof.papers||[]), np]});
        setSelPaper(np);
      } catch(err) {
        alert("Error saving file. Quota exceeded.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleLinkAdd = () => {
    if(!paperLink.trim()) return;
    const np = { id:uid(), title: "Linked Paper", authors: "Cloud / Drive", year: new Date().getFullYear(), source: "External Link", externalLink: paperLink.trim() };
    onUpdate({papers:[...(prof.papers||[]), np]});
    setSelPaper(np);
    setPaperLink("");
  };

  const doGenEmail = async () => {
    const paper = selPaper || prof.papers?.[0];
    if(!getKey()) { alert("Gemini API key is required!"); return; }
    setGenning(true);
    try { const e = await generateEmail(prof, paper); setEmail(e); }
    catch(e) { alert("Error: " + e.message); }
    setGenning(false);
  };

  const markSent = () => {
    logActivity(prof.id, prof.name, "Email Sent", prof.university);
    onUpdate({status:"email_sent",emailSentDate:today(),followUpDate:fuDate(fuDays),lastActivity:new Date().toISOString(), sentEmailText: email});
  };
  const markScheduled = () => {
    if(!schedDate) return;
    logActivity(prof.id, prof.name, "Scheduled", schedDate+" at "+schedTime);
    onUpdate({status:"scheduled",scheduledDate:schedDate,scheduledTime:schedTime,lastActivity:new Date().toISOString()});
  };

  return (
    <div style={{background:"#060D1A",minHeight:"100vh",color:"#E2E8F0",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      <div style={{background:dark?"#110505":"#0A1628",padding:"16px 20px",borderBottom:`1px solid ${dark?"#5C1A1A":"#1E3A5F"}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:14,fontSize:13,fontWeight:600}}>
          <ArrowLeft size={15}/> Back
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#64748B",marginBottom:3,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country} · <span style={{color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80"}}>Tier {prof.tier}</span></div>
            <div style={{fontSize:19,fontWeight:800,margin:"4px 0",letterSpacing:"-0.5px"}}>{prof.name}</div>
            <div style={{fontSize:13,color:"#94A3B8"}}>{prof.university}</div>
          </div>
          <button onClick={()=>{if(window.confirm(`Remove ${prof.name}?`)){onDelete();}}} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:"7px 11px",cursor:"pointer",display:"flex"}}>
            <Trash2 size={14} color="#F87171"/>
          </button>
        </div>
        <div style={{marginTop:14,display:"flex",gap:5,flexWrap:"wrap"}}>
          {Object.entries(STATUS).map(([k,v])=>(
            <button key={k} onClick={()=>{ logActivity(prof.id, prof.name, v.label); onUpdate({status:k,lastActivity:new Date().toISOString()}); }}
              style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${prof.status===k?v.dot+"99":"#1E3A5F"}`,background:prof.status===k?v.dot+"22":"transparent",color:prof.status===k?v.color:"#64748B",cursor:"pointer",fontSize:10,fontWeight:prof.status===k?700:500,transition:"all 0.15s",letterSpacing:"0.2px"}}>
              {v.label}
            </button>
          ))}
        </div>
        {dark&&<div style={{marginTop:12,background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:9,padding:"9px 13px",fontSize:12,color:"#FCA5A5",lineHeight:1.5}}>
          ⚠ {ds} days since email with no reply. Consider sending a follow-up or updating status.
        </div>}
      </div>

      <div style={{display:"flex",borderBottom:"1px solid #1E3A5F",background:"#0A1628",position:"sticky",top:0,zIndex:10}}>
        {[["overview","Overview"],["papers","Papers 📄"],["email","Email Gen 🤖"]].map(([t,lbl])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:13,border:"none",background:"none",color:tab===t?"#38BDF8":"#64748B",fontWeight:tab===t?700:500,fontSize:13,cursor:"pointer",borderBottom:tab===t?"2px solid #38BDF8":"2px solid transparent",transition:"all 0.2s",letterSpacing:"-0.2px"}}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{padding:20}}>
        {tab==="overview"&&<>
          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>Research Focus</div>
            <div style={{fontSize:14,lineHeight:1.7,color:"#E2E8F0"}}>{prof.researchFocus||"—"}</div>
          </div>

          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>📅 Schedule Email</div>
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
                  <div style={{fontSize:11,color:"#94A3B8"}}>
                    = <span style={{color:"#E2E8F0",fontWeight:600}}>{(()=>{
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
            <button onClick={markScheduled} style={{width:"100%",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.4)",borderRadius:9,padding:11,color:"#C084FC",cursor:"pointer",fontSize:13,fontWeight:700,marginTop:6}}>
              <Calendar size={13} style={{marginRight:6,verticalAlign:"middle"}}/>Mark as Scheduled
            </button>
          </div>

          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>✉️ Mark Email Sent</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:12,color:"#94A3B8"}}>Auto follow-up after</span>
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
                <div style={{fontSize:10,color:"#64748B",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>{k}</div>
                <div style={{fontSize:13,color:"#E2E8F0",fontFamily:"'SF Mono',monospace"}}>{v}</div>
              </div>
            ))}
          </div>}

          {prof.sentEmailText && (
            <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #4ADE8044"}}>
               <div style={{fontSize:10,color:"#4ADE80",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",display:"flex",alignItems:"center",gap:5}}>
                 <CheckCircle size={12}/> Saved Sent Email
               </div>
               <div style={{fontSize:12,lineHeight:1.6,color:"#94A3B8",whiteSpace:"pre-wrap"}}>{prof.sentEmailText}</div>
            </div>
          )}

          <div style={{background:"#0A1628",borderRadius:12,padding:16,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px"}}>📝 Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} onBlur={()=>onUpdate({notes})}
              placeholder="Notes about funding, lab..."
              style={{...inp,width:"100%",minHeight:80,resize:"vertical",lineHeight:1.6,fontFamily:"inherit"}}/>
          </div>
        </>}

        {tab==="papers"&&<>
          {/* Add Paper Section */}
          <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:16,border:"1px solid #1E3A5F"}}>
            <div style={{fontSize:12,color:"#E2E8F0",marginBottom:12,fontWeight:700}}>➕ Add a Paper</div>
            
            {/* 1. By DOI */}
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={doi} onChange={e=>setDoi(e.target.value)} placeholder="DOI (e.g. 10.1038/...)" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
              <button onClick={doFetch} disabled={fetching} style={{background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:8,padding:"10px 14px",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600}}>
                {fetching?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:<Search size={14}/>} Fetch
              </button>
            </div>
            {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginBottom:12}}>{fetchErr}</div>}

            {/* 2. By Link */}
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={paperLink} onChange={e=>setPaperLink(e.target.value)} placeholder="Google Drive or Web Link" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&handleLinkAdd()}/>
              <button onClick={handleLinkAdd} style={{background:"rgba(74,222,128,0.15)",border:"1px solid rgba(74,222,128,0.4)",borderRadius:8,padding:"10px 14px",color:"#4ADE80",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600}}>
                <LinkIcon size={14}/> Add Link
              </button>
            </div>

            {/* 3. Upload File (Limited) */}
            <div>
              <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileUpload} style={{display:"none"}} />
              <button onClick={()=>fileInputRef.current.click()} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px dashed #64748B",borderRadius:8,padding:"10px",color:"#94A3B8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13}}>
                <Upload size={14}/> Upload PDF (Max 2MB)
              </button>
            </div>
          </div>

          {prof.papers?.map(paper=>(
            <div key={paper.id} style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${selPaper?.id===paper.id?"#38BDF866":"#1E3A5F"}`}}>
              <div style={{fontSize:14,fontWeight:700,lineHeight:1.4,marginBottom:6,color:"#E2E8F0"}}>{paper.title}</div>
              <div style={{fontSize:11,color:"#64748B",marginBottom:10}}>{paper.authors} · {paper.year} · {paper.source}</div>
              
              {paper.externalLink && (
                <a href={paper.externalLink} target="_blank" rel="noreferrer" style={{display:"inline-block",fontSize:12,color:"#38BDF8",marginBottom:10,textDecoration:"none",background:"rgba(56,189,248,0.1)",padding:"4px 8px",borderRadius:4}}>
                  <LinkIcon size={12} style={{marginRight:4,verticalAlign:"middle"}}/> Open External Link
                </a>
              )}
              {paper.pdfBase64 && (
                <div style={{marginBottom:10}}>
                   <a href={paper.pdfBase64} download={paper.title+".pdf"} style={{display:"inline-block",fontSize:12,color:"#4ADE80",textDecoration:"none",background:"rgba(74,222,128,0.1)",padding:"4px 8px",borderRadius:4}}>
                     <Download size={12} style={{marginRight:4,verticalAlign:"middle"}}/> Download Saved PDF
                   </a>
                </div>
              )}

              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>{setSelPaper(paper);setTab("email");}}
                  style={{flex:1,background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.35)",borderRadius:8,padding:"8px 12px",color:"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:600}}>
                  <Brain size={12} style={{marginRight:4,verticalAlign:"middle"}}/> Use for Email
                </button>
                <button onClick={()=>{onUpdate({papers:prof.papers.filter(p=>p.id!==paper.id)});if(selPaper?.id===paper.id)setSelPaper(null);}}
                  style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:8,cursor:"pointer",display:"flex"}}>
                  <Trash2 size={12} color="#F87171"/>
                </button>
              </div>
            </div>
          ))}
        </>}

        {tab==="email"&&<>
          {selPaper?(
            <div style={{background:"rgba(14,116,144,0.15)",border:"1px solid rgba(56,189,248,0.3)",borderRadius:10,padding:13,marginBottom:14}}>
              <div style={{fontSize:10,color:"#38BDF8",fontWeight:800,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>📄 Selected Paper</div>
              <div style={{fontSize:13,fontWeight:700,color:"#E2E8F0",marginBottom:4}}>{selPaper.title}</div>
            </div>
          ):(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"#64748B",marginBottom:8,fontWeight:600}}>Select paper for email:</div>
              {prof.papers?.map(p=>(
                <button key={p.id} onClick={()=>{setSelPaper(p);}}
                  style={{display:"block",width:"100%",textAlign:"left",background:selPaper?.id===p.id?"rgba(14,116,144,0.2)":"#0A1628",border:`1px solid ${selPaper?.id===p.id?"#38BDF866":"#1E3A5F"}`,borderRadius:9,padding:11,color:"#E2E8F0",cursor:"pointer",marginBottom:6,fontSize:13}}>
                  {p.title}
                </button>
              ))}
            </div>
          )}

          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Quick Template</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {[["semiconductor","Ion Implant"],["ml","ML/Materials"],["materials","Radiation"]].map(([key,lbl])=>(
                <button key={key} onClick={()=>{
                  const t=EMAIL_TEMPLATES[key];
                  const filled=t.body.replace("[Prof Name]",prof.name.split(" ").pop()).replace("[Lastname]",prof.name.split(" ").pop());
                  setEmail(filled);
                  localStorage.setItem("pt_email_draft_"+prof.id, filled);
                }} style={{padding:"5px 12px",borderRadius:20,border:"1px solid #1E3A5F",background:"#060D1A",color:"#94A3B8",cursor:"pointer",fontSize:11,fontWeight:600}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <button onClick={doGenEmail} disabled={genning} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:12,padding:14,color:"white",fontSize:14,fontWeight:800,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:9,letterSpacing:"-0.3px",opacity:genning?0.7:1}}>
            {genning?<RefreshCw size={18} style={{animation:"spin 1s linear infinite"}}/>:<Brain size={18}/>}
            {genning?"Generating...":"Generate Email with Gemini"}
          </button>

          {email&&<>
            <div style={{background:"#0A1628",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #1E3A5F"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#E2E8F0",textTransform:"uppercase",letterSpacing:"0.5px"}}>Email Draft</div>
                <button onClick={()=>{navigator.clipboard.writeText(email);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
                  style={{background:copied?"rgba(22,163,74,0.15)":"rgba(2,132,199,0.1)",border:`1px solid ${copied?"rgba(74,222,128,0.4)":"rgba(56,189,248,0.35)"}`,borderRadius:8,padding:"6px 12px",color:copied?"#4ADE80":"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"all 0.2s"}}>
                  <Copy size={12}/>{copied?"Copied!":"Copy All"}
                </button>
              </div>
              <textarea value={email} onChange={e=>{setEmail(e.target.value);localStorage.setItem("pt_email_draft_"+prof.id,e.target.value);}}
                style={{...inp,width:"100%",minHeight:340,resize:"vertical",lineHeight:1.8,fontFamily:"Georgia,serif",fontSize:13}}/>
            </div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(22,163,74,0.1)",border:"1px solid rgba(74,222,128,0.35)",borderRadius:12,padding:14,color:"#4ADE80",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"-0.3px"}}>
              <CheckCircle size={18}/>Mark as Sent (Saves Text)
            </button>
          </>}
        </>}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function ProfTracker() {
  const [authed, setAuthed] = useState(()=>sessionStorage.getItem("pt_auth")==="1");
  if(!authed) return <AuthGate onAuth={()=>setAuthed(true)}/>;

  const [profs, setProfs] = useState(()=>{
    try { const s=localStorage.getItem("pt_v2"); return s?JSON.parse(s):INIT_PROFS; }
    catch { return INIT_PROFS; }
  });
  const [view,setView]       = useState("home");
  const [catId,setCatId]     = useState(null);
  const [profId,setProfId]   = useState(null);
  const [addModal,setAddModal]= useState(false);
  const [activityLog, setActivityLog] = useState(getActivityLog);
  const [search,setSearch]   = useState("");
  const [cFilter,setCFilter] = useState("All");
  const [tFilter,setTFilter] = useState("All");
  const [sFilter,setSFilter] = useState("All");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(()=>{ try{localStorage.setItem("pt_v2",JSON.stringify(profs));}catch{} },[profs]);

  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default") Notification.requestPermission();
    const due = profs.filter(p=>p.followUpDate && daysSince(p.followUpDate)>=0 && p.status==="email_sent");
    if(due.length>0 && "Notification" in window && Notification.permission==="granted"){
      due.slice(0,3).forEach(p=>{
        new Notification("📧 Follow-up Due — ProfTracker",{body:`Time to follow up with ${p.name}`});
      });
    }
  },[]);

  const update = (id,upd) => {
    setProfs(p=>p.map(x=>x.id===id?{...x,...upd}:x));
    setActivityLog(getActivityLog());
  };
  const del    = id        => setProfs(p=>p.filter(x=>x.id!==id));
  const add    = prof      => {
    logActivity(prof.id, prof.name, "Professor Added", prof.university);
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

  /* Detail view Layout Wrapping */
  if(view==="detail"&&profId){
    const prof=profs.find(p=>p.id===profId);
    if(!prof){setView("home");return null;}
    return (
      <div style={{background:"#030712",minHeight:"100vh",display:"flex",justifyContent:"center"}}>
         <div style={{width:"100%",maxWidth:1200,background:"#060D1A",boxShadow:"0 0 40px rgba(0,0,0,0.8)",position:"relative"}}>
            <DetailView prof={prof} onBack={()=>setView(catId?"category":"home")} onUpdate={upd=>update(profId,upd)} onDelete={()=>{del(profId);setView("home");}}/>
         </div>
      </div>
    );
  }

  /* Category view Layout Wrapping */
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
      <div style={{background:"#030712",minHeight:"100vh",display:"flex",justifyContent:"center"}}>
        <div style={{width:"100%",maxWidth:1200,background:"#060D1A",boxShadow:"0 0 40px rgba(0,0,0,0.8)",position:"relative",minHeight:"100vh",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
          <div style={{background:"#0A1628",padding:"14px 20px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #1E3A5F",position:"sticky",top:0,zIndex:10}}>
            <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontWeight:600}}><ArrowLeft size={15}/> Back</button>
            <div style={{width:1,height:18,background:"#1E3A5F"}}/>
            <Icon size={16} color={cat?.color}/>
            <span style={{fontSize:16,fontWeight:800,letterSpacing:"-0.3px",color:"#E2E8F0"}}>{cat?.label}</span>
            <span style={{marginLeft:"auto",background:cat?.bg,color:cat?.color,padding:"3px 10px",borderRadius:12,fontSize:12,fontWeight:700,border:`1px solid ${cat?.color}33`}}>{list.length} of {getCatProfs(catId).length}</span>
          </div>

          <div style={{padding:"12px 20px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:"1px solid #1E3A5F"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#0A1628",border:"1px solid #1E3A5F",borderRadius:8,padding:"8px 12px",flex:1,minWidth:150}}>
              <Search size={13} color="#64748B"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name / university..."
                style={{background:"none",border:"none",color:"#E2E8F0",outline:"none",fontSize:13,width:"100%"}}/>
            </div>
            {[[countries,cFilter,setCFilter,"Country"],
              [["All","1","2","3"],tFilter,setTFilter,"Tier"],
              [["All",...Object.keys(STATUS)],sFilter,setSFilter,"Status"]
            ].map(([opts,val,fn,ph],i)=>(
              <select key={i} value={val} onChange={e=>fn(e.target.value)}
                style={{background:"#0A1628",border:"1px solid #1E3A5F",color:val==="All"?"#64748B":"#E2E8F0",borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none"}}>
                {opts.map(o=><option key={o} value={o}>{o==="All"?ph:(i===1?`Tier ${o}`:(STATUS[o]?.label||o))}</option>)}
              </select>
            ))}
          </div>

          <div style={{padding:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:12}}>
            {list.map(p=><ProfCard key={p.id} prof={p} onClick={()=>{setProfId(p.id);setView("detail");}}/>)}
            {list.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"#64748B",padding:60,fontSize:14}}>No professors match. Try adjusting filters.</div>}
          </div>

          <button onClick={()=>setAddModal(true)} style={{position:"fixed",bottom:24,right:24,background:`linear-gradient(135deg,${cat?.color||"#38BDF8"},${cat?.color||"#38BDF8"}88)`,border:"none",borderRadius:"50%",width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${cat?.color||"#38BDF8"}44`}}>
            <Plus color="white" size={22}/>
          </button>
          {addModal&&<AddModal defaultCat={catId} onAdd={p=>{add(p);setAddModal(false);}} onClose={()=>setAddModal(false)}/>}
        </div>
      </div>
    );
  }

  /* Home view Layout Wrapping */
  const nav = id => {setCatId(id);setCFilter("All");setTFilter("All");setSFilter("All");setSearch("");setView("category");};

  return (
    <div style={{background:"#030712",minHeight:"100vh",display:"flex",justifyContent:"center",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} body{background:#030712}`}</style>
      
      <div style={{width:"100%",maxWidth:1200,background:"#060D1A",boxShadow:"0 0 40px rgba(0,0,0,0.8)",position:"relative",minHeight:"100vh"}}>
        
        {/* Top bar */}
        <div style={{background:"#0A1628",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1E3A5F",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:"-0.8px",background:"linear-gradient(135deg,#38BDF8,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🎓 ProfTracker</div>
            <div style={{fontSize:10,color:"#64748B",fontFamily:"'SF Mono',monospace",marginTop:1}}>PhD Outreach — Fall 2027</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={exportData} title="Export backup" style={{background:"rgba(255,255,255,0.04)",border:"1px solid #1E3A5F",borderRadius:8,padding:7,cursor:"pointer",display:"flex"}}><Download size={14} color="#64748B"/></button>
            <button onClick={importData} title="Import backup" style={{background:"rgba(255,255,255,0.04)",border:"1px solid #1E3A5F",borderRadius:8,padding:7,cursor:"pointer",display:"flex"}}><Upload size={14} color="#64748B"/></button>
            <button onClick={()=>setShowSettings(true)} title="Settings" style={{background:!getKey()?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${!getKey()?"#FBBF24":"#1E3A5F"}`,borderRadius:8,padding:7,cursor:"pointer",display:"flex"}}><Settings size={14} color={!getKey()?"#FBBF24":"#64748B"}/></button>

            <div style={{position:"relative",cursor:"pointer"}}>
              <Bell size={20} color="#64748B"/>
              {followUps.length>0&&<div style={{position:"absolute",top:-7,right:-7,background:"#DC2626",color:"white",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{followUps.length}</div>}
            </div>
          </div>
        </div>

        {followUps.length>0&&(
          <div style={{background:"rgba(185,28,28,0.2)",borderBottom:"1px solid rgba(239,68,68,0.25)",padding:"10px 20px",display:"flex",gap:8,alignItems:"center"}}>
            <AlertTriangle size={13} color="#FCA5A5"/>
            <span style={{fontSize:13,color:"#FCA5A5",fontWeight:600}}>Follow-up due: {followUps[0].name}{followUps.length>1?` (+${followUps.length-1} more)`:""}</span>
            <button onClick={()=>{setProfId(followUps[0].id);setView("detail");}} style={{marginLeft:"auto",background:"none",border:"1px solid #FCA5A580",borderRadius:7,padding:"3px 10px",color:"#FCA5A5",cursor:"pointer",fontSize:12,fontWeight:600}}>View →</button>
          </div>
        )}

        <div style={{display:"flex",flexWrap:"wrap"}}>
          {/* Main Left Content */}
          <div style={{flex:1,minWidth:300,padding:20}}>
            
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,animation:"fadeIn 0.4s ease",marginBottom:20}}>
              {[{lbl:"Professors",val:stats.total,icon:Users,c:"#38BDF8"},{lbl:"Emailed",val:stats.sent,icon:Mail,c:"#C084FC"},{lbl:"Replied",val:stats.replied,icon:CheckCircle,c:"#4ADE80"},{lbl:"Follow-ups",val:stats.fu,icon:Bell,c:"#FBBF24"}].map(({lbl,val,icon:Icon,c})=>(
                <div key={lbl} style={{background:"#0A1628",borderRadius:12,padding:"14px 12px",border:"1px solid #1E3A5F"}}>
                  <Icon size={15} color={c}/>
                  <div style={{fontSize:24,fontWeight:900,marginTop:8,color:c,letterSpacing:"-1px",fontVariantNumeric:"tabular-nums"}}>{val}</div>
                  <div style={{fontSize:10,color:"#64748B",marginTop:2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</div>
                </div>
              ))}
            </div>

            <div style={{fontSize:10,color:"#64748B",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Research Categories</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginBottom:24}}>
              {CATEGORIES.map((cat,i)=>{
                const cp=getCatProfs(cat.id);
                const sent=cp.filter(p=>["email_sent","replied","interview"].includes(p.status)).length;
                const Icon=cat.icon;
                return (
                  <button key={cat.id} onClick={()=>nav(cat.id)} style={{background:cat.bg,border:`1px solid ${cat.color}33`,borderRadius:15,padding:16,textAlign:"left",cursor:"pointer",transition:"transform 0.15s, border-color 0.15s",animation:`fadeIn 0.4s ease ${i*0.04}s both`}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=cat.color+"66";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=cat.color+"55";}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <Icon size={20} color={cat.color}/>
                      <ChevronRight size={13} color={cat.color+"88"}/>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:"#E2E8F0",marginBottom:3,letterSpacing:"-0.3px"}}>{cat.label}</div>
                    <div style={{fontSize:11,color:"#94A3B8"}}>{cp.length} profs · {sent} contacted</div>
                    <div style={{marginTop:10,background:"rgba(0,0,0,0.3)",borderRadius:4,height:3,overflow:"hidden"}}>
                      <div style={{width:cp.length?`${(sent/cp.length)*100}%`:"0%",background:`linear-gradient(90deg,${cat.color}99,${cat.color})`,height:"100%",borderRadius:4,transition:"width 0.6s ease"}}/>
                    </div>
                  </button>
                );
              })}
            </div>

            {darkCards.length>0&&(
              <div style={{marginBottom:24}}>
                <div style={{fontSize:10,color:"#F87171",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>⚠ No Response (14+ Days)</div>
                {darkCards.map(p=>(
                  <div key={p.id} style={{background:"#110505",border:"1px solid #5C1A1A",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#E2E8F0"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#64748B",marginTop:2,fontFamily:"'SF Mono',monospace"}}>{daysSince(p.emailSentDate)}d · {p.university}</div>
                    </div>
                    <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#F87171",borderRadius:7,padding:"5px 11px",fontSize:12,fontWeight:600,cursor:"pointer"}}>View</button>
                  </div>
                ))}
              </div>
            )}

            {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).length>0&&(
              <div style={{marginBottom:24}}>
                <div style={{fontSize:10,color:"#C084FC",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>📅 Scheduled for Today</div>
                {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).map(p=>(
                  <div key={p.id} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(192,132,252,0.25)",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#E2E8F0"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{p.scheduledTime} local time · {p.university}</div>
                    </div>
                    <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(192,132,252,0.12)",border:"1px solid rgba(192,132,252,0.35)",color:"#C084FC",borderRadius:7,padding:"5px 11px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Open</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: Recent Activity */}
          <div style={{width:320,borderLeft:"1px solid #1E3A5F",padding:20,background:"rgba(10,22,40,0.3)"}}>
            <div style={{fontSize:10,color:"#64748B",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:6}}>
              <Clock size={12}/> Recent Activity
            </div>
            
            {activityLog.length===0&&<div style={{textAlign:"center",color:"#64748B",fontSize:12,padding:"20px 0"}}>No activity yet.</div>}
            
            {activityLog.slice(0,10).map(a=>(
              <div key={a.id} 
                   onClick={()=>{if(a.profId){setProfId(a.profId);setView("detail");}}}
                   style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 10px",borderBottom:"1px solid #1E3A5F",cursor:a.profId?"pointer":"default",borderRadius:6,transition:"background 0.2s"}}
                   onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                   onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                   title={a.profId?"Click to view Professor":""}>
                <div style={{width:28,height:28,borderRadius:"50%",background:
                  a.action.includes("Sent")?"rgba(2,132,199,0.15)":
                  a.action.includes("Replied")||a.action.includes("Interview")?"rgba(22,163,74,0.15)":
                  a.action.includes("Added")?"rgba(124,58,237,0.15)":
                  a.action.includes("Scheduled")?"rgba(124,58,237,0.15)":
                  "rgba(71,85,105,0.15)",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                  {a.action.includes("Sent")?<Mail size={12} color="#38BDF8"/>:
                   a.action.includes("Replied")||a.action.includes("Interview")?<CheckCircle size={12} color="#4ADE80"/>:
                   a.action.includes("Added")?<Plus size={12} color="#C084FC"/>:
                   a.action.includes("Scheduled")?<Calendar size={12} color="#C084FC"/>:
                   <Clock size={12} color="#94A3B8"/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#E2E8F0",lineHeight:1.3}}>{a.profName}</div>
                  <div style={{fontSize:11,color:"#94A3B8",marginTop:2,lineHeight:1.4}}>{a.action}{a.detail?" · "+a.detail:""}</div>
                  <div style={{fontSize:9,color:"#64748B",fontFamily:"'SF Mono',monospace",marginTop:4}}>{timeAgo(a.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAB */}
        <button onClick={()=>setAddModal(true)} style={{position:"fixed",bottom:24,right:24,background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:"50%",width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 24px rgba(124,58,237,0.4)",zIndex:100}}>
          <Plus color="white" size={22}/>
        </button>

        {addModal&&<AddModal onAdd={p=>{add(p);setAddModal(false);}} onClose={()=>setAddModal(false)}/>}
        {showSettings&&<SettingsModal onClose={()=>setShowSettings(false)}/>}
      </div>
    </div>
  );
}
