import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Cpu, Brain, Zap, Activity, Settings, CircuitBoard, Heart, Layers,
  Search, Plus, Mail, Bell, AlertTriangle, ArrowLeft, Send, Copy,
  Trash2, BookOpen, RefreshCw, Users, ChevronRight, X, CheckCircle,
  Download, Upload, Calendar, Sparkles, Clock, Link as LinkIcon, FileText,
  Loader, ExternalLink
} from "lucide-react";

/* ─── SUPABASE ─── */
const SUPABASE_URL = "https://mpdqkxbkzuopgdfkstsz.supabase.co";
const SUPABASE_KEY = "sb_publishable_nlsp1dlPxOpaVOce2dwZvw_WWTJ4J0w";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ─── THEMES ─── */
const THEMES = {
  dark: {
    bg:"#030712", card:"#0A1628", cardDark:"#060D1A",
    border:"#1E3A5F", text:"#E2E8F0", muted:"#64748B",
    mutedText:"#94A3B8", hover:"rgba(255,255,255,0.04)",
    input:"#060D1A", dangerBg:"#110505", dangerBorder:"#5C1A1A",
    label:"Dark"
  },
  dim: {
    bg:"#00000", card:"#22272E", cardDark:"#1C2128",
    border:"#373E47", text:"#ADBAC7", muted:"#545D68",
    mutedText:"#768390", hover:"rgba(177,186,196,0.08)",
    input:"#1C2128", dangerBg:"#2D1B1B", dangerBorder:"#5C2626",
    label:"Dim"
  },
  light: {
    bg:"#F0F2F5", card:"#FFFFFF", cardDark:"#F8FAFC",
    border:"#E2E8F0", text:"#0F172A", muted:"#94A3B8",
    mutedText:"#64748B", hover:"rgba(0,0,0,0.03)",
    input:"#F8FAFC", dangerBg:"#FFF5F5", dangerBorder:"#FECACA",
    label:"Light"
  }
};
const THEME_CYCLE = ["dark","dim","light"];
const THEME_ICONS = { dark:"🌑", dim:"🌗", light:"☀️" };

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
  not_contacted:{ label:"Not Contacted",  color:"#94A3B8", dot:"#475569" },
  scheduled:    { label:"Scheduled",      color:"#C084FC", dot:"#9333EA" },
  email_sent:   { label:"Email Sent",     color:"#38BDF8", dot:"#0284C7" },
  follow_up:    { label:"Follow-up Due",  color:"#FBBF24", dot:"#D97706" },
  replied:      { label:"Replied ✓",      color:"#4ADE80", dot:"#16A34A" },
  interview:    { label:"⭐ Interview",   color:"#FDE68A", dot:"#F59E0B" },
  no_response:  { label:"No Response",    color:"#F87171", dot:"#DC2626" },
  bounced:      { label:"⚠ Email Bounced",color:"#FB923C", dot:"#EA580C" },
};

const ME = {
  name:"Abdullah Shadek Fahim", cgpa:"3.80/4.00",
  uni:"Jashore University of Science and Technology (JUST), Bangladesh",
  thesis:"A Dual-Stage Hybrid Random Forest Framework for Forward and Inverse Modeling of Ion Implantation in Si, SiC, and GaAs",
  speedup:"415×",
  pubs:[
    "J1 (Under Review, Computational Materials Science, main author): Gatekeeper Constrained Dual-Stage Random Forest for Multi-Output Ion Range & Damage Prediction across Si, 4H-SiC, and GaAs",
    "J2 (Under Review, Fusion Engineering and Design, 2nd author): Hydrogen Implantation and Diffusion in BCC Tungsten — MD Study over 5–300 eV and 300–1500 K",
    "C1 (IEEE Xplore Published): CardioPredictor DOI: 10.1109/QPAIN66474.2025.11171821",
    "C2 (Accepted, IEEE ICOPS 2026): ML Surrogate for Rapid Forward and Reverse Ion Implantation Modeling in GaAs",
  ],
};

const FLAGS = {
  USA:"🇺🇸", UK:"🇬🇧", Canada:"🇨🇦", Australia:"🇦🇺", Germany:"🇩🇪", France:"🇫🇷",
  Switzerland:"🇨🇭", Netherlands:"🇳🇱", Sweden:"🇸🇪", Finland:"🇫🇮", Denmark:"🇩🇰",
  Norway:"🇳🇴", Belgium:"🇧🇪", Austria:"🇦🇹", Italy:"🇮🇹", Spain:"🇪🇸",
  Luxembourg:"🇱🇺", Portugal:"🇵🇹", Poland:"🇵🇱", Czechia:"🇨🇿", Ireland:"🇮🇪",
  Japan:"🇯🇵", Singapore:"🇸🇬", "South Korea":"🇰🇷", China:"🇨🇳", India:"🇮🇳",
  Israel:"🇮🇱", "New Zealand":"🇳🇿",
};
const COUNTRIES = [...Object.keys(FLAGS), "Other"];

const COUNTRY_TZ = {
  'USA':'America/New_York','Finland':'Europe/Helsinki','Switzerland':'Europe/Zurich',
  'UK':'Europe/London','Germany':'Europe/Berlin','Sweden':'Europe/Stockholm',
  'France':'Europe/Paris','Luxembourg':'Europe/Luxembourg','Netherlands':'Europe/Amsterdam',
  'Canada':'America/Toronto','Japan':'Asia/Tokyo','Denmark':'Europe/Copenhagen',
  'Belgium':'Europe/Brussels','Australia':'Australia/Sydney','Singapore':'Asia/Singapore',
  'Norway':'Europe/Oslo','Austria':'Europe/Vienna','Ireland':'Europe/Dublin',
};
const BD_TZ = 'Asia/Dhaka';

const getTzOffsetMin = (tz, date=new Date()) => {
  const utc=new Date(date.toLocaleString('en-US',{timeZone:'UTC'}));
  const local=new Date(date.toLocaleString('en-US',{timeZone:tz}));
  return (local-utc)/60000;
};
const getScheduleInfo = (country, dateStr) => {
  const tz=COUNTRY_TZ[country]||'America/New_York';
  const ref=dateStr?new Date(dateStr+'T12:00:00'):new Date();
  const profOff=getTzOffsetMin(tz,ref), bdOff=getTzOffsetMin(BD_TZ,ref);
  const diffMin=bdOff-profOff, profMin=10*60+17;
  const bdMin=((profMin+diffMin)%1440+1440)%1440;
  const bdH=String(Math.floor(bdMin/60)).padStart(2,'0'), bdM=String(bdMin%60).padStart(2,'0');
  return {profTime:'10:17',tz,bdTime:`${bdH}:${bdM}`,tzLabel:tz.split('/').pop().replace('_',' ')};
};

/* ─── UTILS ─── */
const daysSince = d => d?Math.floor((Date.now()-new Date(d))/86400000):null;
const isDark    = p => p.status==="email_sent"&&p.emailSentDate&&daysSince(p.emailSentDate)>=14;
const uid       = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const today     = () => new Date().toISOString().split("T")[0];
const fuDate    = days => new Date(Date.now()+days*86400000).toISOString().split("T")[0];
const timeAgo   = t => { const m=Math.floor((Date.now()-new Date(t))/60000); if(m<1)return"just now"; if(m<60)return m+"m ago"; const h=Math.floor(m/60); if(h<24)return h+"h ago"; return Math.floor(h/24)+"d ago"; };
const MAX_FILE_SIZE = 10*1024*1024; // 10 MB
const FAHIM_EMAIL = "asfahimbd@gmail.com";

// Load EmailJS SDK on demand
async function loadEmailJS() {
  if(window.emailjs) return;
  await new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload=res; s.onerror=rej;
    document.head.appendChild(s);
  });
}

// Send follow-up reminder to Fahim's own email via EmailJS
async function sendFollowUpEmail(prof, ejsKeys) {
  if(!ejsKeys?.serviceId||!ejsKeys?.templateId||!ejsKeys?.publicKey) return false;
  try {
    await loadEmailJS();
    window.emailjs.init(ejsKeys.publicKey);
    await window.emailjs.send(ejsKeys.serviceId, ejsKeys.templateId, {
      to_email:  FAHIM_EMAIL,
      prof_name: prof.name,
      prof_uni:  prof.university,
      days_since: String(daysSince(prof.emailSentDate)||0),
      sent_date: prof.emailSentDate||"",
      follow_up_date: prof.followUpDate||"",
    });
    return true;
  } catch(e) { console.error("EmailJS error:",e); return false; }
}

// Get EmailJS keys from localStorage
const getEJSKeys = () => {
  try { return JSON.parse(localStorage.getItem("pt_ejs")||"{}"); } catch { return {}; }
};

/* ─── API ─── */
const getKey = () => localStorage.getItem("pt_gemini_key")||"";

async function fetchPaper(doi) {
  try {
    const r=await fetch(`https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=title,abstract,year,authors,tldr`);
    if(r.ok){const d=await r.json();if(d.title)return{title:d.title,abstract:d.abstract||"",year:d.year,authors:d.authors?.map(a=>a.name).join(", ")||"",tldr:d.tldr?.text||"",source:"Semantic Scholar"};}
  } catch {}
  try {
    const r=await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if(r.ok){const{message:m}=await r.json();return{title:m.title?.[0]||"Unknown",abstract:(m.abstract||"").replace(/<[^>]+>/g,""),year:m.published?.["date-parts"]?.[0]?.[0]||"",authors:m.author?.map(a=>`${a.given||""} ${a.family||""}`.trim()).join(", ")||"",tldr:"",source:"CrossRef"};}
  } catch {}
  return null;
}

async function callGemini(prompt) {
  const key=getKey(); if(!key)throw new Error("NO_KEY");
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  const d=await r.json(); if(d.error)throw new Error(d.error.message);
  return d.candidates?.[0]?.content?.parts?.[0]?.text||"";
}

