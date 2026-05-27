import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Cpu, Brain, Zap, Activity, Settings, CircuitBoard, Heart, Layers,
  Search, Plus, Mail, Bell, AlertTriangle, ArrowLeft, Send, Copy,
  Trash2, BookOpen, RefreshCw, Users, ChevronRight, X, CheckCircle,
  Download, Upload, Calendar, Sparkles, Clock, Link as LinkIcon, FileText,
  Sun, Moon, Loader
} from "lucide-react";

/* ─── SUPABASE INITIALIZATION ─── */
const SUPABASE_URL = "https://mpdqkxbkzuopgdfkstsz.supabase.co";
const SUPABASE_KEY = "sb_publishable_nlsp1dlPxOpaVOce2dwZvw_WWTJ4J0w";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ─── THEME CONSTANTS ─── */
const THEMES = {
  dark: {
    bg: "#030712", card: "#0A1628", cardDark: "#060D1A",
    border: "#1E3A5F", text: "#E2E8F0", muted: "#64748B",
    mutedText: "#94A3B8", hover: "rgba(255,255,255,0.04)",
    input: "#060D1A", dangerBg: "#110505", dangerBorder: "#5C1A1A"
  },
  light: {
    bg: "#E2E8F0", card: "#FFFFFF", cardDark: "#F8FAFC",
    border: "#CBD5E1", text: "#0F172A", muted: "#94A3B8",
    mutedText: "#64748B", hover: "rgba(0,0,0,0.03)",
    input: "#F1F5F9", dangerBg: "#FFF5F5", dangerBorder: "#FECACA"
  }
};

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
  USA:"🇺🇸", UK:"🇬🇧", Canada:"🇨🇦", Australia:"🇦🇺", Germany:"🇩🇪", France:"🇫🇷", Switzerland:"🇨🇭", Netherlands:"🇳🇱",
  Sweden:"🇸🇪", Finland:"🇫🇮", Denmark:"🇩🇰", Norway:"🇳🇴", Belgium:"🇧🇪", Austria:"🇦🇹", Italy:"🇮🇹", Spain:"🇪🇸",
  Luxembourg:"🇱🇺", Portugal:"🇵🇹", Poland:"🇵🇱", Czechia:"🇨🇿", Japan:"🇯🇵", Singapore:"🇸🇬", "South Korea":"🇰🇷", China:"🇨🇳",
  India:"🇮🇳", "New Zealand":"🇳🇿", Ireland:"🇮🇪", Israel:"🇮🇱",
};
const COUNTRIES = [...Object.keys(FLAGS), "Other"];

const COUNTRY_TZ = {
  'USA':'America/New_York', 'Finland':'Europe/Helsinki', 'Switzerland':'Europe/Zurich', 'UK':'Europe/London',
  'Germany':'Europe/Berlin', 'Sweden':'Europe/Stockholm', 'France':'Europe/Paris', 'Luxembourg':'Europe/Luxembourg',
  'Netherlands':'Europe/Amsterdam', 'Canada':'America/Toronto', 'Japan':'Asia/Tokyo', 'Denmark':'Europe/Copenhagen',
  'Belgium':'Europe/Brussels', 'Australia':'Australia/Sydney', 'Singapore':'Asia/Singapore',
};
const BD_TZ = 'Asia/Dhaka';

const getTzOffsetMin = (tz, date = new Date()) => {
  const utc  = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const local = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  return (local - utc) / 60000;
};

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
  return { profTime: '10:17', tz, bdTime: `${bdH}:${bdM}`, diffStr, tzLabel: tz.split('/').pop().replace('_', ' ') };
};

/* ─── UTILS ─── */
const daysSince = d => d ? Math.floor((Date.now()-new Date(d))/86400000) : null;
const isDark    = p => p.status==="email_sent" && p.emailSentDate && daysSince(p.emailSentDate)>=14;
const uid       = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const today     = () => new Date().toISOString().split("T")[0];
const fuDate    = days => new Date(Date.now()+days*86400000).toISOString().split("T")[0];

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