function extractJSON(text) {
  try{return JSON.parse(text.trim());}catch{}
  try{return JSON.parse(text.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim());}catch{}
  const m=text.match(/\{[\s\S]*\}/); if(m){try{return JSON.parse(m[0]);}catch{}}
  throw new Error("Could not parse JSON");
}

async function fetchProfFromURL(input) {
  const isURL=input.startsWith("http");
  let pageText="";
  if(isURL){try{const r=await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(input)}`);const d=await r.json();pageText=(d.contents||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,6000);}catch{}}
  const prompt=isURL&&pageText
    ?`Extract professor info from this webpage:\n${pageText}\nReturn ONLY raw JSON:\n{"name":"Prof. Full Name","university":"Full University Name","country":"Country","email":"email or empty","researchFocus":"2-3 sentence summary","profileUrl":"${input}"}`
    :`Find professor: "${input}"\nReturn ONLY raw JSON:\n{"name":"Prof. Full Name","university":"Full University Name","country":"Country","email":"email or empty","researchFocus":"2-3 sentence summary","profileUrl":"faculty page URL"}`;
  return extractJSON(await callGemini(prompt));
}

async function generateEmail(prof, paper) {
  return callGemini(`Write a cold PhD application email (200-250 words). Natural, slightly formal, NON-native English speaker feel.

APPLICANT: ${ME.name}, CGPA ${ME.cgpa}, ${ME.uni}
THESIS: ${ME.thesis} — ${ME.speedup} speedup over SRIM/Monte Carlo
PUBLICATIONS:
${ME.pubs.map(p=>`  • ${p}`).join("\n")}

PROFESSOR: ${prof.name}, ${prof.university} (${prof.country})
RESEARCH: ${prof.researchFocus}
PAPER: "${paper?.title||"General Research"}" (${paper?.year||""})
ABSTRACT: ${paper?.abstract?.slice(0,500)||"Based on general research area"}

RULES:
1. Start: "Dear Prof. [lastname],"
2. Para 1: ONE specific observation from the paper connecting to applicant work
3. Para 2: Who I am — CGPA, thesis, ${ME.speedup} speedup
4. Para 3: Publications (J1 under review, ICOPS accepted)
5. Para 4: Why this lab specifically
6. Para 5: PhD Fall 2027 request
7. Sign: "Best regards,\n${ME.name}"
8. NO "I am writing to express my interest"
9. Max 250 words`);
}

/* ─── EMAIL TEMPLATES (Personalized for Abdullah Shadek Fahim) ─── */
const EMAIL_TEMPLATES = {
  semiconductor:{
    label:"Semiconductor / Ion Implantation",
    body:`Dear Prof. [Lastname],

[PAPER HOOK — 1-2 sentences about a specific finding from their paper. Example: "Your recent work on radiation-induced defect formation in 4H-SiC caught my attention, particularly the cascade overlap behavior at high fluences and its implications for device reliability."]

I am Abdullah Shadek Fahim, a recent B.Sc. graduate in Electrical and Electronic Engineering from Jashore University of Science and Technology (JUST), Bangladesh (CGPA: 3.80/4.00). My undergraduate thesis developed a Dual-Stage Hybrid Random Forest surrogate framework for forward and inverse modeling of ion implantation across Si, 4H-SiC, and GaAs substrates — achieving a 415× computational speedup over SRIM/Monte Carlo simulation while preserving physical accuracy through a Gatekeeper constraint mechanism.

My publications include a first-author manuscript currently under review at Computational Materials Science on ML-based multi-output ion range and damage profile prediction, a second manuscript under review at Fusion Engineering and Design on MD simulation of hydrogen implantation in BCC tungsten (second author), and an accepted paper at IEEE ICOPS 2026 on ML surrogate modeling for GaAs ion implantation.

Your group's work on [SPECIFIC RESEARCH DIRECTION — e.g., radiation effects in wide-bandgap semiconductors / ion beam material modification] closely aligns with my background in physics-informed machine learning for ion-solid interactions. I am particularly interested in [SPECIFIC PROJECT or direction in their lab].

I am exploring PhD opportunities for Fall 2027 and would be grateful to learn whether your group anticipates any openings. Would you be open to a brief conversation?

Best regards,
Abdullah Shadek Fahim
B.Sc. EEE, JUST Bangladesh | CGPA: 3.80/4.00
asfahimbd@gmail.com`
  },
  ml:{
    label:"Machine Learning / Computational Materials",
    body:`Dear Prof. [Lastname],

[PAPER HOOK — 1-2 sentences referencing a specific technique, architecture, or result from their paper. Be concrete.]

I am Abdullah Shadek Fahim, a recent B.Sc. graduate in Electrical and Electronic Engineering from JUST, Bangladesh (CGPA: 3.80/4.00). My thesis designed a Dual-Stage Hybrid Random Forest surrogate model for ion implantation prediction in Si, 4H-SiC, and GaAs — achieving a 415× speedup over physics-based SRIM/Monte Carlo simulation. The framework uses a Gatekeeper constraint to maintain physical plausibility of ML predictions, and an inverse-design module for target-driven implantation parameter optimization.

I have a first-author manuscript under review at Computational Materials Science (multi-output ion range and damage profile prediction via ML), a second manuscript under review at Fusion Engineering and Design (MD study of hydrogen implantation in BCC tungsten, second author), and an accepted paper at IEEE ICOPS 2026.

Your research on [SPECIFIC ML METHOD or APPLICATION — e.g., neural network potentials / active learning for materials / Gaussian process surrogates] directly intersects with my work in physics-informed surrogate modeling for computational materials science. I am particularly drawn to [SPECIFIC ASPECT or paper from their group].

I am seeking PhD positions for Fall 2027. I would greatly appreciate knowing whether your group has openings and whether my background might be a good fit.

Best regards,
Abdullah Shadek Fahim
B.Sc. EEE, JUST Bangladesh | CGPA: 3.80/4.00
asfahimbd@gmail.com`
  },
  materials:{
    label:"Radiation Effects / Materials Processing",
    body:`Dear Prof. [Lastname],

[PAPER HOOK — cite a specific result about defect formation, radiation damage, or processing outcomes from their paper.]

I am Abdullah Shadek Fahim, a recent B.Sc. graduate in EEE from Jashore University of Science and Technology (JUST), Bangladesh (CGPA: 3.80/4.00). My undergraduate thesis built ML surrogate models to replace computationally expensive SRIM/Monte Carlo ion implantation simulations — achieving a 415× speedup for predicting ion range distributions and damage profiles in Si, 4H-SiC, and GaAs. The framework also includes an inverse-design module for process parameter optimization given target implantation profiles.

My publications: first-author manuscript under review at Computational Materials Science (ML-based ion implantation modeling), second manuscript under review at Fusion Engineering and Design (MD simulation of hydrogen implantation and diffusion in BCC tungsten, second author), and an accepted paper at IEEE ICOPS 2026.

Your work on [SPECIFIC TOPIC — e.g., cascade dynamics / defect thermodynamics / radiation damage in ceramics] resonates directly with my research. The surrogate modeling approach I developed could potentially be extended to [SPECIFIC APPLICATION relevant to their lab], and I would be very interested in exploring this further.

I am applying for PhD positions for Fall 2027. Would you have a moment to discuss whether there might be a fit?

Best regards,
Abdullah Shadek Fahim
B.Sc. EEE, JUST Bangladesh | CGPA: 3.80/4.00
asfahimbd@gmail.com`
  },
  followup:{
    label:"Follow-up Email",
    body:`Dear Prof. [Lastname],

I hope this message finds you well. I am writing to follow up on my email from [DATE SENT], in which I inquired about PhD opportunities in your group for Fall 2027.

I remain very interested in joining your research group, particularly in the area of [SPECIFIC RESEARCH TOPIC]. My work on ML surrogate models for ion implantation (415× speedup over SRIM/Monte Carlo, under review at Computational Materials Science) continues to progress, and I believe there is strong potential for synergy with your ongoing projects.

I understand you are likely very busy, and I appreciate any time you can spare. If there are no current openings, I would also welcome any guidance on suitable opportunities within your department or collaborating groups.

Thank you again for your consideration.

Best regards,
Abdullah Shadek Fahim
B.Sc. EEE, JUST Bangladesh | CGPA: 3.80/4.00
asfahimbd@gmail.com`
  },
};

/* ─── AUTH GATE ─── */
function AuthGate() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [isLogin,setIsLogin]=useState(true); const [loading,setLoading]=useState(false);
  const handleAuth=async()=>{
    if(!email||!password)return alert("Email & password required");
    setLoading(true);
    if(isLogin){const{error}=await supabase.auth.signInWithPassword({email,password});if(error)alert(error.message);}
    else{const{error}=await supabase.auth.signUp({email,password});if(error)alert(error.message);else alert("Check your email to confirm, then login.");}
    setLoading(false);
  };
  return (
    <div style={{background:"#030712",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#0A1628",borderRadius:20,padding:40,width:360,boxShadow:"0 20px 60px rgba(0,0,0,0.6)",border:"1px solid #1E3A5F",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🎓</div>
        <div style={{fontSize:26,fontWeight:900,color:"#E2E8F0",marginBottom:4,letterSpacing:"-0.8px",background:"linear-gradient(135deg,#38BDF8,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ProfTracker</div>
        <div style={{fontSize:14,color:"#64748B",marginBottom:28,fontWeight:600}}>Secure Cloud Dashboard</div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={{width:"100%",background:"#060D1A",border:"1px solid #1E3A5F",borderRadius:10,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",color:"#E2E8F0",marginBottom:10}}/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&handleAuth()} style={{width:"100%",background:"#060D1A",border:"1px solid #1E3A5F",borderRadius:10,padding:"14px 16px",fontSize:15,outline:"none",boxSizing:"border-box",color:"#E2E8F0",marginBottom:18}}/>
        <button onClick={handleAuth} disabled={loading} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:10,padding:15,color:"white",fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:16,opacity:loading?0.7:1}}>
          {loading?"Please wait…":(isLogin?"Login":"Create Account")}
        </button>
        <div onClick={()=>setIsLogin(!isLogin)} style={{fontSize:14,color:"#38BDF8",cursor:"pointer",fontWeight:600}}>
          {isLogin?"Need an account? Sign Up":"Have an account? Login"}
        </div>
      </div>
    </div>
  );
}

/* ─── PROF CARD ─── */
function ProfCard({prof,onClick,t}){
  const dark=isDark(prof),st=STATUS[prof.status]||STATUS.not_contacted,ds=daysSince(prof.emailSentDate);
  return (
    <div onClick={onClick} style={{background:dark?t.dangerBg:t.card,border:`1px solid ${dark?t.dangerBorder:t.border}`,borderRadius:14,padding:18,cursor:"pointer",opacity:dark?0.85:1,position:"relative",transition:"transform 0.15s,box-shadow 0.15s",userSelect:"none",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)";}}>
      <div style={{position:"absolute",top:14,right:14,fontSize:11,fontWeight:800,padding:"3px 8px",borderRadius:6,background:prof.tier===1?"rgba(239,68,68,0.15)":prof.tier===2?"rgba(251,191,36,0.12)":"rgba(74,222,128,0.1)",color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80"}}>T{prof.tier}</div>
      <div style={{paddingRight:42}}>
        <div style={{fontSize:11,color:t.muted,marginBottom:3,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country}</div>
        <div style={{fontSize:15,fontWeight:800,lineHeight:1.3,marginBottom:3,color:t.text}}>{prof.name}</div>
        <div style={{fontSize:12,color:t.mutedText,marginBottom:10}}>{prof.university}</div>
      </div>
      <div style={{fontSize:12,color:t.muted,marginBottom:10,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{prof.researchFocus}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {prof.categories?.slice(0,2).map(cId=>{const c=CATEGORIES.find(x=>x.id===cId);return c?<span key={cId} style={{fontSize:10,background:c.bg,color:c.color,padding:"2px 8px",borderRadius:6,border:`1px solid ${c.color}33`,fontWeight:700}}>{c.label}</span>:null;})}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:st.dot,flexShrink:0}}/>
          <span style={{fontSize:12,color:st.color,fontWeight:700}}>{st.label}</span>
        </div>
        {ds!==null&&<span style={{fontSize:11,color:dark?"#F87171":t.muted,fontFamily:"'SF Mono',monospace"}}>{dark?`⚠ ${ds}d no reply`:`${ds}d ago`}</span>}
      </div>
    </div>
  );
}

/* ─── ADD MODAL ─── */
function AddModal({onAdd,onClose,defaultCat,profs,t}){
  const [mode,setMode]=useState("auto");
  const [urlInput,setUrlInput]=useState("");
  const [fetching,setFetching]=useState(false);
  const [fetchErr,setFetchErr]=useState("");
  const [fetched,setFetched]=useState(false);
  const [f,setF]=useState({name:"",university:"",country:"USA",email:"",profileUrl:"",categories:defaultCat?[defaultCat]:[],tier:1,researchFocus:"",notes:""});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const selectCat=id=>setF(p=>({...p,categories:[id]}));
  const inp={background:t.input,border:`1px solid ${t.border}`,borderRadius:8,padding:"12px 14px",color:t.text,fontSize:14,outline:"none",boxSizing:"border-box",width:"100%"};

  const doFetch=async()=>{
    if(!urlInput.trim())return;
    setFetching(true);setFetchErr("");setFetched(false);
    try{
      if(!getKey()&&urlInput.startsWith("http")){
        // Semantic Scholar name search fallback (no API key)
        const lastName=urlInput.trim().split(" ").pop();
        const r=await fetch(`https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(urlInput.trim())}&fields=name,affiliations,homepage&limit=1`);
        const d=await r.json();
        const author=d.data?.[0];
        if(author?.name){setF(prev=>({...prev,name:author.name,university:author.affiliations?.[0]||prev.university,profileUrl:author.homepage||urlInput.trim()}));setFetched(true);}
        else setFetchErr("Not found. Fill manually or set Gemini key for AI fetch.");
      } else if(!getKey()){
        const r=await fetch(`https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(urlInput.trim())}&fields=name,affiliations,homepage&limit=1`);
        const d=await r.json();const author=d.data?.[0];
        if(author?.name){setF(prev=>({...prev,name:author.name,university:author.affiliations?.[0]||prev.university,profileUrl:author.homepage||""}));setFetched(true);}
        else setFetchErr("Not found. Fill manually.");
      } else {
        const result=await fetchProfFromURL(urlInput.trim());
        if(result?.name){setF(prev=>({...prev,...result,profileUrl:result.profileUrl||urlInput.trim()}));setFetched(true);}
        else setFetchErr("Could not extract info. Fill manually.");
      }
    }catch(e){setFetchErr("Fetch failed. Fill manually.");}
    setFetching(false);
  };

  const handleAdd=()=>{
    if(!f.name.trim()||!f.university.trim())return setFetchErr("Name and University are required.");
    if(f.categories.length===0)return setFetchErr("Please select a category.");
    if(f.email.trim()&&profs.some(p=>p.email&&p.email.toLowerCase()===f.email.toLowerCase()))
      return setFetchErr("A professor with this email already exists.");
    onAdd({...f,id:uid(),papers:[],status:"not_contacted",emailSentDate:null,followUpDate:null,scheduledDate:null,scheduledTime:"10:09",lastActivity:null});
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:t.card,width:"100%",maxWidth:540,borderRadius:20,padding:"28px 24px",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",border:`1px solid ${t.border}`,boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontSize:19,fontWeight:800,color:t.text}}>Add Professor</span>
          <button onClick={onClose} style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:8,padding:8,cursor:"pointer",display:"flex"}}><X size={17} color={t.mutedText}/></button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:22,background:t.cardDark,borderRadius:10,padding:5,border:`1px solid ${t.border}`}}>
          {[["auto","🔗 Auto (URL/Name)"],["manual","✏️ Manual"]].map(([m,lbl])=>(
            <button key={m} onClick={()=>{setMode(m);setFetched(false);setFetchErr("");}} style={{flex:1,padding:"9px 4px",borderRadius:8,border:"none",background:mode===m?"linear-gradient(135deg,#0369A1,#7C3AED)":"transparent",color:mode===m?"white":t.muted,cursor:"pointer",fontSize:14,fontWeight:700}}>{lbl}</button>
          ))}
        </div>
        {mode==="auto"&&<>
          <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Professor URL or Name</label>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="Type name or paste URL…" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
            <button onClick={doFetch} disabled={fetching} style={{background:fetching?"rgba(124,58,237,0.3)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:8,padding:"0 18px",color:"white",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",height:46}}>
              {fetching?<RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/>:<Search size={15}/>}{fetching?"…":"Fetch"}
            </button>
          </div>
          <div style={{fontSize:11,color:t.muted,marginBottom:12}}>Without Gemini key: searches Semantic Scholar by name. With key: AI-powered URL/page extraction.</div>
          {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginBottom:12,background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 12px",border:"1px solid rgba(239,68,68,0.2)"}}>⚠ {fetchErr}</div>}
          {fetched&&<div style={{fontSize:12,color:"#4ADE80",marginBottom:16,background:"rgba(74,222,128,0.08)",borderRadius:7,padding:"8px 12px",border:"1px solid rgba(74,222,128,0.2)"}}>✓ Found! Review below, set country, research focus, tier & category.</div>}
        </>}
        {(mode==="manual"||fetched)&&<>
          {[["Name *","name","text","Prof. Firstname Lastname"],["University *","university","text","e.g. MIT, EPFL"],["Email","email","email","prof@uni.edu"],["Profile URL","profileUrl","url","Scholar / Lab page"],["Research Focus","researchFocus","text","Brief description"]].map(([lbl,k,typ,ph])=>(
            <div key={k} style={{marginBottom:13}}>
              <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</label>
              <input type={typ} placeholder={ph} value={f[k]} onChange={e=>set(k,e.target.value)} style={inp}/>
            </div>
          ))}
          <div style={{marginBottom:13}}>
            <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Country</label>
            <select value={f.country} onChange={e=>set("country",e.target.value)} style={{...inp}}>{COUNTRIES.map(c=><option key={c} value={c}>{(FLAGS[c]||"🌍")+" "+c}</option>)}</select>
          </div>
          <div style={{marginBottom:13}}>
            <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Tier</label>
            <div style={{display:"flex",gap:8}}>
              {[[1,"High","#F87171","rgba(239,68,68,0.1)"],[2,"Medium","#FBBF24","rgba(251,191,36,0.1)"],[3,"Explore","#4ADE80","rgba(74,222,128,0.1)"]].map(([tv,desc,col,bg])=>(
                <button key={tv} onClick={()=>set("tier",tv)} style={{flex:1,padding:"10px 4px",borderRadius:9,border:`1px solid ${f.tier===tv?col:t.border}`,background:f.tier===tv?bg:"transparent",color:f.tier===tv?col:t.muted,cursor:"pointer",fontWeight:700,fontSize:13}}>T{tv}<div style={{fontSize:9,fontWeight:400,marginTop:2}}>{desc}</div></button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Category (select 1)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {CATEGORIES.map(c=><button key={c.id} onClick={()=>selectCat(c.id)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${f.categories.includes(c.id)?c.color:t.border}`,background:f.categories.includes(c.id)?c.bg:"transparent",color:f.categories.includes(c.id)?c.color:t.muted,cursor:"pointer",fontSize:11,fontWeight:700}}>{c.label}</button>)}
            </div>
          </div>
          {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginBottom:12,background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 12px"}}>⚠ {fetchErr}</div>}
          <button onClick={handleAdd} style={{width:"100%",background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:12,padding:14,color:"white",fontSize:15,fontWeight:800,cursor:"pointer"}}>Save Professor</button>
        </>}
      </div>
    </div>
  );
}

/* ─── SETTINGS MODAL ─── */
function SettingsModal({onClose,t,onDeleteAll}){
  const [key,setKey]   = useState(localStorage.getItem("pt_gemini_key")||"");
  const [saved,setSaved] = useState(false);
  const [ejs,setEjs]   = useState(()=>getEJSKeys());
  const [ejsSaved,setEjsSaved] = useState(false);
  const [delConfirm,setDelConfirm] = useState(false);

  const saveGemini = () => { localStorage.setItem("pt_gemini_key",key.trim()); setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const saveEJS    = () => { localStorage.setItem("pt_ejs",JSON.stringify(ejs)); setEjsSaved(true); setTimeout(()=>setEjsSaved(false),2000); };
  const setE = (k,v) => setEjs(p=>({...p,[k]:v}));

  const inp = {width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:8,padding:"11px 13px",color:t.text,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:10};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:t.card,borderRadius:16,padding:24,width:"100%",maxWidth:440,border:`1px solid ${t.border}`,margin:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontSize:17,fontWeight:800,color:t.text}}>⚙️ Settings</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.muted,cursor:"pointer"}}><X size={18}/></button>
        </div>

        {/* Gemini */}
        <div style={{fontSize:12,color:t.muted,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Gemini AI Key (optional)</div>
        <div style={{fontSize:12,color:t.muted,background:t.cardDark,borderRadius:8,padding:"9px 12px",marginBottom:10,lineHeight:1.6,border:`1px solid ${t.border}`}}>
          For AI email generation. Get free key at <a href="https://aistudio.google.com" target="_blank" style={{color:"#38BDF8"}}>aistudio.google.com</a>
        </div>
        <input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="AIzaSy…" style={inp}/>
        <button onClick={saveGemini} style={{width:"100%",background:saved?"rgba(74,222,128,0.15)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:saved?"1px solid #4ADE80":"none",borderRadius:9,padding:12,color:saved?"#4ADE80":"white",fontSize:14,fontWeight:800,cursor:"pointer",marginBottom:20}}>
          {saved?"✓ Saved!":"Save Gemini Key"}
        </button>

        {/* EmailJS */}
        <div style={{fontSize:12,color:t.muted,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>📧 Email Notifications (EmailJS)</div>
        <div style={{fontSize:12,color:t.muted,background:t.cardDark,borderRadius:8,padding:"9px 12px",marginBottom:10,lineHeight:1.7,border:`1px solid ${t.border}`}}>
          Follow-up reminders → email to <strong style={{color:t.text}}>asfahimbd@gmail.com</strong><br/>
          Setup: <a href="https://emailjs.com" target="_blank" style={{color:"#38BDF8"}}>emailjs.com</a> → Create Service (Gmail) → Create Template → Copy keys below.<br/>
          Template variables: <code style={{color:"#C084FC"}}>{"{{prof_name}} {{prof_uni}} {{days_since}} {{follow_up_date}}"}</code>
        </div>
        <input value={ejs.serviceId||""} onChange={e=>setE("serviceId",e.target.value)} placeholder="Service ID (e.g. service_xxx)" style={inp}/>
        <input value={ejs.templateId||""} onChange={e=>setE("templateId",e.target.value)} placeholder="Template ID (e.g. template_xxx)" style={inp}/>
        <input value={ejs.publicKey||""} onChange={e=>setE("publicKey",e.target.value)} placeholder="Public Key" style={inp}/>
        <button onClick={saveEJS} style={{width:"100%",background:ejsSaved?"rgba(74,222,128,0.15)":"rgba(56,189,248,0.1)",border:`1px solid ${ejsSaved?"#4ADE80":"rgba(56,189,248,0.4)"}`,borderRadius:9,padding:12,color:ejsSaved?"#4ADE80":"#38BDF8",fontSize:14,fontWeight:800,cursor:"pointer",marginBottom:20}}>
          {ejsSaved?"✓ EmailJS Saved!":"Save EmailJS Keys"}
        </button>

        {/* Danger zone */}
        <div style={{borderTop:`1px solid ${t.border}`,paddingTop:18}}>
          <div style={{fontSize:12,color:"#F87171",marginBottom:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>⚠ Danger Zone</div>
          {!delConfirm?(
            <button onClick={()=>setDelConfirm(true)} style={{width:"100%",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:12,color:"#F87171",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:10}}>
              🗑 Delete All Data (Reset Site)
            </button>
          ):(
            <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:10,padding:14,marginBottom:10}}>
              <div style={{fontSize:13,color:"#FCA5A5",marginBottom:12,fontWeight:600,lineHeight:1.5}}>⚠ This will permanently delete ALL professors, papers, emails, and activity logs from Supabase. This cannot be undone.</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setDelConfirm(false)} style={{flex:1,background:t.cardDark,border:`1px solid ${t.border}`,borderRadius:8,padding:11,color:t.muted,fontSize:14,fontWeight:700,cursor:"pointer"}}>Cancel</button>
                <button onClick={()=>{onDeleteAll();onClose();}} style={{flex:1,background:"#DC2626",border:"none",borderRadius:8,padding:11,color:"white",fontSize:14,fontWeight:800,cursor:"pointer"}}>Yes, Delete All</button>
              </div>
            </div>
          )}
          <button onClick={()=>supabase.auth.signOut()} style={{width:"100%",background:"transparent",border:`1px solid ${t.border}`,borderRadius:9,padding:11,color:t.muted,fontSize:14,fontWeight:600,cursor:"pointer"}}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

/* ─── DETAIL VIEW ─── */
function DetailView({prof,onBack,onUpdate,onDelete,t,session,logActivity}){
  const [tab,setTab]=useState("overview");
  const [doi,setDoi]=useState(""); const [fetching,setFetching]=useState(false); const [fetchErr,setFetchErr]=useState("");
  const [selPaper,setSelPaper]=useState(prof.papers?.[0]||null);
  const [paperLink,setPaperLink]=useState("");
  const [uploading,setUploading]=useState(false); const [uploadErr,setUploadErr]=useState("");
  const fileInputRef=useRef(null);
  const [email,setEmail]=useState(()=>localStorage.getItem("pt_email_draft_"+prof.id)||"");
  const [genning,setGenning]=useState(false); const [copied,setCopied]=useState(false);
  const [notes,setNotes]=useState(prof.notes||"");
  const [schedDate,setSchedDate]=useState(prof.scheduledDate||"");
  const [schedTime,setSchedTime]=useState(prof.scheduledTime||"10:09");
  const [fuDays,setFuDays]=useState(14);
  const dark=isDark(prof),ds=daysSince(prof.emailSentDate);
  const inp={background:t.input,border:`1px solid ${t.border}`,borderRadius:8,padding:"11px 13px",color:t.text,fontSize:14,outline:"none",boxSizing:"border-box"};

  /* ─ Paper fetch by DOI ─ */
  const doFetch=async()=>{
    if(!doi.trim())return; setFetching(true);setFetchErr("");
    const p=await fetchPaper(doi.trim());
    if(p){const np={...p,id:uid(),doi:doi.trim(),summary:""};onUpdate({papers:[...(prof.papers||[]),np]});setSelPaper(np);setDoi("");}
    else setFetchErr("Could not fetch paper. Check the DOI.");
    setFetching(false);
  };

  /* ─ File upload to Supabase Storage (10 MB limit) ─ */
  const handleFileUpload=async(e)=>{
    const file=e.target.files?.[0]; if(!file)return;
    setUploadErr("");
    // Size check
    if(file.size>MAX_FILE_SIZE){
      setUploadErr(`File too large (${(file.size/1024/1024).toFixed(1)} MB). Maximum is 10 MB.`);
      e.target.value=null; return;
    }
    setUploading(true);
    const fileExt=file.name.split('.').pop();
    const filePath=`${session.user.id}/${uid()}.${fileExt}`;
    const{error:uploadError}=await supabase.storage.from('papers').upload(filePath,file,{cacheControl:'3600',upsert:false});
    if(uploadError){setUploadErr("Upload failed: "+uploadError.message);setUploading(false);e.target.value=null;return;}
    const{data:{publicUrl}}=supabase.storage.from('papers').getPublicUrl(filePath);
    const np={id:uid(),title:file.name,authors:"Uploaded PDF",year:new Date().getFullYear(),source:"Cloud PDF",externalLink:publicUrl,filePath};
    onUpdate({papers:[...(prof.papers||[]),np]});
    setSelPaper(np);setUploading(false);e.target.value=null;
  };

  /* ─ Add external link ─ */
  const handleLinkAdd=()=>{
    if(!paperLink.trim())return;
    const np={id:uid(),title:"Linked Paper",authors:"External",year:new Date().getFullYear(),source:"Link",externalLink:paperLink.trim()};
    onUpdate({papers:[...(prof.papers||[]),np]});setSelPaper(np);setPaperLink("");
  };

  /* ─ Delete uploaded PDF from storage ─ */
  const deletePaper=async(paper)=>{
    if(paper.filePath){await supabase.storage.from('papers').remove([paper.filePath]);}
    onUpdate({papers:prof.papers.filter(p=>p.id!==paper.id)});
    if(selPaper?.id===paper.id)setSelPaper(null);
  };

  /* ─ Email generation ─ */
  const doGenEmail=async()=>{
    const paper=selPaper||prof.papers?.[0];
    if(!getKey()){alert("Gemini API key required. Check Settings ⚙");return;}
    setGenning(true);
    try{const e=await generateEmail(prof,paper);setEmail(e);localStorage.setItem("pt_email_draft_"+prof.id,e);}
    catch(e){alert("Error: "+e.message);}
    setGenning(false);
  };

  const markSent=()=>{
    logActivity(prof.id,prof.name,"Email Sent",prof.university);
    onUpdate({status:"email_sent",emailSentDate:today(),followUpDate:fuDate(fuDays),lastActivity:new Date().toISOString(),sentEmailText:email});
  };
  const markScheduled=()=>{
    if(!schedDate)return;
    logActivity(prof.id,prof.name,"Scheduled",schedDate+" at "+schedTime);
    onUpdate({status:"scheduled",scheduledDate:schedDate,scheduledTime:schedTime,lastActivity:new Date().toISOString()});
  };

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      {/* Header */}
      <div style={{background:dark?t.dangerBg:t.card,padding:"18px 24px",borderBottom:`1px solid ${dark?t.dangerBorder:t.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:6,marginBottom:14,fontSize:13,fontWeight:700}}><ArrowLeft size={15}/> Back</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:12,color:t.muted,marginBottom:4,fontFamily:"'SF Mono',monospace"}}>{FLAGS[prof.country]||"🌍"} {prof.country} · <span style={{color:prof.tier===1?"#F87171":prof.tier===2?"#FBBF24":"#4ADE80",fontWeight:700}}>Tier {prof.tier}</span></div>
            <div style={{fontSize:21,fontWeight:900,margin:"4px 0",letterSpacing:"-0.5px",color:t.text}}>{prof.name}</div>
            <div style={{fontSize:14,color:t.mutedText}}>{prof.university}</div>
          </div>
          <button onClick={()=>{if(window.confirm(`Remove ${prof.name}?`)){onDelete();}}} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:"9px 12px",cursor:"pointer",display:"flex"}}><Trash2 size={15} color="#F87171"/></button>
        </div>
        {/* Status pills */}
        <div style={{marginTop:14,display:"flex",gap:6,flexWrap:"wrap"}}>
          {Object.entries(STATUS).map(([k,v])=>(
            <button key={k} onClick={()=>{logActivity(prof.id,prof.name,v.label);onUpdate({status:k,lastActivity:new Date().toISOString()});}}
              style={{padding:"5px 11px",borderRadius:20,border:`1px solid ${prof.status===k?v.dot+"99":t.border}`,background:prof.status===k?v.dot+"22":"transparent",color:prof.status===k?v.color:t.muted,cursor:"pointer",fontSize:11,fontWeight:prof.status===k?800:600,transition:"all 0.15s"}}>
              {v.label}
            </button>
          ))}
        </div>
        {dark&&<div style={{marginTop:12,background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:9,padding:"10px 14px",fontSize:13,color:"#FCA5A5",fontWeight:600}}>
          ⚠ {ds} days since email — no reply. Consider a follow-up or update status.
        </div>}
        {prof.status==="scheduled"&&prof.scheduledDate&&<div style={{marginTop:10,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:9,padding:"10px 14px",fontSize:13,color:"#C084FC",fontWeight:600}}>
          📅 {prof.scheduledDate} · {prof.scheduledTime} {(COUNTRY_TZ[prof.country]||'America/New_York').split('/').pop().replace('_',' ')} time
        </div>}
      </div>
      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${t.border}`,background:t.cardDark,position:"sticky",top:0,zIndex:10}}>
        {[["overview","Overview"],["papers","Papers 📄"],["email","Email 🤖"]].map(([tb,lbl])=>(
          <button key={tb} onClick={()=>setTab(tb)} style={{flex:1,padding:14,border:"none",background:"none",color:tab===tb?"#38BDF8":t.muted,fontWeight:tab===tb?800:600,fontSize:14,cursor:"pointer",borderBottom:tab===tb?"3px solid #38BDF8":"3px solid transparent",transition:"all 0.2s"}}>{lbl}</button>
        ))}
      </div>
      <div style={{padding:22,flex:1}}>
        {/* ── OVERVIEW ── */}
        {tab==="overview"&&<>
          <div style={{background:t.card,borderRadius:13,padding:18,marginBottom:14,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:11,color:t.muted,marginBottom:8,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>Research Focus</div>
            <div style={{fontSize:14,lineHeight:1.7,color:t.text}}>{prof.researchFocus||"—"}</div>
          </div>
          {/* Schedule */}
          <div style={{background:t.card,borderRadius:13,padding:18,marginBottom:14,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:11,color:t.muted,marginBottom:12,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>📅 Schedule Email</div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)} style={{...inp,flex:1}}/>
              <input type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)} style={{...inp,width:88}}/>
            </div>
            {schedDate&&(()=>{
              const info=getScheduleInfo(prof.country,schedDate);
              const[h,m]=schedTime.split(':').map(Number);
              const ref=new Date(schedDate+'T12:00:00');
              const diff=getTzOffsetMin(BD_TZ,ref)-getTzOffsetMin(COUNTRY_TZ[prof.country]||'America/New_York',ref);
              const bdMin=((h*60+m+diff)%1440+1440)%1440;
              const bdT=String(Math.floor(bdMin/60)).padStart(2,'0')+':'+String(bdMin%60).padStart(2,'0');
              return(<div style={{background:"rgba(56,189,248,0.07)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,padding:"10px 13px",marginBottom:10}}>
                <div style={{fontSize:13,color:"#38BDF8",fontWeight:800}}>{schedTime} {info.tzLabel} = <span style={{color:t.text}}>{bdT}</span> Bangladesh time</div>
              </div>);
            })()}
            <button onClick={()=>{if(schedDate){const i=getScheduleInfo(prof.country,schedDate);setSchedTime(i.profTime);}}} style={{width:"100%",background:t.hover,border:`1px solid ${t.border}`,borderRadius:8,padding:9,color:t.mutedText,cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:8}}>
              ⚡ Set to 10:17 AM {prof.country} time {schedDate?(()=>{const i=getScheduleInfo(prof.country,schedDate);return`(= ${i.bdTime} BD)`;})():""}
            </button>
            <button onClick={markScheduled} style={{width:"100%",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.4)",borderRadius:9,padding:12,color:"#C084FC",cursor:"pointer",fontSize:14,fontWeight:700}}>
              <Calendar size={14} style={{marginRight:6,verticalAlign:"middle"}}/>Mark as Scheduled
            </button>
          </div>
          {/* Mark Sent */}
          <div style={{background:t.card,borderRadius:13,padding:18,marginBottom:14,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:11,color:t.muted,marginBottom:12,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>✉️ Mark Email Sent</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:13,color:t.mutedText}}>Follow-up after</span>
              <select value={fuDays} onChange={e=>setFuDays(+e.target.value)} style={{...inp,padding:"6px 10px",flex:"none"}}>
                {[7,14,21].map(d=><option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:9,padding:12,color:"#38BDF8",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              <Send size={14}/>Mark Email Sent Today
            </button>
          </div>
          {prof.emailSentDate&&<div style={{background:t.card,borderRadius:13,padding:16,marginBottom:14,border:`1px solid ${t.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Email Sent",prof.emailSentDate],["Follow-up",prof.followUpDate||"Not set"]].map(([k,v])=>(
              <div key={k} style={{background:t.cardDark,borderRadius:8,padding:12,border:`1px solid ${t.border}`}}>
                <div style={{fontSize:10,color:t.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>{k}</div>
                <div style={{fontSize:13,color:t.text,fontFamily:"'SF Mono',monospace",fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>}
          {prof.sentEmailText&&<div style={{background:t.card,borderRadius:13,padding:18,marginBottom:14,border:"1px solid rgba(74,222,128,0.3)"}}>
            <div style={{fontSize:11,color:"#4ADE80",marginBottom:8,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px",display:"flex",alignItems:"center",gap:5}}><CheckCircle size={13}/>Sent Email</div>
            <div style={{fontSize:13,lineHeight:1.7,color:t.mutedText,whiteSpace:"pre-wrap"}}>{prof.sentEmailText}</div>
          </div>}
          <div style={{background:t.card,borderRadius:13,padding:18,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:11,color:t.muted,marginBottom:8,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.8px"}}>📝 Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} onBlur={()=>onUpdate({notes})}
              placeholder="Notes about funding, lab culture, contacts…"
              style={{...inp,width:"100%",minHeight:80,resize:"vertical",lineHeight:1.6,fontFamily:"inherit"}}/>
          </div>
        </>}

        {/* ── PAPERS ── */}
        {tab==="papers"&&<>
          <div style={{background:t.card,borderRadius:13,padding:18,marginBottom:16,border:`1px solid ${t.border}`}}>
            <div style={{fontSize:13,fontWeight:800,color:t.text,marginBottom:14}}>➕ Add a Paper</div>
            {/* DOI fetch */}
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input value={doi} onChange={e=>setDoi(e.target.value)} placeholder="DOI — e.g. 10.1038/s41524-…" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&doFetch()}/>
              <button onClick={doFetch} disabled={fetching} style={{background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.4)",borderRadius:8,padding:"0 16px",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,height:46,whiteSpace:"nowrap"}}>
                {fetching?<RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>:<Search size={14}/>}Fetch
              </button>
            </div>
            {fetchErr&&<div style={{fontSize:12,color:"#F87171",marginBottom:10}}>{fetchErr}</div>}
            {/* External link */}
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input value={paperLink} onChange={e=>setPaperLink(e.target.value)} placeholder="Google Drive / Web link to paper" style={{...inp,flex:1}} onKeyDown={e=>e.key==="Enter"&&handleLinkAdd()}/>
              <button onClick={handleLinkAdd} style={{background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.4)",borderRadius:8,padding:"0 16px",color:"#4ADE80",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,height:46,whiteSpace:"nowrap"}}><LinkIcon size={14}/>Add Link</button>
            </div>
            {/* PDF upload */}
            <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileUpload} style={{display:"none"}}/>
            <button onClick={()=>{setUploadErr("");fileInputRef.current.click();}} disabled={uploading}
              style={{width:"100%",background:t.hover,border:`1px dashed ${t.muted}`,borderRadius:9,padding:13,color:t.mutedText,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,fontWeight:600}}>
              {uploading?<Loader size={15} style={{animation:"spin 1s linear infinite"}}/>:<Upload size={15}/>}
              {uploading?"Uploading to cloud…":"Upload PDF to Cloud (max 10 MB)"}
            </button>
            {uploadErr&&<div style={{fontSize:12,color:"#F87171",marginTop:8,background:"rgba(239,68,68,0.08)",borderRadius:7,padding:"8px 12px"}}>{uploadErr}</div>}
            <div style={{fontSize:11,color:t.muted,marginTop:6,textAlign:"center"}}>PDF saved to Supabase Storage — accessible from any device</div>
          </div>

          {(!prof.papers||prof.papers.length===0)&&<div style={{textAlign:"center",color:t.muted,padding:"40px 20px",fontSize:14}}>
            <BookOpen size={34} style={{opacity:0.3,display:"block",margin:"0 auto 12px"}}/>No papers yet. Add by DOI, link, or upload PDF above.
          </div>}

          {prof.papers?.map(paper=>(
            <div key={paper.id} style={{background:t.card,borderRadius:13,padding:18,marginBottom:12,border:`2px solid ${selPaper?.id===paper.id?"#38BDF8":t.border}`,transition:"all 0.2s"}}>
              <div style={{fontSize:14,fontWeight:700,lineHeight:1.4,marginBottom:6,color:t.text}}>{paper.title}</div>
              <div style={{fontSize:11,color:t.muted,marginBottom:10,fontFamily:"'SF Mono',monospace"}}>{paper.authors} · {paper.year} · {paper.source}</div>
              {paper.abstract&&<div style={{fontSize:12,color:t.mutedText,lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{paper.abstract}</div>}
              {paper.externalLink&&<a href={paper.externalLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:"#38BDF8",marginBottom:10,textDecoration:"none",background:"rgba(56,189,248,0.1)",padding:"5px 10px",borderRadius:6,fontWeight:700}}>
                <ExternalLink size={12}/>Open Paper
              </a>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setSelPaper(paper);setTab("email");}} style={{flex:1,background:"rgba(2,132,199,0.1)",border:"1px solid rgba(56,189,248,0.35)",borderRadius:9,padding:"9px 12px",color:"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <Brain size={13}/>Use for Email
                </button>
                <button onClick={()=>deletePaper(paper)} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:9,padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                  <Trash2 size={13} color="#F87171"/>
                </button>
              </div>
            </div>
          ))}
        </>}

        {/* ── EMAIL ── */}
        {tab==="email"&&<>
          {selPaper?(
            <div style={{background:"rgba(14,116,144,0.12)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:11,padding:14,marginBottom:14}}>
              <div style={{fontSize:10,color:"#38BDF8",fontWeight:800,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px"}}>📄 Selected Paper</div>
              <div style={{fontSize:14,fontWeight:700,color:t.text}}>{selPaper.title}</div>
            </div>
          ):prof.papers?.length>0?(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:t.muted,marginBottom:8,fontWeight:600}}>Select paper for email:</div>
              {prof.papers.map(p=><button key={p.id} onClick={()=>setSelPaper(p)} style={{display:"block",width:"100%",textAlign:"left",background:selPaper?.id===p.id?"rgba(14,116,144,0.15)":t.card,border:`2px solid ${selPaper?.id===p.id?"#38BDF8":t.border}`,borderRadius:9,padding:12,color:t.text,cursor:"pointer",marginBottom:6,fontSize:13,fontWeight:600}}>{p.title}</button>)}
            </div>
          ):(
            <div style={{background:"rgba(120,53,15,0.15)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:10,padding:12,marginBottom:14,fontSize:13,color:"#FCD34D"}}>
              ⚠ Add a paper first (Papers tab) for a more specific, strong email.
            </div>
          )}
          {/* Quick templates */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:t.muted,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Quick Template</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Object.entries(EMAIL_TEMPLATES).map(([key,tmpl])=>(
                <button key={key} onClick={()=>{
                  const filled=tmpl.body
                    .replace(/\[Lastname\]/g,prof.name.split(" ").pop())
                    .replace(/\[Prof Name\]/g,prof.name.split(" ").pop())
                    .replace(/\[DATE SENT\]/g,prof.emailSentDate||"[date]");
                  setEmail(filled);localStorage.setItem("pt_email_draft_"+prof.id,filled);
                }} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${key==="followup"?"rgba(251,191,36,0.4)":t.border}`,background:key==="followup"?"rgba(251,191,36,0.08)":t.cardDark,color:key==="followup"?"#FBBF24":t.mutedText,cursor:"pointer",fontSize:12,fontWeight:700}}>{tmpl.label}</button>
              ))}
            </div>
          </div>
          {/* Generate with Gemini */}
          <button onClick={doGenEmail} disabled={genning} style={{width:"100%",background:genning?"rgba(124,58,237,0.4)":"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:12,padding:14,color:"white",fontSize:14,fontWeight:800,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:genning?0.8:1}}>
            {genning?<RefreshCw size={17} style={{animation:"spin 1s linear infinite"}}/>:<Brain size={17}/>}
            {genning?"Generating…":"Generate Email with Gemini AI"}
          </button>
          {!getKey()&&<div style={{fontSize:11,color:t.muted,textAlign:"center",marginBottom:14}}>No Gemini key set — use templates above or set key in ⚙ Settings</div>}
          {/* Email textarea */}
          {email&&<>
            <div style={{background:t.card,borderRadius:13,padding:18,marginBottom:12,border:`1px solid ${t.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:800,color:t.text,textTransform:"uppercase",letterSpacing:"0.5px"}}>Email Draft <span style={{color:t.muted,fontWeight:400,fontSize:10,textTransform:"none"}}>· auto-saved</span></div>
                <button onClick={()=>{navigator.clipboard.writeText(email);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
                  style={{background:copied?"rgba(22,163,74,0.15)":"rgba(2,132,199,0.1)",border:`1px solid ${copied?"rgba(74,222,128,0.4)":"rgba(56,189,248,0.35)"}`,borderRadius:8,padding:"6px 12px",color:copied?"#4ADE80":"#38BDF8",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5,transition:"all 0.2s"}}>
                  <Copy size={12}/>{copied?"Copied!":"Copy"}
                </button>
              </div>
              <textarea value={email} onChange={e=>{setEmail(e.target.value);localStorage.setItem("pt_email_draft_"+prof.id,e.target.value);}}
                style={{...inp,width:"100%",minHeight:360,resize:"vertical",lineHeight:1.8,fontFamily:"Georgia,serif",fontSize:14}}/>
            </div>
            <div style={{fontSize:12,color:t.muted,marginBottom:12}}>✏️ Edit above. Add 1-2 minor tweaks to sound more natural.</div>
            <button onClick={markSent} style={{width:"100%",background:"rgba(22,163,74,0.1)",border:"1px solid rgba(74,222,128,0.35)",borderRadius:12,padding:14,color:"#4ADE80",cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <CheckCircle size={17}/>Mark as Sent (saves email text)
            </button>
          </>}
          {!email&&<div style={{textAlign:"center",color:t.muted,padding:"30px 0",fontSize:13}}>Choose a template above or generate with Gemini AI.</div>}
        </>}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App(){
  const [session,setSession]=useState(null);
  const [authChecked,setAuthChecked]=useState(false);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthChecked(true);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);
  if(!authChecked)return<div style={{background:"#030712",minHeight:"100vh"}}/>;
  if(!session)return<AuthGate/>;
  return<ProfTracker session={session}/>;
}

/* ─── PROF TRACKER (main logic) ─── */
function ProfTracker({session}){
  const [themeMode,setThemeMode]=useState(()=>localStorage.getItem("pt_theme")||"dark");
  const t=THEMES[themeMode];
  const cycleTheme=()=>{
    const idx=THEME_CYCLE.indexOf(themeMode);
    const next=THEME_CYCLE[(idx+1)%THEME_CYCLE.length];
    setThemeMode(next);localStorage.setItem("pt_theme",next);
  };

  const [profs,setProfs]=useState([]);
  const [activityLog,setActivityLog]=useState([]);
  const [view,setView]=useState("home");
  const [catId,setCatId]=useState(null);
  const [profId,setProfId]=useState(null);
  const [addModal,setAddModal]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showNotif,setShowNotif]=useState(false);
  const [notifSent,setNotifSent]=useState(()=>{ try{return JSON.parse(localStorage.getItem("pt_notif_sent")||"[]");}catch{return[];} });
  const [search,setSearch]=useState("");
  const [cFilter,setCFilter]=useState("All");
  const [tFilter,setTFilter]=useState("All");
  const [sFilter,setSFilter]=useState("All");
  const [dataLoaded,setDataLoaded]=useState(false);

  /* ─ Load from Supabase (migrate from localStorage if needed) ─ */
  useEffect(()=>{
    const load=async()=>{
      const{data:pData}=await supabase.from('prof_data').select('data');
      const local=localStorage.getItem('pt_v2');
      if((!pData||pData.length===0)&&local){
        const parsed=JSON.parse(local);
        if(parsed.length>0){
          for(const p of parsed)await supabase.from('prof_data').insert({id:p.id,user_id:session.user.id,data:p});
          localStorage.removeItem('pt_v2');setProfs(parsed);
        }
      }else if(pData)setProfs(pData.map(r=>r.data));
      const{data:aData}=await supabase.from('activity_data').select('data').order('created_at',{ascending:false}).limit(30);
      const localLog=localStorage.getItem('pt_log');
      if((!aData||aData.length===0)&&localLog){
        const parsed=JSON.parse(localLog);
        for(const a of parsed)await supabase.from('activity_data').insert({id:a.id,user_id:session.user.id,data:a});
        localStorage.removeItem('pt_log');setActivityLog(parsed);
      }else if(aData)setActivityLog(aData.map(r=>r.data));
      setDataLoaded(true);
    };
    load();
  },[session]);

  /* ─ Browser + email notifications ─ */
  useEffect(()=>{
    if("Notification" in window&&Notification.permission==="default")Notification.requestPermission();
    if(profs.length===0)return;
    const due=profs.filter(p=>p.followUpDate&&daysSince(p.followUpDate)>=0&&p.status==="email_sent");
    due.slice(0,3).forEach(p=>{
      // Browser notification
      if(Notification.permission==="granted")
        new Notification("📧 Follow-up Due — ProfTracker",{body:`Follow up with ${p.name} (${p.university})`});
      // Email notification (if not already sent today for this prof)
      const todayKey=`${p.id}_${today()}`;
      if(!notifSent.includes(todayKey)){
        const ejsKeys=getEJSKeys();
        if(ejsKeys.serviceId){
          sendFollowUpEmail(p,ejsKeys).then(ok=>{
            if(ok){
              const updated=[...notifSent,todayKey].slice(-50);
              setNotifSent(updated);
              localStorage.setItem("pt_notif_sent",JSON.stringify(updated));
            }
          });
        }
      }
    });
  },[profs]);

  /* ─ CRUD ─ */
  const update=async(id,upd)=>{
    const up={...profs.find(p=>p.id===id),...upd};
    setProfs(p=>p.map(x=>x.id===id?up:x));
    await supabase.from('prof_data').update({data:up}).eq('id',id);
  };
  const del=async(id)=>{
    setProfs(p=>p.filter(x=>x.id!==id));
    await supabase.from('prof_data').delete().eq('id',id);
  };
  const add=async(prof)=>{
    setProfs(p=>[...p,prof]);
    await supabase.from('prof_data').insert({id:prof.id,user_id:session.user.id,data:prof});
    logAct(prof.id,prof.name,"Professor Added",prof.university);
  };
  const logAct=async(profId,profName,action,detail="")=>{
    const a={id:uid(),profId,profName,action,detail,time:new Date().toISOString()};
    setActivityLog(prev=>[a,...prev].slice(0,30));
    await supabase.from('activity_data').insert({id:a.id,user_id:session.user.id,data:a});
  };

  const exportData=()=>{const b=new Blob([JSON.stringify(profs,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="proftracker_backup.json";a.click();};

  const deleteAll=async()=>{
    // Delete all prof data and activity from Supabase
    await supabase.from('prof_data').delete().eq('user_id',session.user.id);
    await supabase.from('activity_data').delete().eq('user_id',session.user.id);
    // Delete all uploaded PDFs
    const{data:files}=await supabase.storage.from('papers').list(session.user.id);
    if(files?.length){
      const paths=files.map(f=>`${session.user.id}/${f.name}`);
      await supabase.storage.from('papers').remove(paths);
    }
    // Clear local state
    setProfs([]);setActivityLog([]);
    localStorage.removeItem("pt_notif_sent");
  };

  const followUps=profs.filter(p=>p.followUpDate&&daysSince(p.followUpDate)>=0&&p.status==="email_sent");
  const darkCards=profs.filter(isDark);
  const stats={total:profs.length,sent:profs.filter(p=>["email_sent","replied","interview"].includes(p.status)).length,replied:profs.filter(p=>["replied","interview"].includes(p.status)).length,fu:followUps.length};
  const getCatProfs=id=>profs.filter(p=>p.categories?.includes(id));
  const nav=id=>{setCatId(id);setCFilter("All");setTFilter("All");setSFilter("All");setSearch("");setView("category");};

  if(!dataLoaded)return<div style={{background:t.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:t.text}}><Loader size={28} style={{animation:"spin 1s linear infinite"}}/></div>;

  return(
    <div style={{background:t.bg,color:t.text,minHeight:"100vh",display:"flex",justifyContent:"center",fontFamily:"'SF Pro Display',-apple-system,system-ui,sans-serif"}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} body{background:${t.bg};margin:0;}`}</style>
      <div style={{width:"100%",maxWidth:1380,background:t.card,boxShadow:"0 0 60px rgba(0,0,0,0.2)",display:"flex",flexDirection:"column",minHeight:"100vh"}}>

        {/* TOP BAR */}
        <div style={{background:t.card,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${t.border}`,position:"sticky",top:0,zIndex:50}}>
          <div style={{cursor:"pointer"}} onClick={()=>setView("home")}>
            <div style={{fontSize:19,fontWeight:900,letterSpacing:"-0.8px",background:"linear-gradient(135deg,#38BDF8,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🎓 ProfTracker</div>
            <div style={{fontSize:11,color:t.muted,fontFamily:"'SF Mono',monospace",marginTop:1,fontWeight:600}}>PhD Outreach — Fall 2027</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={cycleTheme} title={`Theme: ${THEMES[themeMode].label}`} style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:9,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:700,color:t.mutedText}}>
              {THEME_ICONS[themeMode]} {THEMES[themeMode].label}
            </button>
            <button onClick={exportData} title="Export JSON" style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:9,padding:9,cursor:"pointer",display:"flex"}}><Download size={16} color={t.muted}/></button>
            <button onClick={()=>setShowSettings(true)} style={{background:t.hover,border:`1px solid ${t.border}`,borderRadius:9,padding:9,cursor:"pointer",display:"flex"}}><Settings size={16} color={t.muted}/></button>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowNotif(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",position:"relative",display:"flex",padding:4}}>
                <Bell size={22} color={followUps.length>0?"#F87171":t.muted}/>
                {followUps.length>0&&<div style={{position:"absolute",top:-4,right:-4,background:"#DC2626",color:"white",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{followUps.length}</div>}
              </button>
              {showNotif&&(
                <div style={{position:"absolute",top:"calc(100% + 10px)",right:0,width:320,background:t.card,border:`1px solid ${t.border}`,borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.25)",zIndex:200,overflow:"hidden"}}>
                  <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:800,color:t.text}}>🔔 Notifications</span>
                    <button onClick={()=>setShowNotif(false)} style={{background:"none",border:"none",color:t.muted,cursor:"pointer"}}><X size={14}/></button>
                  </div>
                  <div style={{maxHeight:360,overflowY:"auto"}}>
                    {followUps.length===0&&profs.filter(isDark).length===0?(
                      <div style={{padding:"24px 16px",textAlign:"center",color:t.muted,fontSize:13}}>No notifications 🎉</div>
                    ):null}
                    {followUps.map(p=>(
                      <div key={p.id} onClick={()=>{setProfId(p.id);setView("detail");setShowNotif(false);}} style={{padding:"12px 16px",borderBottom:`1px solid ${t.border}`,cursor:"pointer",background:"rgba(220,38,38,0.05)",transition:"background 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(220,38,38,0.1)"}
                        onMouseLeave={e=>e.currentTarget.style.background="rgba(220,38,38,0.05)"}>
                        <div style={{fontSize:13,fontWeight:700,color:"#F87171",marginBottom:2}}>📧 Follow-up Due</div>
                        <div style={{fontSize:13,color:t.text,fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:11,color:t.muted,marginTop:2}}>{p.university} · emailed {daysSince(p.emailSentDate)}d ago</div>
                      </div>
                    ))}
                    {profs.filter(isDark).filter(p=>!followUps.find(f=>f.id===p.id)).map(p=>(
                      <div key={p.id} onClick={()=>{setProfId(p.id);setView("detail");setShowNotif(false);}} style={{padding:"12px 16px",borderBottom:`1px solid ${t.border}`,cursor:"pointer",transition:"background 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=t.hover}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{fontSize:13,fontWeight:700,color:"#FB923C",marginBottom:2}}>⚠ No Reply</div>
                        <div style={{fontSize:13,color:t.text,fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:11,color:t.muted,marginTop:2}}>{p.university} · {daysSince(p.emailSentDate)}d since email</div>
                      </div>
                    ))}
                    {getEJSKeys().serviceId&&followUps.length>0&&<div style={{padding:"10px 16px",background:"rgba(74,222,128,0.06)",borderTop:`1px solid ${t.border}`,fontSize:11,color:"#4ADE80",fontWeight:600}}>
                      ✓ Email reminders active — sending to {FAHIM_EMAIL}
                    </div>}
                    {!getEJSKeys().serviceId&&<div style={{padding:"10px 16px",background:t.cardDark,borderTop:`1px solid ${t.border}`,fontSize:11,color:t.muted}}>
                      💡 Set up EmailJS in ⚙ Settings for email reminders to {FAHIM_EMAIL}
                    </div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOLLOW-UP BANNER */}
        {followUps.length>0&&<div style={{background:"rgba(220,38,38,0.12)",borderBottom:"1px solid rgba(239,68,68,0.25)",padding:"11px 24px",display:"flex",gap:10,alignItems:"center"}}>
          <AlertTriangle size={15} color="#FCA5A5"/>
          <span style={{fontSize:14,color:"#FCA5A5",fontWeight:700}}>Follow-up due: {followUps[0].name}{followUps.length>1?` (+${followUps.length-1} more)`:""}</span>
          <button onClick={()=>{setProfId(followUps[0].id);setView("detail");}} style={{marginLeft:"auto",background:"none",border:"1px solid #FCA5A580",borderRadius:7,padding:"5px 12px",color:"#FCA5A5",cursor:"pointer",fontSize:13,fontWeight:700}}>View →</button>
        </div>}

        {/* MAIN LAYOUT */}
        <div style={{display:"flex",flex:1,alignItems:"flex-start"}}>
          {/* LEFT CONTENT */}
          <div style={{flex:1,minWidth:0,paddingBottom:80}}>

            {/* HOME */}
            {view==="home"&&<div style={{padding:24}}>
              {/* Stats */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28,animation:"fadeIn 0.4s ease"}}>
                {[{lbl:"Professors",val:stats.total,icon:Users,c:"#38BDF8"},{lbl:"Emailed",val:stats.sent,icon:Mail,c:"#C084FC"},{lbl:"Replied",val:stats.replied,icon:CheckCircle,c:"#4ADE80"},{lbl:"Follow-ups",val:stats.fu,icon:Bell,c:"#FBBF24"}].map(({lbl,val,icon:Icon,c})=>(
                  <div key={lbl} style={{background:t.cardDark,borderRadius:13,padding:"16px 14px",border:`1px solid ${t.border}`}}>
                    <Icon size={17} color={c}/>
                    <div style={{fontSize:26,fontWeight:900,marginTop:8,color:c,letterSpacing:"-1px"}}>{val}</div>
                    <div style={{fontSize:11,color:t.muted,marginTop:3,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{lbl}</div>
                  </div>
                ))}
              </div>
              {/* Categories */}
              <div style={{fontSize:11,color:t.muted,fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>Research Categories</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginBottom:28}}>
                {CATEGORIES.map((cat,i)=>{
                  const cp=getCatProfs(cat.id),sent=cp.filter(p=>["email_sent","replied","interview"].includes(p.status)).length,Icon=cat.icon;
                  return(
                    <button key={cat.id} onClick={()=>nav(cat.id)} style={{background:cat.bg,border:`1px solid ${cat.color}33`,borderRadius:15,padding:18,textAlign:"left",cursor:"pointer",transition:"transform 0.15s",animation:`fadeIn 0.4s ease ${i*0.04}s both`}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><Icon size={22} color={cat.color}/><ChevronRight size={14} color={cat.color+"88"}/></div>
                      <div style={{fontSize:14,fontWeight:800,color:t.text,marginBottom:3,letterSpacing:"-0.3px"}}>{cat.label}</div>
                      <div style={{fontSize:12,color:t.mutedText,fontWeight:600}}>{cp.length} profs · {sent} contacted</div>
                      <div style={{marginTop:10,background:"rgba(0,0,0,0.15)",borderRadius:4,height:3,overflow:"hidden"}}>
                        <div style={{width:cp.length?`${(sent/cp.length)*100}%`:"0%",background:`linear-gradient(90deg,${cat.color}99,${cat.color})`,height:"100%",borderRadius:4,transition:"width 0.6s ease"}}/>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* No response */}
              {darkCards.length>0&&<div style={{marginBottom:24}}>
                <div style={{fontSize:11,color:"#F87171",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>⚠ No Response (14+ Days)</div>
                {darkCards.map(p=>(
                  <div key={p.id} style={{background:t.dangerBg,border:`1px solid ${t.dangerBorder}`,borderRadius:11,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div><div style={{fontSize:14,fontWeight:700,color:t.text}}>{p.name}</div><div style={{fontSize:12,color:t.muted,marginTop:3,fontFamily:"'SF Mono',monospace"}}>{daysSince(p.emailSentDate)}d · {p.university}</div></div>
                    <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#F87171",borderRadius:7,padding:"6px 12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>View</button>
                  </div>
                ))}
              </div>}
              {/* Scheduled today */}
              {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).length>0&&<div style={{marginBottom:24}}>
                <div style={{fontSize:11,color:"#C084FC",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>📅 Send Today</div>
                {profs.filter(p=>p.status==="scheduled"&&p.scheduledDate===today()).map(p=>(
                  <div key={p.id} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(192,132,252,0.25)",borderRadius:11,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div><div style={{fontSize:14,fontWeight:700,color:t.text}}>{p.name}</div><div style={{fontSize:12,color:t.mutedText,marginTop:3}}>{p.scheduledTime} local · {p.university}</div></div>
                    <button onClick={()=>{setProfId(p.id);setView("detail");}} style={{background:"rgba(192,132,252,0.12)",border:"1px solid rgba(192,132,252,0.35)",color:"#C084FC",borderRadius:7,padding:"6px 12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Open</button>
                  </div>
                ))}
              </div>}
            </div>}

            {/* CATEGORY VIEW */}
            {view==="category"&&catId&&(()=>{
              const cat=CATEGORIES.find(c=>c.id===catId);
              let list=getCatProfs(catId);
              if(cFilter!=="All")list=list.filter(p=>p.country===cFilter);
              if(tFilter!=="All")list=list.filter(p=>p.tier===+tFilter);
              if(sFilter!=="All")list=list.filter(p=>p.status===sFilter);
              if(search)list=list.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.university.toLowerCase().includes(search.toLowerCase()));
              const countries=["All",...new Set(getCatProfs(catId).map(p=>p.country))];
              const Icon=cat?.icon||Cpu;
              return(
                <div style={{animation:"fadeIn 0.3s ease"}}>
                  <div style={{background:t.cardDark,padding:"14px 24px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${t.border}`}}>
                    <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:"#38BDF8",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:700}}><ArrowLeft size={15}/>Back</button>
                    <div style={{width:1,height:18,background:t.border}}/>
                    <Icon size={18} color={cat?.color}/><span style={{fontSize:17,fontWeight:800,color:t.text}}>{cat?.label}</span>
                    <span style={{marginLeft:"auto",background:cat?.bg,color:cat?.color,padding:"3px 10px",borderRadius:12,fontSize:12,fontWeight:800}}>{list.length} of {getCatProfs(catId).length}</span>
                  </div>
                  <div style={{padding:"12px 24px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,background:t.card,border:`1px solid ${t.border}`,borderRadius:9,padding:"9px 13px",flex:1,minWidth:160}}>
                      <Search size={14} color={t.muted}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{background:"none",border:"none",color:t.text,outline:"none",fontSize:14,width:"100%"}}/>
                    </div>
                    {[[countries,cFilter,setCFilter,"Country"],[["All","1","2","3"],tFilter,setTFilter,"Tier"],[["All",...Object.keys(STATUS)],sFilter,setSFilter,"Status"]].map(([opts,val,fn,ph],i)=>(
                      <select key={i} value={val} onChange={e=>fn(e.target.value)} style={{background:t.card,border:`1px solid ${t.border}`,color:val==="All"?t.muted:t.text,borderRadius:9,padding:"9px 12px",fontSize:13,outline:"none",fontWeight:600}}>
                        {opts.map(o=><option key={o} value={o}>{o==="All"?ph:(i===1?`Tier ${o}`:(STATUS[o]?.label||o))}</option>)}
                      </select>
                    ))}
                  </div>
                  <div style={{padding:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                    {list.map(p=><ProfCard key={p.id} prof={p} t={t} onClick={()=>{setProfId(p.id);setView("detail");}}/>)}
                    {list.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:t.muted,padding:60,fontSize:15,fontWeight:600}}>No professors match filters.</div>}
                  </div>
                </div>
              );
            })()}

            {/* DETAIL VIEW */}
            {view==="detail"&&profId&&(()=>{
              const prof=profs.find(p=>p.id===profId);
              if(!prof){setView("home");return null;}
              return<DetailView prof={prof} t={t} session={session} logActivity={logAct} onBack={()=>setView(catId?"category":"home")} onUpdate={upd=>update(profId,upd)} onDelete={()=>{del(profId);setView("home");}}/>;
            })()}
          </div>

          {/* RIGHT SIDEBAR — RECENT ACTIVITY */}
          <div style={{width:320,flexShrink:0,position:"sticky",top:56,height:"calc(100vh - 56px)",borderLeft:`1px solid ${t.border}`,background:t.cardDark,overflowY:"auto",padding:"20px 16px"}}>
            <div style={{fontSize:11,color:t.muted,fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:18,display:"flex",alignItems:"center",gap:7}}>
              <Clock size={13}/> Recent Activity
            </div>
            {activityLog.length===0&&<div style={{textAlign:"center",color:t.muted,fontSize:13,padding:"24px 0",lineHeight:1.6}}>No activity yet.<br/>Add a professor or update a status.</div>}
            {activityLog.map(a=>(
              <div key={a.id} onClick={()=>{if(a.profId){setProfId(a.profId);setView("detail");}}}
                style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 10px",borderBottom:`1px solid ${t.border}`,cursor:a.profId?"pointer":"default",borderRadius:8,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=t.hover}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:30,height:30,borderRadius:"50%",background:a.action.includes("Sent")?"rgba(2,132,199,0.15)":a.action.includes("Replied")||a.action.includes("Interview")?"rgba(22,163,74,0.15)":a.action.includes("Added")?"rgba(124,58,237,0.15)":"rgba(71,85,105,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                  {a.action.includes("Sent")?<Mail size={13} color="#38BDF8"/>:a.action.includes("Replied")||a.action.includes("Interview")?<CheckCircle size={13} color="#4ADE80"/>:a.action.includes("Added")?<Plus size={13} color="#C084FC"/>:<Clock size={13} color={t.muted}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.profName}</div>
                  <div style={{fontSize:12,color:t.mutedText,marginTop:3}}>{a.action}{a.detail?" · "+a.detail:""}</div>
                  <div style={{fontSize:10,color:t.muted,fontFamily:"'SF Mono',monospace",marginTop:5,fontWeight:600}}>{timeAgo(a.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAB */}
        <button onClick={()=>setAddModal(true)} style={{position:"fixed",bottom:28,right:340,background:"linear-gradient(135deg,#0369A1,#7C3AED)",border:"none",borderRadius:"50%",width:58,height:58,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 6px 28px rgba(124,58,237,0.45)",zIndex:100}}>
          <Plus color="white" size={24}/>
        </button>
        {addModal&&<AddModal t={t} profs={profs} defaultCat={catId} onAdd={p=>{add(p);setAddModal(false);}} onClose={()=>setAddModal(false)}/>}
        {showSettings&&<SettingsModal t={t} onClose={()=>setShowSettings(false)} onDeleteAll={deleteAll}/>}
      </div>
    </div>
  );
}