/* ─── AUTH GATE (Supabase) ─── */
function AuthGate({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if(!email || !password) return alert("Email & Password required");
    setLoading(true);
    if(isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if(error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if(error) alert(error.message);
      else alert("Sign up successful! Please log in.");
    }
    setLoading(false);
  };

  return (
    <div style={{background:"#030712",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#0A1628",borderRadius:16,padding:36,width:340,boxShadow:"0 10px 30px rgba(0,0,0,0.5)",border:"1px solid #1E3A5F",textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>🎓</div>
        <div style={{fontSize:24,fontWeight:800,color:"#E2E8F0",marginBottom:4,letterSpacing:"-0.5px"}}>ProfTracker</div>
        <div style={{fontSize:15,color:"#64748B",marginBottom:24}}>Secure Cloud Dashboard</div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",background:"#060D1A",border:`1px solid #1E3A5F`,borderRadius:10,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",color:"#E2E8F0",marginBottom:10}}/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&handleAuth()} style={{width:"100%",background:"#060D1A",border:`1px solid #1E3A5F`,borderRadius:10,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",color:"#E2E8F0",marginBottom:16}}/>
        
        <button onClick={handleAuth} disabled={loading} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:10,padding:14,color:"white",fontSize:16,fontWeight:700,cursor:"pointer",marginBottom:16}}>
          {loading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
        </button>
        <div onClick={()=>setIsLogin(!isLogin)} style={{fontSize:13,color:"#38BDF8",cursor:"pointer"}}>{isLogin ? "Need an account? Sign Up" : "Have an account? Login"}</div>
      </div>
    </div>
  );
}

/* ─── EMAIL TEMPLATES ─── */
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
function ProfCard({ prof, onClick, t }) {
  const dark = isDark(prof);
  const st   = STATUS[prof.status]||STATUS.not_contacted;
  const ds   = daysSince(prof.emailSentDate);
  return (
    <div onClick={onClick} style={{background:dark?t.dangerBg:t.card,border:`1px solid ${dark?t.dangerBorder:t.border}`,borderRadius:14,padding:18,cursor:"pointer",opacity:dark?0.85:1,position:"relative",transition:"transform 0.15s, box-shadow 0.15s",userSelect:"none",boxShadow:"0 4px 10px rgba(0,0,0,0.05)"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.1)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 10px rgba(0,0,0,0.05)";}}>
      <div style={{position:"absolute",top:14,right:14,fontSize:12,fontWeight:800,padding:"3px 8px",borderRadius:6,background:prof.tier===1?"rgba(239,68,68,0.15)":prof.tier===2?"rgba(251,191,36,0.12)":"rgba(74,222,128,0.1)",color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80",border:`1px solid ${prof.tier===1?"#F8717144":prof.tier===2?"#FBBF2444":"#4ADE8044"}`}}>T{prof.tier}</div>
      <div style={{paddingRight:40}}>
        <div style={{fontSize:12,color:t.muted,marginBottom:4,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country}</div>
        <div style={{fontSize:16,fontWeight:800,lineHeight:1.3,marginBottom:4,color:t.text}}>{prof.name}</div>
        <div style={{fontSize:13,color:t.mutedText,marginBottom:12}}>{prof.university}</div>
      </div>
      <div style={{fontSize:13,color:t.muted,marginBottom:12,lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{prof.researchFocus}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {prof.categories?.slice(0,2).map(cId=>{const c=CATEGORIES.find(x=>x.id===cId);return c?<span key={cId} style={{fontSize:11,background:c.bg,color:c.color,padding:"3px 8px",borderRadius:6,border:`1px solid ${c.color}33`,fontWeight:700,letterSpacing:"0.3px"}}>{c.label}</span>:null;})}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:st.dot,flexShrink:0}}/>
          <span style={{fontSize:13,color:st.color,fontWeight:700}}>{st.label}</span>
        </div>
        {ds!==null&&<span style={{fontSize:12,color:dark?"#F87171":t.muted,fontFamily:"'SF Mono',monospace",fontWeight:600}}>{dark?`⚠ ${ds}d no reply`:`${ds}d ago`}</span>}
      </div>
    </div>
  );
}

/* ─── ADD MODAL ─── */
function AddModal({ onAdd, onClose, defaultCat, profs, t }) {
  const [mode, setMode]         = useState("auto");
  const [urlInput, setUrlInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [fetched,  setFetched]  = useState(false);
  const [f, setF] = useState({ name:"", university:"", country:"USA", email:"", profileUrl:"", categories: defaultCat ? [defaultCat] : [], tier:1, researchFocus:"", notes:"" });

  const set       = (k, v) => setF(p => ({ ...p, [k]: v }));
  const selectCat = id => setF(p => ({ ...p, categories: [id] })); 
  
  const inp = { background:t.input, border:`1px solid ${t.border}`, borderRadius:8, padding:"12px 14px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", width:"100%" };

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
    if (!f.name.trim() || !f.university.trim()) return setFetchErr("Name and University are required.");
    if (f.categories.length === 0) return setFetchErr("Please select 1 category.");
    if (f.email.trim()) {
      const isDuplicate = profs.some(p => p.email && p.email.toLowerCase().trim() === f.email.toLowerCase().trim());
      if (isDuplicate) return setFetchErr("Warning: A professor with this email is already added in the tracker!");
    }
    onAdd({ ...f, id:uid(), papers:[], status:"not_contacted", emailSentDate:null, followUpDate:null, scheduledDate:null, scheduledTime:"10:09", lastActivity:null });
  };

  const showForm = mode === "manual" || fetched;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:t.card,width:"100%",maxWidth:550,borderRadius:20,padding:"28px 24px",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",border:`1px solid ${t.border}`,boxShadow:"0 20px 40px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <span style={{fontSize:20,fontWeight:800,color:t.text,letterSpacing:"-0.3px"}}>Add Professor</span>
          <button onClick={onClose} style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:8,padding:8,cursor:"pointer",display:"flex"}}><X size={18} color={t.mutedText}/></button>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:24,background:t.cardDark,borderRadius:10,padding:6,border:`1px solid ${t.border}`}}>
          {[["auto","🔗 Auto (URL/Name)"],["manual","✏️ Manual"]].map(([m,lbl])=>(
            <button key={m} onClick={()=>{setMode(m);setFetched(false);setFetchErr("");}} style={{flex:1,padding:"10px 6px",borderRadius:8,border:"none",background:mode===m?"linear-gradient(135deg,#0369A1,#7C3AED)":"transparent",color:mode===m?"white":t.muted,cursor:"pointer",fontSize:15,fontWeight:700,transition:"all 0.2s"}}>{lbl}</button>
          ))}
        </div>

        {mode==="auto" && <>
          <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Professor URL or Name</label>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="URL or Name..." style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
            <button onClick={doFetch} disabled={fetching} style={{background:fetching?"rgba(124,58,237,0.3)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:8,padding:"12px 20px",color:"white",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
              {fetching?<RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>:<Search size={16}/>}
              {fetching?"Fetching...":"Fetch"}
            </button>
          </div>
          {fetchErr&&<div style={{fontSize:14,color:"#F87171",marginBottom:14,background:"rgba(239,68,68,0.08)",borderRadius:8,padding:"10px 14px",border:"1px solid rgba(239,68,68,0.2)",fontWeight:600}}>⚠ {fetchErr}</div>}
          {fetched&&<div style={{fontSize:14,color:"#4ADE80",marginBottom:20,background:"rgba(74,222,128,0.08)",borderRadius:8,padding:"10px 14px",border:"1px solid rgba(74,222,128,0.2)",fontWeight:600}}>✓ Info fetched! Review below, then save.</div>}
        </>}

        {showForm && <>
          {[[" Name *","name","text","Prof. Firstname Lastname"],["University *","university","text","e.g. MIT, EPFL"],["Email","email","email","prof@uni.edu"],["Profile URL","profileUrl","url","Faculty / Scholar page"],["Research Focus","researchFocus","text","Brief description"]].map(([lbl,k,typ,ph])=>(
            <div key={k} style={{marginBottom:16}}>
              <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</label>
              <input type={typ} placeholder={ph} value={f[k]} onChange={e=>set(k,e.target.value)} style={inp}/>
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Country</label>
            <select value={f.country} onChange={e=>set("country",e.target.value)} style={{...inp}}>
              {COUNTRIES.map(c=><option key={c} value={c}>{(FLAGS[c]||"🌍")+" "+c}</option>)}
            </select>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Tier</label>
            <div style={{display:"flex",gap:10}}>
              {[[1,"High","#F87171","rgba(239,68,68,0.1)"],[2,"Medium","#FBBF24","rgba(251,191,36,0.1)"],[3,"Explore","#4ADE80","rgba(74,222,128,0.1)"]].map(([tierLvl,desc,col,bg])=>(
                <button key={tierLvl} onClick={()=>set("tier",tierLvl)} style={{flex:1,padding:"12px 6px",borderRadius:10,border:`1px solid ${f.tier===tierLvl?col:t.border}`,background:f.tier===tierLvl?bg:"transparent",color:f.tier===tierLvl?col:t.mutedText,cursor:"pointer",fontWeight:800,fontSize:15}}>
                  T{tierLvl}<div style={{fontSize:11,fontWeight:500,marginTop:4}}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Category (Select 1)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>selectCat(c.id)} style={{padding:"8px 14px",borderRadius:20,border:`1px solid ${f.categories.includes(c.id)?c.color:t.border}`,background:f.categories.includes(c.id)?c.bg:"transparent",color:f.categories.includes(c.id)?c.color:t.muted,cursor:"pointer",fontSize:13,fontWeight:700}}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {fetchErr&&<div style={{fontSize:14,color:"#F87171",marginBottom:14,background:"rgba(239,68,68,0.08)",borderRadius:8,padding:"10px 14px",border:"1px solid rgba(239,68,68,0.2)",fontWeight:600}}>⚠ {fetchErr}</div>}
          <button onClick={handleAdd} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:12,padding:16,color:"white",fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:"-0.3px"}}>Save Professor</button>
        </>}
      </div>
    </div>
  );
}

/* ─── SETTINGS MODAL ─── */
function SettingsModal({ onClose, t }) {
  const [key, setKey] = useState(localStorage.getItem("pt_gemini_key") || "");
  const [saved, setSaved] = useState(false);
  const save = () => { localStorage.setItem("pt_gemini_key", key.trim()); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:t.card,borderRadius:16,padding:24,width:"100%",maxWidth:400,border:`1px solid ${t.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:16,fontWeight:800,color:t.text}}>⚙️ Settings</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.muted,cursor:"pointer"}}><X size={18}/></button>
        </div>
        <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Gemini API Key</label>
        <input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="AIzaSy..." style={{width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:8,padding:"12px 14px",color:t.text,fontSize:15,outline:"none",boxSizing:"border-box",marginBottom:12}} />
        <button onClick={save} style={{width:"100%",background:saved?"rgba(74,222,128,0.2)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:saved?"none":"none",borderRadius:10,padding:14,color:saved?"#4ADE80":"white",fontSize:15,fontWeight:800,cursor:"pointer"}}>
          {saved ? "✓ Saved!" : "Save Key"}
        </button>
      </div>
    </div>
  );
}

/* ─── DETAIL VIEW ─── */
function DetailView({ prof, onBack, onUpdate, onDelete, t, session, logActivity }) {
  const [tab,setTab]           = useState("overview");
  const [doi,setDoi]           = useState("");
  const [fetching,setFetching] = useState(false);
  const [fetchErr,setFetchErr] = useState("");
  const [selPaper,setSelPaper] = useState(prof.papers?.[0]||null);
  
  const fileInputRef = useRef(null);
  const [paperLink, setPaperLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const [email,setEmail]       = useState(()=>localStorage.getItem("pt_email_draft_"+prof.id)||"");
  const [genning,setGenning]   = useState(false);
  const [copied,setCopied]     = useState(false);
  const [notes,setNotes]       = useState(prof.notes||"");
  const [schedDate,setSchedDate]=useState(prof.scheduledDate||"");
  const [schedTime,setSchedTime]=useState(prof.scheduledTime||"10:09");
  const [fuDays,setFuDays]     = useState(14);

  const dark = isDark(prof);
  const ds   = daysSince(prof.emailSentDate);
  const inp  = {background:t.input,border:`1px solid ${t.border}`,borderRadius:8,padding:"12px 14px",color:t.text,fontSize:15,outline:"none",boxSizing:"border-box"};

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${uid()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    setUploading(true);
    const { error: uploadError } = await supabase.storage.from('papers').upload(filePath, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('papers').getPublicUrl(filePath);

    const np = { id:uid(), title: file.name, authors: "Uploaded PDF", year: new Date().getFullYear(), source: "Supabase Cloud", externalLink: publicUrl };
    onUpdate({papers:[...(prof.papers||[]), np]});
    setSelPaper(np);
    setUploading(false);
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
    if(!getKey()) { alert("Gemini API key is required! Check settings."); return; }
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
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{background:dark?t.dangerBg:t.card,padding:"20px 24px",borderBottom:`1px solid ${dark?t.dangerBorder:t.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:6,marginBottom:16,fontSize:14,fontWeight:700}}>
          <ArrowLeft size={16}/> Back
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:13,color:t.muted,marginBottom:4,fontFamily:"'SF Mono',monospace",fontWeight:600}}>{FLAGS[prof.country]||"🌍"} {prof.country} · <span style={{color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80"}}>Tier {prof.tier}</span></div>
            <div style={{fontSize:22,fontWeight:900,margin:"6px 0",letterSpacing:"-0.5px",color:t.text}}>{prof.name}</div>
            <div style={{fontSize:15,color:t.mutedText,fontWeight:500}}>{prof.university}</div>
          </div>
          <button onClick={()=>{if(window.confirm(`Remove ${prof.name}?`)){onDelete();}}} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex"}}>
            <Trash2 size={16} color="#F87171"/>
          </button>
        </div>
        <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(STATUS).map(([k,v])=>(
            <button key={k} onClick={()=>{ logActivity(prof.id, prof.name, v.label); onUpdate({status:k,lastActivity:new Date().toISOString()}); }}
              style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${prof.status===k?v.dot+"99":t.border}`,background:prof.status===k?v.dot+"22":"transparent",color:prof.status===k?v.color:t.muted,cursor:"pointer",fontSize:13,fontWeight:prof.status===k?800:600,transition:"all 0.15s",letterSpacing:"0.2px"}}>
              {v.label}
            </button>
          ))}
        </div>
        {dark&&<div style={{marginTop:16,background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:10,padding:"12px 16px",fontSize:14,color:"#FCA5A5",lineHeight:1.5,fontWeight:600}}>
          ⚠ {ds} days since email with no reply. Consider sending a follow-up or updating status.
        </div>}
      </div>

      <div style={{display:"flex",borderBottom:`1px solid ${t.border}`,background:t.cardDark,position:"sticky",top:0,zIndex:10}}>
        {[["overview","Overview"],["papers","Papers 📄"],["email","Email Gen 🤖"]].map(([tbl,lbl])=>(
          <button key={tbl} onClick={()=>setTab(tbl)} style={{flex:1,padding:16,border:"none",background:"none",color:tab===tbl?"#38BDF8":t.muted,fontWeight:tab===tbl?800:600,fontSize:15,cursor:"pointer",borderBottom:tab===tbl?"3px solid #38BDF8":"3px solid transparent",transition:"all 0.2s"}}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{padding:24}}>
        {tab==="overview"&&<>
          <div style={{background:t.card,borderRadius:14,padding:20,marginBottom:16,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:12,color:t.muted,marginBottom:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>Research Focus</div>
            <div style={{fontSize:16,lineHeight:1.7,color:t.text}}>{prof.researchFocus||"—"}</div>
          </div>

          <div style={{background:t.card,borderRadius:14,padding:20,marginBottom:16,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:12,color:t.muted,marginBottom:14,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>📅 Schedule Email</div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)} style={{...inp,flex:1}}/>
              <input type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)} style={{...inp,width:100}}/>
            </div>
            {schedDate && (()=>{
              const info = getScheduleInfo(prof.country, schedDate);
              return (
                <div style={{background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:14}}>
                  <div style={{fontSize:14,color:"#38BDF8",fontWeight:800,marginBottom:4}}>
                    {schedTime} {info.tzLabel} time
                  </div>
                  <div style={{fontSize:13,color:t.mutedText}}>
                    = <span style={{color:t.text,fontWeight:700}}>{(()=>{
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
            <button onClick={markScheduled} style={{width:"100%",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.4)",borderRadius:10,padding:14,color:"#C084FC",cursor:"pointer",fontSize:15,fontWeight:800,marginTop:8}}>
              <Calendar size={16} style={{marginRight:8,verticalAlign:"middle"}}/>Mark as Scheduled
            </button>
          </div>

          <div style={{background:t.card,borderRadius:14,padding:20,marginBottom:16,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:12,color:t.muted,marginBottom:14,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>✉️ Mark Email Sent</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:14,color:t.mutedText,fontWeight:600}}>Auto follow-up after</span>
              <select value={fuDays} onChange={e=>setFuDays(+e.target.value)} style={{...inp,padding:"8px 12px",flex:"none",width:100}}>
                {[7,14,21].map(d=><option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:10,padding:14,color:"#38BDF8",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Send size={16}/>Mark Email Sent Today
            </button>
          </div>

          {prof.emailSentDate&&<div style={{background:t.card,borderRadius:14,padding:18,marginBottom:16,border:`1px solid ${t.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Email Sent",prof.emailSentDate],["Follow-up",prof.followUpDate||"Not set"]].map(([k,v])=>(
              <div key={k} style={{background:t.cardDark,borderRadius:10,padding:14,border:`1px solid ${t.border}`}}>
                <div style={{fontSize:11,color:t.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>{k}</div>
                <div style={{fontSize:15,color:t.text,fontFamily:"'SF Mono',monospace",fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>}

          {prof.sentEmailText && (
            <div style={{background:t.card,borderRadius:14,padding:20,marginBottom:16,border:"1px solid #4ADE8055"}}>
               <div style={{fontSize:12,color:"#4ADE80",marginBottom:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px",display:"flex",alignItems:"center",gap:6}}>
                 <CheckCircle size={14}/> Saved Sent Email
               </div>
               <div style={{fontSize:14,lineHeight:1.7,color:t.mutedText,whiteSpace:"pre-wrap"}}>{prof.sentEmailText}</div>
            </div>
          )}

          <div style={{background:t.card,borderRadius:14,padding:20,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:12,color:t.muted,marginBottom:12,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>📝 Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} onBlur={()=>onUpdate({notes})}
              placeholder="Notes about funding, lab..."
              style={{...inp,width:"100%",minHeight:100,resize:"vertical",lineHeight:1.7,fontFamily:"inherit"}}/>
          </div>
        </>}

        {tab==="papers"&&<>
          <div style={{background:t.card,borderRadius:14,padding:20,marginBottom:18,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:14,color:t.text,marginBottom:14,fontWeight:800}}>➕ Add a Paper</div>
            
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <input value={doi} onChange={e=>setDoi(e.target.value)} placeholder="DOI (e.g. 10.1038/...)" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
              <button onClick={doFetch} disabled={fetching} style={{background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:8,padding:"12px 18px",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:15,fontWeight:700}}>
                {fetching?<RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>:<Search size={16}/>} Fetch
              </button>
            </div>
            {fetchErr&&<div style={{fontSize:14,color:"#F87171",marginBottom:14,fontWeight:600}}>{fetchErr}</div>}

            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <input value={paperLink} onChange={e=>setPaperLink(e.target.value)} placeholder="Google Drive or Web Link" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&handleLinkAdd()}/>
              <button onClick={handleLinkAdd} style={{background:"rgba(74,222,128,0.15)",border:"1px solid rgba(74,222,128,0.4)",borderRadius:8,padding:"12px 18px",color:"#4ADE80",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:15,fontWeight:700}}>
                <LinkIcon size={16}/> Add Link
              </button>
            </div>

            <div>
              <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileUpload} style={{display:"none"}} />
              <button onClick={()=>fileInputRef.current.click()} disabled={uploading} style={{width:"100%",background:t.hover,border:`1px dashed ${t.muted}`,borderRadius:10,padding:"14px",color:t.mutedText,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:15,fontWeight:600}}>
                {uploading ? <Loader size={16} style={{animation:"spin 1s linear infinite"}}/> : <Upload size={16}/>} 
                {uploading ? "Uploading to Cloud..." : "Upload PDF (Supabase Cloud)"}
              </button>
            </div>
          </div>

          {prof.papers?.map(paper=>(
            <div key={paper.id} style={{background:t.card,borderRadius:14,padding:20,marginBottom:14,border:`2px solid ${selPaper?.id===paper.id?"#38BDF8":t.border}`,boxShadow:selPaper?.id===paper.id?"0 0 15px rgba(56,189,248,0.15)":"none",transition:"all 0.2s"}}>
              <div style={{fontSize:16,fontWeight:800,lineHeight:1.4,marginBottom:8,color:t.text}}>{paper.title}</div>
              <div style={{fontSize:13,color:t.muted,marginBottom:12}}>{paper.authors} · {paper.year} · {paper.source}</div>
              
              {paper.externalLink && (
                <a href={paper.externalLink} target="_blank" rel="noreferrer" style={{display:"inline-block",fontSize:13,color:"#38BDF8",marginBottom:14,textDecoration:"none",background:"rgba(56,189,248,0.1)",padding:"6px 12px",borderRadius:6,fontWeight:700}}>
                  <LinkIcon size={14} style={{marginRight:6,verticalAlign:"middle"}}/> Open Paper Link
                </a>
              )}

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setSelPaper(paper);setTab("email");}}
                  style={{flex:1,background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.35)",borderRadius:10,padding:"10px 14px",color:"#38BDF8",cursor:"pointer",fontSize:14,fontWeight:700}}>
                  <Brain size={14} style={{marginRight:6,verticalAlign:"middle"}}/> Use for Email
                </button>
                <button onClick={()=>{onUpdate({papers:prof.papers.filter(p=>p.id!==paper.id)});if(selPaper?.id===paper.id)setSelPaper(null);}}
                  style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:10,cursor:"pointer",display:"flex"}}>
                  <Trash2 size={16} color="#F87171"/>
                </button>
              </div>
            </div>
          ))}
        </>}

        {tab==="email"&&<>
          {selPaper?(
            <div style={{background:"rgba(14,116,144,0.15)",border:"1px solid rgba(56,189,248,0.3)",borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontSize:12,color:"#38BDF8",fontWeight:800,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>📄 Selected Paper</div>
              <div style={{fontSize:15,fontWeight:800,color:t.text,marginBottom:4}}>{selPaper.title}</div>
            </div>
          ):(
            <div style={{marginBottom:18}}>
              <div style={{fontSize:13,color:t.muted,marginBottom:10,fontWeight:700}}>Select paper for email:</div>
              {prof.papers?.map(p=>(
                <button key={p.id} onClick={()=>{setSelPaper(p);}}
                  style={{display:"block",width:"100%",textAlign:"left",background:selPaper?.id===p.id?"rgba(14,116,144,0.2)":t.card,border:`2px solid ${selPaper?.id===p.id?"#38BDF8":t.border}`,borderRadius:10,padding:14,color:t.text,cursor:"pointer",marginBottom:8,fontSize:15,fontWeight:600,transition:"all 0.2s"}}>
                  {p.title}
                </button>
              ))}
            </div>
          )}

          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,color:t.muted,display:"block",marginBottom:8,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.5px"}}>Quick Template</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {[["semiconductor","Ion Implant"],["ml","ML/Materials"],["materials","Radiation"]].map(([key,lbl])=>(
                <button key={key} onClick={()=>{
                  const tmpl=EMAIL_TEMPLATES[key];
                  const filled=tmpl.body.replace("[Prof Name]",prof.name.split(" ").pop()).replace("[Lastname]",prof.name.split(" ").pop());
                  setEmail(filled);
                  localStorage.setItem("pt_email_draft_"+prof.id, filled);
                }} style={{padding:"8px 16px",borderRadius:20,border:`1px solid ${t.border}`,background:t.cardDark,color:t.mutedText,cursor:"pointer",fontSize:13,fontWeight:700}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <button onClick={doGenEmail} disabled={genning} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:14,padding:16,color:"white",fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10,letterSpacing:"-0.3px",opacity:genning?0.7:1}}>
            {genning?<RefreshCw size={20} style={{animation:"spin 1s linear infinite"}}/>:<Brain size={20}/>}
            {genning?"Generating...":"Generate Email with Gemini"}
          </button>

          {email&&<>
            <div style={{background:t.card,borderRadius:14,padding:20,marginBottom:16,border:`1px solid ${t.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:14,fontWeight:800,color:t.text,textTransform:"uppercase",letterSpacing:"0.5px"}}>Email Draft</div>
                <button onClick={()=>{navigator.clipboard.writeText(email);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
                  style={{background:copied?"rgba(22,163,74,0.15)":"rgba(2,132,199,0.1)",border:`1px solid ${copied?"rgba(74,222,128,0.4)":"rgba(56,189,248,0.35)"}`,borderRadius:8,padding:"8px 14px",color:copied?"#4ADE80":"#38BDF8",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
                  <Copy size={14}/>{copied?"Copied!":"Copy All"}
                </button>
              </div>
              <textarea value={email} onChange={e=>{setEmail(e.target.value);localStorage.setItem("pt_email_draft_"+prof.id,e.target.value);}}
                style={{...inp,width:"100%",minHeight:400,resize:"vertical",lineHeight:1.8,fontFamily:"Georgia,serif",fontSize:15}}/>
            </div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(22,163,74,0.1)",border:"1px solid rgba(74,222,128,0.35)",borderRadius:14,padding:16,color:"#4ADE80",cursor:"pointer",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:10,letterSpacing:"-0.3px"}}>
              <CheckCircle size={20}/>Mark as Sent (Saves Text)
            </button>
          </>}
        </>}
      </div>
    </div>
  );
}

/* ─── MAIN APP COMPONENT ─── */
export default function App() {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (!authChecked) return <div style={{background:"#030712", minHeight:"100vh"}}></div>;
  if (!session) return <AuthGate />;

  return <ProfTracker session={session} />;
}

/* ─── ACTUAL TRACKER LOGIC ─── */
function ProfTracker({ session }) {
  const [themeMode, setThemeMode] = useState(()=>localStorage.getItem("pt_theme")||"dark");
  const t = THEMES[themeMode];

  const toggleTheme = () => {
    const next = themeMode==="dark"?"light":"dark";
    setThemeMode(next);
    localStorage.setItem("pt_theme", next);
  };

  const [profs, setProfs] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [view,setView]       = useState("home");
  const [catId,setCatId]     = useState(null);
  const [profId,setProfId]   = useState(null);
  const [addModal,setAddModal]= useState(false);
  const [search,setSearch]   = useState("");
  const [cFilter,setCFilter] = useState("All");
  const [tFilter,setTFilter] = useState("All");
  const [sFilter,setSFilter] = useState("All");
  const [showSettings, setShowSettings] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load Data and Auto-Migrate from LocalStorage
  useEffect(() => {
    const loadData = async () => {
      const { data: pData } = await supabase.from('prof_data').select('data');
      const localData = localStorage.getItem('pt_v2');
      
      // Auto-Migration! If Supabase is empty but LocalStorage has data, move it to cloud
      if ((!pData || pData.length === 0) && localData) {
        const parsedLocal = JSON.parse(localData);
        if (parsedLocal.length > 0) {
          alert("Migrating your old local data to Supabase Cloud...");
          for (const p of parsedLocal) {
            await supabase.from('prof_data').insert({ id: p.id, user_id: session.user.id, data: p });
          }
          localStorage.removeItem('pt_v2'); 
          setProfs(parsedLocal);
        }
      } else if (pData) {
        setProfs(pData.map(row => row.data));
      }

      // Migrate Activity Log
      const { data: aData } = await supabase.from('activity_data').select('data').order('created_at', { ascending: false }).limit(30);
      const localLog = localStorage.getItem('pt_log');
      
      if ((!aData || aData.length === 0) && localLog) {
        const parsedLog = JSON.parse(localLog);
        for (const act of parsedLog) {
           await supabase.from('activity_data').insert({ id: act.id, user_id: session.user.id, data: act });
        }
        localStorage.removeItem('pt_log');
        setActivityLog(parsedLog);
      } else if (aData) {
        setActivityLog(aData.map(row => row.data));
      }
      
      setDataLoaded(true);
    };
    loadData();
  }, [session]);

  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default") Notification.requestPermission();
    const due = profs.filter(p=>p.followUpDate && daysSince(p.followUpDate)>=0 && p.status==="email_sent");
    if(due.length>0 && "Notification" in window && Notification.permission==="granted"){
      due.slice(0,3).forEach(p=>{
        new Notification("📧 Follow-up Due — ProfTracker",{body:`Time to follow up with ${p.name}`});
      });
    }
  },[profs]);

  // CRUD via Supabase + Optimistic UI
  const update = async (id, upd) => {
    const updatedProf = { ...profs.find(p=>p.id===id), ...upd };
    setProfs(p=>p.map(x=>x.id===id?updatedProf:x));
    await supabase.from('prof_data').update({ data: updatedProf }).eq('id', id);
  };
  
  const del = async (id) => {
    setProfs(p=>p.filter(x=>x.id!==id));
    await supabase.from('prof_data').delete().eq('id', id);
  };
  
  const add = async (prof) => {
    setProfs(p=>[...p,prof]);
    await supabase.from('prof_data').insert({ id: prof.id, user_id: session.user.id, data: prof });
    logAct(prof.id, prof.name, "Professor Added", prof.university);
  };

  const logAct = async (profId, profName, action, detail="") => {
    const newAct = { id:uid(), profId, profName, action, detail, time:new Date().toISOString() };
    setActivityLog(prev => [newAct, ...prev].slice(0,30));
    await supabase.from('activity_data').insert({ id: newAct.id, user_id: session.user.id, data: newAct });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(profs,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="proftracker_backup.json"; a.click();
  };
  const importData = () => {
    alert("Since data is in the cloud now, manual JSON import is disabled to prevent overwriting cloud data.");
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
  const nav = id => {setCatId(id);setCFilter("All");setTFilter("All");setSFilter("All");setSearch("");setView("category");};

  if(!dataLoaded) return <div style={{background:t.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:t.text}}><Loader size={30} style={{animation:"spin 1s linear infinite"}}/></div>;

  return (
    <div style={{background:t.bg,color:t.text,minHeight:"100vh",display:"flex",justifyContent:"center",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} body{background:${t.bg};margin:0;padding:0;}`}</style>
      
      <div style={{width:"100%",maxWidth:1300,background:t.card,boxShadow:"0 0 40px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        
        {/* GLOBAL HEADER */}
        <div style={{background:t.card,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${t.border}`,position:"sticky",top:0,zIndex:50}}>
          <div>
            <div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.8px",background:"linear-gradient(135deg,#38BDF8,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🎓 ProfTracker</div>
            <div style={{fontSize:12,color:t.muted,fontFamily:"'SF Mono',monospace",marginTop:2,fontWeight:600}}>PhD Outreach — Fall 2027</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={toggleTheme} title="Toggle Theme" style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:10,padding:10,cursor:"pointer",display:"flex"}}>{themeMode==="dark"?<Sun size={16} color="#FBBF24"/>:<Moon size={16} color="#64748B"/>}</button>
            <button onClick={exportData} title="Export backup" style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:10,padding:10,cursor:"pointer",display:"flex"}}><Download size={16} color={t.muted}/></button>
            <button onClick={()=>setShowSettings(true)} title="Settings" style={{background:!getKey()?"rgba(251,191,36,0.15)":t.hover,border:`1px solid ${!getKey()?"#FBBF24":t.border}`,borderRadius:10,padding:10,cursor:"pointer",display:"flex"}}><Settings size={16} color={!getKey()?"#FBBF24":t.muted}/></button>

            <div style={{position:"relative",cursor:"pointer",marginLeft:4}}>
              <Bell size={24} color={t.muted}/>
              {followUps.length>0&&<div style={{position:"absolute",top:-8,right:-8,background:"#DC2626",color:"white",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{followUps.length}</div>}
            </div>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        {followUps.length>0&&(
          <div style={{background:"rgba(220,38,38,0.15)",borderBottom:"1px solid rgba(239,68,68,0.3)",padding:"12px 24px",display:"flex",gap:10,alignItems:"center"}}>
            <AlertTriangle size={16} color="#FCA5A5"/>
            <span style={{fontSize:15,color:"#FCA5A5",fontWeight:700}}>Follow-up due: {followUps[0].name}{followUps.length>1?` (+${followUps.length-1} more)`:""}</span>
            <button onClick={()=>{setProfId(followUps[0].id);setView("detail");}} style={{marginLeft:"auto",background:"rgba(255,255,255,0.1)",border:"1px solid #FCA5A580",borderRadius:8,padding:"6px 14px",color:"#FCA5A5",cursor:"pointer",fontSize:14,fontWeight:700}}>View →</button>
          </div>
        )}

        <div style={{display:"flex",flex:1,alignItems:"flex-start"}}>
          {/* MAIN LEFT CONTENT AREA */}
          <div style={{flex:1,minWidth:0,paddingBottom:80}}>
            
            {/* --- HOME VIEW --- */}
            {view === "home" && (
              <div style={{padding:24}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,animation:"fadeIn 0.4s ease",marginBottom:28}}>
                  {[{lbl:"Professors",val:stats.total,icon:Users,c:"#38BDF8"},{lbl:"Emailed",val:stats.sent,icon:Mail,c:"#C084FC"},{lbl:"Replied",val:stats.replied,icon:CheckCircle,c:"#4ADE80"},{lbl:"Follow-ups",val:stats.fu,icon:Bell,c:"#FBBF24"}].map(({lbl,val,icon:Icon,c})=>(
                    <div key={lbl} style={{background:t.cardDark,borderRadius:14,padding:"18px 16px",border:`1px solid ${t.border}`,boxShadow:"0 4px 6px rgba(0,0,0,0.02)"}}>
                      <Icon size={18} color={c}/>
                      <div style={{fontSize:28,fontWeight:900,marginTop:10,color:c,letterSpacing:"-1px",fontVariantNumeric:"tabular-nums"}}>{val}</div>
                      <div style={{fontSize:12,color:t.muted,marginTop:4,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</div>
                    </div>
                  ))}
                </div>

                <div style={{fontSize:12,color:t.muted,fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:16}}>Research Categories</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:30}}>
                  {CATEGORIES.map((cat,i)=>{
                    const cp=getCatProfs(cat.id);
                    const sent=cp.filter(p=>["email_sent","replied","interview"].includes(p.status)).length;
                    const Icon=cat.icon;
                    return (
                      <button key={cat.id} onClick={()=>nav(cat.id)} style={{background:cat.bg,border:`1px solid ${cat.color}33`,borderRadius:16,padding:20,textAlign:"left",cursor:"pointer",transition:"transform 0.15s",animation:`fadeIn 0.4s ease ${i*0.04}s both`}}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <Icon size={24} color={cat.color}/>
                          <ChevronRight size={16} color={cat.color+"88"}/>
                        </div>
                        <div style={{fontSize:16,fontWeight:800,color:t.text,marginBottom:4,letterSpacing:"-0.3px"}}>{cat.label}</div>
                        <div style={{fontSize:13,color:t.mutedText,fontWeight:600}}>{cp.length} profs · {sent} contacted</div>
                        <div style={{marginTop:12,background:"rgba(0,0,0,0.1)",borderRadius:6,height:4,overflow:"hidden"}}>
                          <div style={{width:cp.length?`${(sent/cp.length)*100}%`:"0%",background:`linear-gradient(90deg,${cat.color}99,${cat.color})`,height:"100%",borderRadius:6,transition:"width 0.6s ease"}}/>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {darkCards.length>0&&(
                  <div style={{marginBottom:30}}>
                    <div style={{fontSize:12,color:"#F87171",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>⚠ No Response (14+ Days)</div>
                    {darkCards.map(p=>(
                      <div key={p.id} style={{background:t.dangerBg,border:`1px solid ${t.dangerBorder}`,borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:800,color:t.text}}>{p.name}</div>
                          <div style={{fontSize:13,color:t.muted,marginTop:4,fontFamily:"'SF Mono',monospace",fontWeight:600}}>{daysSince(p.emailSentDate)}d · {p.university}</div>
                        </div>
                        <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#F87171",borderRadius:8,padding:"8px 14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>View</button>
                      </div>
                    ))}
                  </div>
                )}
                
                {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).length>0&&(
                  <div style={{marginBottom:30}}>
                    <div style={{fontSize:12,color:"#C084FC",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>📅 Scheduled for Today</div>
                    {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).map(p=>(
                      <div key={p.id} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(192,132,252,0.25)",borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:800,color:t.text}}>{p.name}</div>
                          <div style={{fontSize:13,color:t.mutedText,marginTop:4,fontWeight:600}}>{p.scheduledTime} local time · {p.university}</div>
                        </div>
                        <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(192,132,252,0.12)",border:"1px solid rgba(192,132,252,0.35)",color:"#C084FC",borderRadius:8,padding:"8px 14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Open</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- CATEGORY VIEW --- */}
            {view === "category" && catId && (() => {
              const cat=CATEGORIES.find(c=>c.id===catId);
              let list=getCatProfs(catId);
              if(cFilter!=="All") list=list.filter(p=>p.country===cFilter);
              if(tFilter!=="All") list=list.filter(p=>p.tier===+tFilter);
              if(sFilter!=="All") list=list.filter(p=>p.status===sFilter);
              if(search) list=list.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.university.toLowerCase().includes(search.toLowerCase()));
              const countries=["All",...new Set(getCatProfs(catId).map(p=>p.country))];
              const Icon=cat?.icon||Cpu;
              return (
                <div style={{animation:"fadeIn 0.3s ease"}}>
                  <div style={{background:t.cardDark,padding:"16px 24px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${t.border}`}}>
                    <Icon size={20} color={cat?.color}/>
                    <span style={{fontSize:18,fontWeight:800,letterSpacing:"-0.3px",color:t.text}}>{cat?.label}</span>
                    <span style={{marginLeft:"auto",background:cat?.bg,color:cat?.color,padding:"4px 12px",borderRadius:14,fontSize:14,fontWeight:800,border:`1px solid ${cat?.color}33`}}>{list.length} of {getCatProfs(catId).length}</span>
                  </div>
                  <div style={{padding:"16px 24px",display:"flex",gap:10,flexWrap:"wrap",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,background:t.card,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",flex:1,minWidth:180}}>
                      <Search size={16} color={t.muted}/>
                      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name / university..."
                        style={{background:"none",border:"none",color:t.text,outline:"none",fontSize:15,width:"100%"}}/>
                    </div>
                    {[[countries,cFilter,setCFilter,"Country"],
                      [["All","1","2","3"],tFilter,setTFilter,"Tier"],
                      [["All",...Object.keys(STATUS)],sFilter,setSFilter,"Status"]
                    ].map(([opts,val,fn,ph],i)=>(
                      <select key={i} value={val} onChange={e=>fn(e.target.value)}
                        style={{background:t.card,border:`1px solid ${t.border}`,color:val==="All"?t.muted:t.text,borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none",fontWeight:600}}>
                        {opts.map(o=><option key={o} value={o}>{o==="All"?ph:(i===1?`Tier ${o}`:(STATUS[o]?.label||o))}</option>)}
                      </select>
                    ))}
                  </div>
                  <div style={{padding:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
                    {list.map(p=><ProfCard key={p.id} prof={p} t={t} onClick={()=>{setProfId(p.id);setView("detail");}}/>)}
                    {list.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:t.muted,padding:60,fontSize:16,fontWeight:600}}>No professors match. Try adjusting filters.</div>}
                  </div>
                </div>
              );
            })()}

            {/* --- DETAIL VIEW --- */}
            {view === "detail" && profId && (() => {
              const prof=profs.find(p=>p.id===profId);
              if(!prof){setView("home");return null;}
              return <DetailView prof={prof} t={t} session={session} logActivity={logAct} onBack={()=>setView(catId?"category":"home")} onUpdate={upd=>update(profId,upd)} onDelete={()=>{del(profId);setView("home");}}/>;
            })()}
            
          </div>

          {/* GLOBAL RIGHT SIDEBAR: RECENT ACTIVITY */}
          <div style={{width:350,position:"sticky",top:70,height:"calc(100vh - 70px)",borderLeft:`1px solid ${t.border}`,background:t.cardDark,overflowY:"auto",padding:"24px 20px"}}>
            <div style={{fontSize:12,color:t.muted,fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
              <Clock size={14}/> Recent Activity
            </div>
            
            {activityLog.length===0&&<div style={{textAlign:"center",color:t.muted,fontSize:14,padding:"30px 0",fontWeight:600}}>No activity yet.</div>}
            
            {activityLog.map(a=>(
              <div key={a.id} 
                   onClick={()=>{if(a.profId){setProfId(a.profId);setView("detail");}}}
                   style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 12px",borderBottom:`1px solid ${t.border}`,cursor:a.profId?"pointer":"default",borderRadius:8,transition:"background 0.2s"}}
                   onMouseEnter={e=>e.currentTarget.style.background=t.hover}
                   onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:32,height:32,borderRadius:"50%",background:
                  a.action.includes("Sent")?"rgba(2,132,199,0.15)":
                  a.action.includes("Replied")||a.action.includes("Interview")?"rgba(22,163,74,0.15)":
                  a.action.includes("Added")?"rgba(124,58,237,0.15)":
                  a.action.includes("Scheduled")?"rgba(124,58,237,0.15)":
                  "rgba(71,85,105,0.15)",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                  {a.action.includes("Sent")?<Mail size={14} color="#38BDF8"/>:
                   a.action.includes("Replied")||a.action.includes("Interview")?<CheckCircle size={14} color="#4ADE80"/>:
                   a.action.includes("Added")?<Plus size={14} color="#C084FC"/>:
                   a.action.includes("Scheduled")?<Calendar size={14} color="#C084FC"/>:
                   <Clock size={14} color={t.muted}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:t.text,lineHeight:1.3}}>{a.profName}</div>
                  <div style={{fontSize:13,color:t.mutedText,marginTop:4,lineHeight:1.4}}>{a.action}{a.detail?" · "+a.detail:""}</div>
                  <div style={{fontSize:11,color:t.muted,fontFamily:"'SF Mono',monospace",marginTop:6,fontWeight:600}}>{timeAgo(a.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GLOBAL FAB */}
        <button onClick={()=>setAddModal(true)} style={{position:"fixed",bottom:30,right:380,background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:"50%",width:60,height:60,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 6px 30px rgba(124,58,237,0.5)",zIndex:100}}>
          <Plus color="white" size={26}/>
        </button>

        {addModal&&<AddModal t={t} profs={profs} defaultCat={catId} onAdd={p=>{add(p);setAddModal(false);}} onClose={()=>setAddModal(false)}/>}
        {showSettings&&<SettingsModal t={t} onClose={()=>setShowSettings(false)}/>}
      </div>
    </div>
  );
}
